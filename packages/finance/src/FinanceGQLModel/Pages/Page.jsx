// Importuje React hooks pro práci se stavem, efekty a memoizací.
import {
    useCallback,
    useEffect,
    useMemo
} from "react";

// Importuje hook pro čtení parametrů z routeru.
import { useParams } from "react-router";

// Importuje hook pro přístup k Redux stavu.
import { useSelector } from "react-redux";

// Importuje selektor pro přístup k seznamu finančních převodů.
import { selectFinanceTransfers } from "../Store/FinanceTransferSlice";

// Importuje hook pro spuštění asynchronních thunk akcí.
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";

// Importuje hook pro získání GraphQL typu a jeho definic.
import { useGQLType } from "../../../../dynamic/src/Hooks/useGQLType";

// Importuje asynchronní akci pro načtení stránky finančních převodů.
import {
    FinanceTransferPageAsyncAction
} from "../Queries/FinanceTransferPageAsyncAction";

// Importuje základní asynchronní akci pro čtení entity.
import { ReadAsyncAction } from "../Queries";

// Importuje komponentu pro zobrazení Sunburst grafu převodů.
import {
    FinanceTransferSunburst
} from "../Components/FinanceTransferSunburst";

// Importuje základní kartu pro zobrazení entity.
import {
    LargeCard
} from "../../../../_template/src/Base/Components/LargeCard";

// Importuje komponentu pro kapsulu s kartou.
import {
    CardCapsule
} from "../../../../_template/src/Base/Components/CardCapsule";

// Importuje komponenty pro zobrazení skalárních a vektorových atributů.
import {
    MediumCardScalars,
    ScalarAttribute
} from "../../../../_template/src/Base/Scalars/ScalarAttribute";
import {
    MediumCardVectors,
    VectorAttribute
} from "../../../../_template/src/Base/Vectors/VectorAttribute";

// Importuje provider a hook pro práci s GraphQL kontextem entity.
import {
    AsyncActionProvider,
    useGQLEntityContext
} from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

// Importuje layoutové komponenty pro řádky a sloupce.
import { Row } from "../../../../_template/src/Base/Components/Row";
import { Col } from "../../../../_template/src/Base/Components/Col";

// Importuje helper pro pravý roh karty z shared balíčku.
import {
    SimpleCardCapsuleRightCorner
} from "@hrbolek/uoisfrontend-shared";

// Importuje tlačítko pro kopírování textu.
import {
    CopyButton
} from "../../../../_template/src/Base/Components/CopyButton";


/**
 * Resolves the source finance identifier from a transfer object.
 *
 * Several accepted property names are checked because transfer data can be
 * produced by different GraphQL queries, mutations or local transformations.
 *
 * @param {Object|null|undefined} transfer
 * Finance transfer record.
 *
 * @returns {string|null}
 * Source finance identifier, or `null` when it cannot be resolved.
 */
// Vybere identifikátor zdrojové finance z různých možných formátů dat.
const getTransferSourceId = (transfer) => {
    return (
        transfer?.financeSourceId ??
        transfer?.financeTransfer_financeSourceId ??
        transfer?.sourceFinanceId ??
        transfer?.sourceId ??
        transfer?.financeSource?.id ??
        transfer?.source?.id ??
        null
    );
};


/**
 * Resolves the destination finance identifier from a transfer object.
 *
 * @param {Object|null|undefined} transfer
 * Finance transfer record.
 *
 * @returns {string|null}
 * Destination finance identifier, or `null` when it cannot be resolved.
 */
// Vybere identifikátor cílové finance z různých možných formátů dat.
const getTransferDestinationId = (transfer) => {
    return (
        transfer?.financeDestinationId ??
        transfer?.financeTransfer_financeDestinationId ??
        transfer?.destinationFinanceId ??
        transfer?.destinationId ??
        transfer?.financeDestination?.id ??
        transfer?.destination?.id ??
        null
    );
};


/**
 * Converts a finance transfer into the normalized structure used by the page.
 *
 * A valid normalized transfer contains `financeSourceId`,
 * `financeDestinationId` and a non-zero numeric `amount`.
 *
 * @param {Object|null|undefined} transfer
 * Transfer in an arbitrary supported backend or local format.
 *
 * @returns {Object|null}
 * Normalized transfer, or `null` when the input is invalid.
 */
// Zajistí jednotný formát převodu pro další zpracování.
const normalizeTransfer = (transfer) => {
    if (!transfer || typeof transfer !== "object") {
        return null;
    }

    const financeSourceId = getTransferSourceId(transfer);
    const financeDestinationId = getTransferDestinationId(transfer);
    const amount = Number(
        transfer.amount ??
        transfer.financeTransfer_amount ??
        transfer.value ??
        0
    );

    if (
        !financeSourceId ||
        !financeDestinationId ||
        !Number.isFinite(amount) ||
        amount === 0
    ) {
        return null;
    }

    return {
        ...transfer,
        financeSourceId,
        financeDestinationId,
        amount
    };
};


/**
 * Collects finance transfers recursively from a finance hierarchy.
 *
 * The function searches all supported transfer collections on every finance
 * node, prevents cyclic traversal and removes duplicate records.
 *
 * @param {Object|null|undefined} item
 * Root finance entity.
 *
 * @returns {Object[]}
 * Unique normalized transfers found in the hierarchy.
 */
// Projde celou hierarchii a sesbírá všechny převody.
const collectTransfers = (item) => {
    const transfers = [];
    const visitedNodes = new Set();

    const collect = (node) => {
        if (!node || typeof node !== "object") {
            return;
        }

        if (visitedNodes.has(node)) {
            return;
        }

        visitedNodes.add(node);

        const possibleTransferArrays = [
            node.financeTransfers,
            node.transfers,
            node.incomingTransfers,
            node.outgoingTransfers,
            node.financeSourceTransfers,
            node.financeDestinationTransfers
        ];

        possibleTransferArrays.forEach((array) => {
            if (!Array.isArray(array)) {
                return;
            }

            array.forEach((transfer) => {
                const normalizedTransfer = normalizeTransfer(transfer);

                if (normalizedTransfer) {
                    transfers.push(normalizedTransfer);
                }
            });
        });

        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(collect);
        }
    };

    collect(item);

    const transferMap = new Map();

    transfers.forEach((transfer, index) => {
        const key =
            transfer.id ??
            `${transfer.financeSourceId}-` +
            `${transfer.financeDestinationId}-` +
            `${transfer.amount}-${index}`;

        transferMap.set(key, transfer);
    });

    return [...transferMap.values()];
};


/**
 * Recursively recalculates finance values according to transfer records.
 *
 * Every finance entity is adjusted by subtracting all outgoing transfers
 * and adding all incoming transfers. Child finance entities are processed
 * recursively and the original input objects remain unchanged.
 *
 * @param {Object[]} [finances=[]]
 * Finance entities to recalculate.
 *
 * @param {Object[]} [transfers=[]]
 * Collection of normalized finance transfers.
 *
 * @returns {Object[]}
 * New finance hierarchy with recalculated values.
 */
// Aplikuje převody na strom financí a vrátí novou strukturu.
const applyTransfersToFinanceTree = (
    finances = [],
    transfers = []
) => {
    return finances.map((finance) => {
        const outgoing = transfers
            .filter(
                (transfer) =>
                    transfer.financeSourceId === finance.id
            )
            .reduce(
                (sum, transfer) =>
                    sum + Number(transfer.amount || 0),
                0
            );

        const incoming = transfers
            .filter(
                (transfer) =>
                    transfer.financeDestinationId === finance.id
            )
            .reduce(
                (sum, transfer) =>
                    sum + Number(transfer.amount || 0),
                0
            );

        return {
            ...finance,
            value:
                Number(finance.value || 0) -
                outgoing +
                incoming,
            subfinances: Array.isArray(finance.subfinances)
                ? applyTransfersToFinanceTree(
                    finance.subfinances,
                    transfers
                )
                : finance.subfinances
        };
    });
};


/**
 * Creates a patched finance entity with recalculated child finance values.
 *
 * The supplied finance transfers are normalized and applied to the finance
 * hierarchy. The original finance entity is not modified.
 *
 * @param {Object|null|undefined} item
 * Root finance entity.
 *
 * @param {Object[]} [localTransfers=[]]
 * Finance transfers applied to the hierarchy.
 *
 * @returns {Object|null|undefined}
 * Patched finance entity or the original value when no entity is supplied.
 */
// Vytvoří kopii financí s přepočítanými hodnotami podřízených položek.
const patchFinanceItem = (
    item,
    localTransfers = []
) => {
    if (!item || typeof item !== "object") {
        return item;
    }

    const normalizedLocalTransfers = localTransfers
        .map(normalizeTransfer)
        .filter(Boolean);

    return {
        ...item,
        subfinances: applyTransfersToFinanceTree(
            item.subfinances ?? [],
            normalizedLocalTransfers
        )
    };
};


/**
 * Collects all finance identifiers contained in a hierarchy.
 *
 * @param {Object|null|undefined} finance
 * Root finance entity.
 *
 * @returns {Set<string>}
 * Set containing identifiers of the root and all descendant finances.
 */
// Projde hierarchii a sesbírá všechny identifikátory financí.
const collectFinanceIds = (finance) => {
    const ids = new Set();

    const walk = (node) => {
        if (!node || typeof node !== "object") {
            return;
        }

        if (node.id) {
            ids.add(node.id);
        }

        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(walk);
        }
    };

    walk(finance);

    return ids;
};


/**
 * Builds a map describing parent-child relationships in a finance hierarchy.
 *
 * @param {Object|null|undefined} finance
 * Root finance entity.
 *
 * @returns {Map<string, string|null>}
 * Map whose keys are finance IDs and values are parent finance IDs.
 */
// Sestaví mapu rodičovských vztahů pro kontrolu struktury hierarchie.
const buildParentMap = (finance) => {
    const parentById = new Map();

    const walk = (node, parentId = null) => {
        if (!node || typeof node !== "object") {
            return;
        }

        if (node.id) {
            parentById.set(node.id, parentId);
        }

        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach((child) =>
                walk(child, node.id)
            );
        }
    };

    walk(finance);

    return parentById;
};


/**
 * Determines whether one finance entity is an ancestor of another.
 *
 * @param {string} ancestorId
 * Potential ancestor finance identifier.
 *
 * @param {string} childId
 * Potential descendant finance identifier.
 *
 * @param {Map<string, string|null>} parentById
 * Parent relationship map.
 *
 * @returns {boolean}
 * `true` when `ancestorId` is found in the parent chain of `childId`.
 */
// Zkontroluje, zda je jedna finance předkem jiné v hierarchii.
const isAncestor = (
    ancestorId,
    childId,
    parentById
) => {
    let currentId = parentById.get(childId);

    while (currentId) {
        if (currentId === ancestorId) {
            return true;
        }

        currentId = parentById.get(currentId);
    }

    return false;
};


/**
 * Filters transfers to those relevant for the current finance hierarchy.
 *
 * Transfers are retained only when both endpoints belong to the hierarchy.
 * Parent-child transfers are excluded because they represent structural
 * relationships rather than redistribution between peer finance entities.
 * Duplicate transfers are removed.
 *
 * @param {Object[]} transfers
 * Candidate finance transfers.
 *
 * @param {Object} item
 * Root finance entity.
 *
 * @returns {Object[]}
 * Relevant unique transfers.
 */
// Odfiltruje převody, které nepatří do aktuální hierarchie.
const filterRelevantTransfers = (
    transfers,
    item
) => {
    const financeIds = collectFinanceIds(item);
    const parentById = buildParentMap(item);
    const uniqueTransfers = new Map();

    for (const transfer of transfers || []) {
        const normalizedTransfer = normalizeTransfer(transfer);

        if (!normalizedTransfer) {
            continue;
        }

        const sourceId = normalizedTransfer.financeSourceId;
        const destinationId =
            normalizedTransfer.financeDestinationId;

        if (
            !financeIds.has(sourceId) ||
            !financeIds.has(destinationId)
        ) {
            continue;
        }

        const isStructuralTransfer =
            isAncestor(
                sourceId,
                destinationId,
                parentById
            ) ||
            isAncestor(
                destinationId,
                sourceId,
                parentById
            );

        if (isStructuralTransfer) {
            continue;
        }

        const key =
            normalizedTransfer.id ||
            `${sourceId}-${destinationId}-` +
            `${normalizedTransfer.amount}-` +
            `${normalizedTransfer.name}`;

        if (!uniqueTransfers.has(key)) {
            uniqueTransfers.set(
                key,
                normalizedTransfer
            );
        }
    }

    return Array.from(uniqueTransfers.values());
};


/**
 * Displays the finance visualization and vector attributes for an entity.
 *
 * The component loads finance transfers from the backend, selects transfers
 * relevant to the current finance hierarchy, recalculates displayed values
 * and renders both the interactive Sunburst diagram and vector attributes.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Root finance entity.
 *
 * @param {Function} [props.onTransferInserted]
 * Callback invoked after a transfer is inserted and backend data is reloaded.
 *
 * @returns {JSX.Element}
 * Finance visualization and vector attributes.
 */
// Hlavní komponenta pro zobrazení financí s převody.
export const GeneratedContentBase = ({
    item,
    onTransferInserted = () => { }
}) => {
    const backendTransfers = useSelector(
        selectFinanceTransfers
    );

    const {
        run: runFinanceTransferPage
    } = useAsyncThunkAction(
        FinanceTransferPageAsyncAction,
        {},
        {
            deferred: true,
            network: true
        }
    );

    /**
     * Loads finance transfers from the backend into the Redux store.
     *
     * @async
     * @returns {Promise<void>}
     */
    // Načte seznam převodů z backendu.
    const loadTransfers = useCallback(async () => {
        try {
            await runFinanceTransferPage({
                skip: 0,
                limit: 1000,
                orderby: "created"
            });
        } catch (error) {
            console.error(
                "Finance transfers could not be loaded:",
                error
            );
        }
    }, [runFinanceTransferPage]);

    // Načte převody při prvním renderu komponenty.
    useEffect(() => {
        loadTransfers();
    }, [loadTransfers]);

    const patchedItem = useMemo(() => {
        if (!item) {
            return item;
        }

        const relevantTransfers =
            filterRelevantTransfers(
                backendTransfers,
                item
            );

        return patchFinanceItem(
            item,
            relevantTransfers
        );
    }, [item, backendTransfers]);

    /**
 * Handles successful finance transfer insertion.
 *
 * After a transfer is created, the backend data are reloaded and the
 * optional callback supplied by the parent component is invoked.
 *
 * @async
 *
 * @param {Object} transfer
 * Newly created finance transfer.
 *
 * @returns {Promise<void>}
 */
    const handleTransferInserted = async (transfer) => {
        await loadTransfers();
        await onTransferInserted?.(transfer);
    };

    if (!item) {
        return <>Položka nenalezena</>;
    }

    return (
        <>
            <FinanceTransferSunburst
                item={patchedItem}
                header="Graf finančních přesunů"
                onTransferInserted={handleTransferInserted}
            />

            <MediumCardVectors
                key="MediumCardVectors"
                item={patchedItem}
            />
        </>
    );
};


/**
 * Composes the internal layout of a finance entity page.
 *
 * The component reads the current entity from GraphQL context, applies any
 * transfers embedded in the entity, renders optional navigation and wraps
 * the selected subpage with additional components.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ComponentType<Object>|null} [props.PageNavbar=null]
 * Optional page navigation component.
 *
 * @param {Array<React.ComponentType>} [props.ItemLayout=LargeCard]
 * Layout component used to wrap the entity content.
 *
 * @param {React.ComponentType<Object>|null} [props.SubPage=GeneratedContentBase]
 * Component rendering the main page content.
 *
 * @param {Array<React.ComponentType>} [props.OtherComponents=[]]
 * Components that wrap `children` from right to left.
 *
 * @param {React.ReactNode} [props.children]
 * Additional nested page content.
 *
 * @returns {JSX.Element}
 * Composed finance entity page.
 */
// Komponenta pro sestavení vnitřní struktury stránky entity.
const PageItemInnerStructure = ({
    PageNavbar = null,
    ItemLayout = LargeCard,
    SubPage = GeneratedContentBase,
    OtherComponents = [],
    children
}) => {
    const { item } = useGQLEntityContext();

    const patchedItem = useMemo(() => {
        if (!item) {
            return item;
        }

        return patchFinanceItem(
            item,
            collectTransfers(item)
        );
    }, [item]);

    if (!item) {
        return <>Položka nenalezena</>;
    }

    const content = (OtherComponents || [])
        .reduceRight((accumulator, Component) => {
            if (!Component) {
                return accumulator;
            }

            return (
                <Component item={item}>
                    {accumulator}
                </Component>
            );
        }, children);

    return (
        <>
            {PageNavbar && (
                <PageNavbar item={item} />
            )}

            <ItemLayout item={patchedItem}>
                {SubPage ? (
                    <SubPage item={patchedItem}>
                        {content}
                    </SubPage>
                ) : (
                    content
                )}
            </ItemLayout>
        </>
    );
};


/**
 * Creates the provider and page structure for a finance entity detail.
 *
 * The entity identifier is read from the current route and passed to the
 * configured asynchronous GraphQL action.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 * Async action used to load the entity.
 *
 * @param {React.ComponentType<Object>} [props.PageNavbar]
 * Optional page navigation component.
 *
 * @param {React.ComponentType<Object>} [props.ItemLayout=LargeCard]
 * Layout component used to display the entity.
 *
 * @param {React.ComponentType<Object>} [props.SubPage=GeneratedContentBase]
 * Main content component.
 *
 * @param {React.ReactNode} [props.children]
 * Additional nested content.
 *
 * @returns {JSX.Element}
 * GraphQL-backed finance entity page.
 */
// Komponenta pro vytvoření provideru a struktury detailu entity.
export const PageItemBase = ({
    queryAsyncAction = ReadAsyncAction,
    PageNavbar = () => null,
    ItemLayout = LargeCard,
    SubPage = GeneratedContentBase,
    children
}) => {
    const { id } = useParams();
    const item = { id };

    return (
        <AsyncActionProvider
            item={item}
            queryAsyncAction={queryAsyncAction}
        >
            <PageItemInnerStructure
                PageNavbar={PageNavbar}
                ItemLayout={ItemLayout}
                SubPage={SubPage}
            >
                {children}
            </PageItemInnerStructure>
        </AsyncActionProvider>
    );
};


/**
 * Renders finance page content according to the route action.
 *
 * Supported modes include the standard detail view, GraphQL definition
 * display, vector attributes and scalar attributes.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} [props.queryById]
 * GraphQL query used to load one entity.
 *
 * @param {string} [props.queryVector]
 * GraphQL query used to load collections.
 *
 * @param {Object<string, string>} [props.mutations={}]
 * Available GraphQL mutation definitions.
 *
 * @param {React.ReactNode} [props.children]
 * Default content used when no specific action replaces it.
 *
 * @param {Object} [props.params]
 * Route or query parameters displayed in the diagnostic section.
 *
 * @returns {JSX.Element}
 * Content of the selected finance page mode.
 */
// Komponenta pro vykreslení obsahu stránky podle akce v trase.
export const PageContent = ({
    queryById,
    queryVector,
    mutations = {},
    children,
    params
}) => {
    const gqlContext = useGQLEntityContext();
    const { action = "view" } = useParams();
    const { item } = gqlContext || {};

    const patchedItem = useMemo(() => {
        return patchFinanceItem(
            item,
            collectTransfers(item)
        );
    }, [item]);

    if (!item) {
        return (
            <div>
                Položka nenalezena
                <pre>
                    {JSON.stringify(gqlContext, null, 2)}
                </pre>
            </div>
        );
    }

    let content = children;
    const attributeValue = patchedItem?.[action];

    if (action === "__def") {
        content = (
            <Row>
                <Col>
                    <CardCapsule header="queryById">
                        <SimpleCardCapsuleRightCorner>
                            <CopyButton
                                className="btn btn-sm border-0"
                                text={queryById}
                            />
                        </SimpleCardCapsuleRightCorner>

                        <pre>
                            {queryById
                                ?.replaceAll(", ", ", \n\t")
                                .replaceAll("(", "(\n\t")}
                        </pre>
                    </CardCapsule>
                </Col>

                <Col>
                    <CardCapsule header="queryVector">
                        <SimpleCardCapsuleRightCorner>
                            <CopyButton
                                className="btn btn-sm border-0"
                                text={queryVector}
                            />
                        </SimpleCardCapsuleRightCorner>

                        <pre>
                            {queryVector
                                ?.replaceAll(", ", ", \n\t")
                                .replaceAll("(", "(\n\t")}
                        </pre>
                    </CardCapsule>
                </Col>

                {Object.entries(mutations).map(
                    ([name, value]) => (
                        <Col key={name}>
                            <CardCapsule header={name}>
                                <SimpleCardCapsuleRightCorner>
                                    <CopyButton
                                        className="btn btn-sm border-0"
                                        text={value}
                                    />
                                </SimpleCardCapsuleRightCorner>

                                <pre>
                                    {value
                                        ?.replaceAll(", ", ", \n\t")
                                        .replaceAll("(", "(\n\t")}
                                </pre>
                            </CardCapsule>
                        </Col>
                    )
                )}
            </Row>
        );
    } else if (action === "view") {
        content = (
            <>
                <FinanceTransferSunburst
                    item={patchedItem}
                    header="Graf finančních přesunů"
                />

                <MediumCardScalars
                    key="MediumCardScalars"
                    item={patchedItem}
                />

                <MediumCardVectors
                    key="MediumCardVectors"
                    item={patchedItem}
                />
            </>
        );
    } else if (Array.isArray(attributeValue)) {
        content = (
            <VectorAttribute
                attribute_name={action}
                item={patchedItem}
            />
        );
    } else if (attributeValue !== undefined) {
        content = (
            <ScalarAttribute
                attribute_name={action}
                item={patchedItem}
            />
        );
    }

    return (
        <>
            <LargeCard item={patchedItem}>
                {content}
            </LargeCard>

            <Row>
                <Col>
                    <CardCapsule header="QueryById">
                        <pre>{queryById}</pre>
                    </CardCapsule>
                </Col>

                <Col>
                    <CardCapsule header="Parametry">
                        <pre>
                            {JSON.stringify(params, null, 2)}
                        </pre>
                    </CardCapsule>
                </Col>

                <Col>
                    <CardCapsule header="Response">
                        <pre>
                            {JSON.stringify(
                                patchedItem,
                                null,
                                2
                            )}
                        </pre>
                    </CardCapsule>
                </Col>
            </Row>
        </>
    );
};


/**
 * Root page component of the dynamic finance module.
 *
 * The component resolves the entity type and identifier from the route,
 * obtains the appropriate GraphQL action and definitions, and initializes
 * the provider used by `PageContent`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ReactNode} [props.children]
 * Additional content forwarded to `PageContent`.
 *
 * @returns {JSX.Element}
 * Dynamic GraphQL entity page or an unsupported-type message.
 */
// Komponenta pro zobrazení kořenové stránky financí.
export const Page = ({
    children
}) => {
    const { id, typename } = useParams();
    const item = { id };

    const {
        ByIdAsyncAction,
        queryById,
        queryVector,
        mutations
    } = useGQLType(
        typename || "RoleGQLModel"
    );

    return (
        <>
            {ByIdAsyncAction ? (
                <AsyncActionProvider
                    item={item}
                    queryAsyncAction={ByIdAsyncAction}
                >
                    <PageContent
                        queryById={queryById}
                        queryVector={queryVector}
                        mutations={mutations}
                        params={item}
                    >
                        {children}
                    </PageContent>
                </AsyncActionProvider>
            ) : (
                <div>
                    No ByIdAsyncAction for type {typename}
                </div>
            )}
        </>
    );
};