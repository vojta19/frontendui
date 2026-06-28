// Importuje základní hooky z Reactu.
// useCallback slouží k zapamatování funkce mezi rendery.
// useEffect slouží ke spuštění vedlejší logiky po renderu.
// useMemo slouží k zapamatování vypočítané hodnoty, aby se zbytečně nepřepočítávala.
import { useCallback, useEffect, useMemo } from "react";

// Importuje hook useParams z react-routeru.
// Díky němu můžeme číst hodnoty z URL adresy, například id, typename nebo action.
import { useParams } from "react-router";

// Importuje hook useSelector z Reduxu.
// Ten slouží ke čtení hodnot uložených v globálním Redux store.
import { useSelector } from "react-redux";

// Importuje selector, který ze store vytáhne seznam finančních transferů.
import { selectFinanceTransfers } from "../Store/FinanceTransferSlice";

// Importuje vlastní hook pro spouštění asynchronních thunk akcí.
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";

// Importuje thunk akci, která načítá stránkovaný seznam finančních transferů z backendu.
import { FinanceTransferPageAsyncAction } from "../Queries/FinanceTransferPageAsyncAction";

// Importuje hook, který podle GraphQL typu dynamicky získá správné dotazy, mutace a async akce.
import { useGQLType } from "../../../../dynamic/src/Hooks/useGQLType";

// Importuje komponentu pro zobrazení a ovládání Sunburst diagramu finančních přesunů.
import { FinanceTransferSunburst } from "../Components/FinanceTransferSunburst";

// Importuje hlavní obalovou kartu stránky.
import { LargeCard } from "../../../../_template/src/Base/Components/LargeCard";

// Importuje menší obalovou kartu pro jednotlivé sekce stránky.
import { CardCapsule } from "../../../../_template/src/Base/Components/CardCapsule";

// Importuje komponenty pro zobrazení jednoduchých hodnot entity, například name, value, description.
import { MediumCardScalars, ScalarAttribute } from "../../../../_template/src/Base/Scalars/ScalarAttribute";

// Importuje komponenty pro zobrazení polí / kolekcí entity, například subfinances.
import { MediumCardVectors, VectorAttribute } from "../../../../_template/src/Base/Vectors/VectorAttribute";

// Importuje GraphQL kontext entity a provider, který se stará o načtení dat podle async akce.
import { useGQLEntityContext, AsyncActionProvider } from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

// Importuje layout komponentu pro řádek.
import { Row } from "../../../../_template/src/Base/Components/Row";

// Importuje layout komponentu pro sloupec.
import { Col } from "../../../../_template/src/Base/Components/Col";

// Importuje komponentu pro pravý horní roh CardCapsule, typicky pro tlačítka.
import { SimpleCardCapsuleRightCorner } from "@hrbolek/uoisfrontend-shared";

// Importuje tlačítko pro kopírování textu do schránky.
import { CopyButton } from "../../../../_template/src/Base/Components/CopyButton";

// Importuje výchozí async akci pro načtení detailu entity.
import { ReadAsyncAction } from "../Queries";

console.log("FINANCE Page.jsx MODULE LOADED");

// =======================================================
// Pomocné funkce pro práci s finančními transfery
// =======================================================

// Funkce se snaží bezpečně získat ID zdrojové finance z objektu transferu.
// Backend nebo různé části aplikace mohou vracet stejnou hodnotu pod jinými názvy,
// proto se zde kontroluje více možných variant.
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

// Funkce se snaží bezpečně získat ID cílové finance z objektu transferu.
// Stejně jako u source ID se zde počítá s více možnými názvy stejné hodnoty.
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

// Funkce normalizuje jeden transfer.
// Cílem je převést různé možné podoby transferu na jednotný tvar:
// financeSourceId, financeDestinationId a amount.
const normalizeTransfer = (transfer) => {
    // Pokud transfer neexistuje nebo není objekt, nemá smysl s ním dál pracovat.
    if (!transfer || typeof transfer !== "object") return null;

    // Získání zdrojového ID pomocí pomocné funkce.
    const financeSourceId = getTransferSourceId(transfer);

    // Získání cílového ID pomocí pomocné funkce.
    const financeDestinationId = getTransferDestinationId(transfer);

    // Částka se může nacházet pod amount, financeTransfer_amount nebo value.
    // Number() ji převede na číslo.
    const amount = Number(
        transfer.amount ??
        transfer.financeTransfer_amount ??
        transfer.value ??
        0
    );

    // Transfer považujeme za neplatný, pokud:
    // - nemá zdroj,
    // - nemá cíl,
    // - amount není platné číslo,
    // - amount je nula.
    if (!financeSourceId || !financeDestinationId || !Number.isFinite(amount) || amount === 0) {
        return null;
    }

    // Vracíme původní transfer doplněný o sjednocené hodnoty.
    return {
        ...transfer,
        financeSourceId,
        financeDestinationId,
        amount,
    };
};

// Funkce projde celý finanční strom a pokusí se z něj najít všechny transfery,
// pokud jsou někde zanořené přímo v itemu nebo jeho subfinances.
const collectTransfers = (item) => {
    // Sem se budou ukládat nalezené transfery.
    const transfers = [];

    // Ochrana proti zacyklení při rekurzivním procházení objektů.
    const visitedNodes = new Set();

    // Vnitřní rekurzivní funkce pro průchod stromem.
    const collect = (node) => {
        // Pokud uzel neexistuje nebo není objekt, přeskočí se.
        if (!node || typeof node !== "object") return;

        // Pokud jsme tento objekt už viděli, přeskočí se.
        if (visitedNodes.has(node)) return;

        // Označíme aktuální objekt jako navštívený.
        visitedNodes.add(node);

        // Možné názvy polí, kde by se mohly nacházet transfery.
        const possibleTransferArrays = [
            node.financeTransfers,
            node.transfers,
            node.incomingTransfers,
            node.outgoingTransfers,
            node.financeSourceTransfers,
            node.financeDestinationTransfers,
        ];

        // Projde všechna možná pole transferů.
        possibleTransferArrays.forEach(array => {
            // Pokud daná hodnota není pole, ignoruje se.
            if (!Array.isArray(array)) return;

            // Každý nalezený transfer se znormalizuje.
            array.forEach(transfer => {
                const normalizedTransfer = normalizeTransfer(transfer);

                // Do výsledku se vloží jen validní transfer.
                if (normalizedTransfer) transfers.push(normalizedTransfer);
            });
        });

        // Pokud má finance potomky, pokračujeme rekurzivně do subfinances.
        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(collect);
        }
    };

    // Spuštění průchodu od kořenového itemu.
    collect(item);

    // Map slouží k odstranění duplicitních transferů.
    const transferMap = new Map();

    transfers.forEach((transfer, index) => {
        // Pokud má transfer vlastní ID, použije se jako unikátní klíč.
        // Pokud ID nemá, vytvoří se náhradní klíč z hodnot transferu.
        const key = transfer.id ?? `${transfer.financeSourceId}-${transfer.financeDestinationId}-${transfer.amount}-${index}`;

        // Vložení do mapy odstraní duplicitní hodnoty se stejným klíčem.
        transferMap.set(key, transfer);
    });

    // Vrací čisté pole unikátních transferů.
    return [...transferMap.values()];
};

// Funkce aplikuje transfery na finanční strom.
// Pro každou finance vypočítá novou hodnotu podle pravidla:
// původní hodnota - odchozí transfery + příchozí transfery.
const applyTransfersToFinanceTree = (finances = [], transfers = []) => {
    return finances.map(finance => {
        // Součet všech transferů, kde je aktuální finance zdrojem.
        const outgoing = transfers
            .filter(transfer => transfer.financeSourceId === finance.id)
            .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0);

        // Součet všech transferů, kde je aktuální finance cílem.
        const incoming = transfers
            .filter(transfer => transfer.financeDestinationId === finance.id)
            .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0);

        // Vrací novou kopii finance s přepočítanou hodnotou.
        // Původní objekt se nemění přímo.
        return {
            ...finance,
            value: Number(finance.value || 0) - outgoing + incoming,

            // Pokud má finance potomky, transfery se rekurzivně aplikují i na ně.
            subfinances: Array.isArray(finance.subfinances)
                ? applyTransfersToFinanceTree(finance.subfinances, transfers)
                : finance.subfinances,
        };
    });
};

// Funkce vytvoří upravenou kopii hlavního itemu,
// kde jsou jeho subfinances přepočítané podle transferů.
const patchFinanceItem = (item, localTransfers = []) => {
    // Pokud item není validní objekt, vrací se beze změny.
    if (!item || typeof item !== "object") return item;

    // Transfery se nejdřív normalizují a neplatné hodnoty se odstraní.
    const normalizedLocalTransfers = localTransfers
        .map(normalizeTransfer)
        .filter(Boolean);

    // Vrací novou kopii itemu s přepočítanými subfinances.
    return {
        ...item,
        subfinances: applyTransfersToFinanceTree(
            item.subfinances ?? [],
            normalizedLocalTransfers
        ),
    };
};

// Funkce projde finanční strom a posbírá všechna ID financí,
// která se v aktuálním stromu nachází.
const collectFinanceIds = (finance) => {
    const ids = new Set();

    const walk = (node) => {
        // Neplatný uzel se přeskočí.
        if (!node || typeof node !== "object") return;

        // Pokud má uzel ID, vloží se do Setu.
        if (node.id) {
            ids.add(node.id);
        }

        // Rekurzivní průchod potomků.
        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(walk);
        }
    };

    walk(finance);

    return ids;
};

// Funkce sestaví mapu vztahů dítě -> rodič.
// Klíčem je ID finance, hodnotou je ID jejího rodiče.
const buildParentMap = (finance) => {
    const parentById = new Map();

    const walk = (node, parentId = null) => {
        // Neplatný uzel se přeskočí.
        if (!node || typeof node !== "object") return;

        // Pokud má uzel ID, uložíme vztah aktuální finance k jejímu rodiči.
        if (node.id) {
            parentById.set(node.id, parentId);
        }

        // Potomci dostanou jako parentId ID aktuálního uzlu.
        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(child => walk(child, node.id));
        }
    };

    walk(finance);

    return parentById;
};

// Funkce ověřuje, zda je ancestorId předkem childId.
// Používá se pro odhalení transferů mezi rodičem a potomkem.
const isAncestor = (ancestorId, childId, parentById) => {
    // Začínáme u přímého rodiče childId.
    let currentId = parentById.get(childId);

    // Postupujeme směrem nahoru ke kořeni stromu.
    while (currentId) {
        // Pokud narazíme na hledaného předka, vracíme true.
        if (currentId === ancestorId) return true;

        // Posun o úroveň výše.
        currentId = parentById.get(currentId);
    }

    // Předek nebyl nalezen.
    return false;
};

// Funkce vyfiltruje transfery tak, aby zůstaly pouze transfery relevantní pro aktuální strom.
// Zároveň odstraňuje transfery mezi rodičem a potomkem, protože ty jsou brané jako strukturální.
const filterRelevantTransfers = (transfers, item) => {
    // Všechna ID financí, která jsou v aktuálním stromu.
    const financeIds = collectFinanceIds(item);

    // Mapa vztahů dítě -> rodič.
    const parentById = buildParentMap(item);

    // Mapa pro odstranění duplicit.
    const uniqueTransfers = new Map();

    for (const transfer of transfers || []) {
        const sourceId = transfer?.financeSourceId;
        const destinationId = transfer?.financeDestinationId;

        // Transfer je relevantní jen tehdy, pokud zdroj i cíl existují v aktuálním stromu.
        const bothAreInCurrentTree = financeIds.has(sourceId) && financeIds.has(destinationId);

        // Pokud jeden z uzlů není v aktuálním stromu, transfer ignorujeme.
        if (!bothAreInCurrentTree) continue;

        // Detekce strukturálního transferu mezi rodičem a potomkem.
        const isStructuralTransfer =
            isAncestor(sourceId, destinationId, parentById) ||
            isAncestor(destinationId, sourceId, parentById);

        // Strukturální transfer se ignoruje.
        if (isStructuralTransfer) continue;

        // Unikátní klíč transferu.
        const key = transfer.id || `${sourceId}-${destinationId}-${transfer.amount}-${transfer.name}`;

        // Do výsledku se uloží jen první výskyt daného transferu.
        if (!uniqueTransfers.has(key)) {
            uniqueTransfers.set(key, transfer);
        }
    }

    // Vrací pole relevantních a unikátních transferů.
    return Array.from(uniqueTransfers.values());
};

// =======================================================
// Komponenta GeneratedContentBase
// =======================================================

// Tato komponenta:
// 1. dostane aktuální finance item,
// 2. načte transfery z backendu,
// 3. vybere transfery relevantní pro aktuální strom,
// 4. přepočítá hodnoty,
// 5. vykreslí Sunburst graf a vektorové atributy.
export const GeneratedContentBase = ({
    item,
    onTransferInserted = () => {},
}) => {
    console.log("JSEM V GENERATEDCONTENTBASE", item);

    // Načte transfery uložené v Redux store.
    // Store se naplní po zavolání FinanceTransferPageAsyncAction.
    const backendTransfers = useSelector(selectFinanceTransfers);

    // Připraví funkci runFinanceTransferPage.
    // deferred: true znamená, že se akce nespustí automaticky hned při inicializaci.
    // network: true říká, že se má skutečně sahat na backend.
    const {
        run: runFinanceTransferPage,
    } = useAsyncThunkAction(
        FinanceTransferPageAsyncAction,
        {},
        { deferred: true, network: true }
    );

    // Funkce načte transfery z backendu.
    // Po úspěšném načtení by se data měla propsat do Redux store.
    const loadTransfers = useCallback(async () => {
        console.log("LOAD TRANSFERS START");

        try {
            const result = await runFinanceTransferPage({
                skip: 0,
                limit: 1000,
                orderby: "created",
            });

            // Surový výsledek se loguje pro kontrolu,
            // jestli backend opravdu vrací očekávaná data.
            console.log("RAW FINANCE TRANSFER PAGE RESULT:", result);
        } catch (error) {
            // Pokud dotaz selže, chyba se vypíše do konzole.
            console.error("LOAD TRANSFERS ERROR:", error);
        }
    }, [runFinanceTransferPage]);

    // Po prvním renderu komponenty se načtou transfery z backendu.
    useEffect(() => {
        loadTransfers();
    }, [loadTransfers]);

    // patchedItem je přepočítaná verze itemu.
    // Přepočet se provede pouze tehdy, když se změní item nebo backendTransfers.
    const patchedItem = useMemo(() => {
        if (!item) return item;

        // Z celého seznamu transferů ve store vybereme jen ty,
        // které se týkají aktuálně zobrazeného finančního stromu.
        const relevantTransfers = filterRelevantTransfers(
            backendTransfers,
            item
        );

        console.log("ALL BACKEND TRANSFERS FROM STORE:", backendTransfers);
        console.log("RELEVANT TRANSFERS:", relevantTransfers);

        // Mapa slouží jen pro hezčí debug výpis.
        // Díky ní se v console.table zobrazí i názvy financí, ne jen ID.
        const financeNameById = new Map();

        // Rekurzivně projde strom a uloží názvy financí podle jejich ID.
        const collectFinanceNames = (node) => {
            if (!node || typeof node !== "object") return;

            if (node.id) {
                financeNameById.set(node.id, node.name);
            }

            if (Array.isArray(node.subfinances)) {
                node.subfinances.forEach(collectFinanceNames);
            }
        };

        collectFinanceNames(item);

        // Tabulkový výpis transferů v konzoli.
        // Pomáhá ověřit, odkud kam transfer jde a jaká částka se používá.
        console.table(
            relevantTransfers.map((transfer) => ({
                id: transfer.id,
                name: transfer.name,
                amount: Number(transfer.amount || 0),
                sourceId: transfer.financeSourceId,
                sourceName: financeNameById.get(transfer.financeSourceId),
                destinationId: transfer.financeDestinationId,
                destinationName: financeNameById.get(transfer.financeDestinationId),
            }))
        );

        // Vrací item s přepočítanými hodnotami podle relevantních transferů.
        return patchFinanceItem(item, relevantTransfers);
    }, [item, backendTransfers]);

    // Funkce se zavolá po úspěšném vložení nového transferu v Sunburst komponentě.
    const handleTransferInserted = async (transfer) => {
        console.log("TRANSFER HOTOVY, NACITAM TRANSFERY ZNOVU:", transfer);

        // Po vložení transferu znovu načteme transfery z backendu.
        // To odpovídá variantě A: backend je zdroj pravdy.
        await loadTransfers();

        // Poté se informace předá výš rodičovské komponentě.
        onTransferInserted?.(transfer);
    };

    // Pokud item není dostupný, zobrazí se jednoduchá hláška.
    if (!item) return <>Položka nenalezena</>;

    return (
        <>
            {/* Sunburst graf dostává už přepočítaný item */}
            <FinanceTransferSunburst
                item={patchedItem}
                header="Graf finančních přesunů"
                onTransferInserted={handleTransferInserted}
            />

            {/* Vektorové atributy se také vykreslují z přepočítaného itemu */}
            <MediumCardVectors key="MediumCardVectors" item={patchedItem} />
        </>
    );
};

// =======================================================
// Komponenta PageItemInnerStructure
// =======================================================

// Tato komponenta skládá vnitřní strukturu stránky.
// Bere item z GraphQL kontextu, případně ho přepočítá,
// a potom ho předá do layoutu a subpage komponenty.
const PageItemInnerStructure = ({
    PageNavbar = null,
    ItemLayout = LargeCard,
    SubPage = GeneratedContentBase,
    OtherComponents = [],
    children
}) => {
    // Získá aktuálně načtenou entitu z GraphQL provideru.
    const { item } = useGQLEntityContext();

    console.log("PAGEITEMINNERSTRUCTURE RENDER", item);

    // Handler pro případ, kdy SubPage oznámí úspěšné vložení transferu.
    const handleTransferInserted = (transfer) => {
        console.log("PAGEITEMINNER DOSTAL TRANSFER:", transfer);
    };

    // Vytvoří přepočítanou kopii itemu podle transferů,
    // které jsou případně zanořené přímo ve struktuře itemu.
    const patchedItem = useMemo(() => {
        if (!item) return item;

        // Debug výpisy pro kontrolu, jaká data item skutečně obsahuje.
        console.log("GENERATEDCONTENTBASE ITEM:", item);
        console.log("GENERATEDCONTENTBASE ITEM KEYS:", Object.keys(item || {}).join("\n"));

        // Vypíše klíče, které se názvem podobají transferům nebo zdrojům/cílům.
        console.log("TRANSFER RELATED KEYS:", Object.keys(item || {}).filter(key =>
            key.toLowerCase().includes("transfer") ||
            key.toLowerCase().includes("source") ||
            key.toLowerCase().includes("destination")
        ));

        // Posbírá transfery z aktuálního itemu.
        const backendTransfers = collectTransfers(item);

        console.log("BACKEND TRANSFERS:", backendTransfers);

        // Vrátí item přepočítaný podle těchto transferů.
        return patchFinanceItem(item, backendTransfers);
    }, [item]);

    // Pokud item není načtený, zobrazí se hláška.
    if (!item) return <>Položka nenalezena</>;

    // OtherComponents umožňuje obalit obsah dalšími komponentami.
    // reduceRight znamená, že se komponenty aplikují zprava doleva.
    const content = (OtherComponents || []).reduceRight((acc, Component) => {
        if (!Component) return acc;

        return <Component item={item}>{acc}</Component>;
    }, children);

    return (
        <>
            {/* Volitelná navigace stránky */}
            {PageNavbar && <PageNavbar item={item} />}

            {/* Hlavní layout stránky dostává přepočítaný item */}
            <ItemLayout item={patchedItem}>
                {SubPage ? (
                    <SubPage
                        item={patchedItem}
                        onTransferInserted={(transfer) => {
                            console.log("SUBPAGE INLINE CALLBACK DOSTAL TRANSFER:", transfer);
                            handleTransferInserted(transfer);
                        }}
                    >
                        {content}
                    </SubPage>
                ) : (
                    content
                )}
            </ItemLayout>
        </>
    );
};

// =======================================================
// Komponenta PageItemBase
// =======================================================

// Tato komponenta připravuje základní provider pro načtení detailu entity podle ID z URL.
export const PageItemBase = ({
    queryAsyncAction = ReadAsyncAction,
    PageNavbar = () => null,
    ItemLayout = LargeCard,
    SubPage = GeneratedContentBase,
    children
}) => {
    // Z URL adresy vytáhne ID entity.
    const { id } = useParams();

    // Vytvoří minimální item, který provider použije pro dotaz.
    const item = { id };

    return (
        <AsyncActionProvider item={item} queryAsyncAction={queryAsyncAction}>
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

// =======================================================
// Komponenta PageContent
// =======================================================

// Tato komponenta řídí obsah detailu stránky podle action z URL.
// Například:
// /view zobrazí hlavní detail,
// /__def zobrazí definice dotazů,
// /subfinances zobrazí konkrétní vektorový atribut.
export const PageContent = ({ queryById, queryVector, mutations = {}, children, params }) => {
    // Získá GraphQL kontext z provideru.
    const gqlContext = useGQLEntityContext();

    // Z URL načte action. Pokud chybí, výchozí je view.
    const { action = "view" } = useParams();

    // Z kontextu vytáhne aktuální item.
    const { item } = gqlContext || {};

    // Přepočítá item podle transferů, které jsou případně obsažené přímo v itemu.
    const patchedItem = useMemo(() => {
        const backendTransfers = collectTransfers(item);

        console.log("BACKEND TRANSFERS:", backendTransfers);

        return patchFinanceItem(item, backendTransfers);
    }, [item]);

    // Handler po úspěšném vložení transferu.
    const handleTransferInserted = async (transfer) => {
        console.log("TRANSFER HOTOVY, NACITAM DATA ZNOVU:", transfer);

        // Reload je zatím vypnutý kvůli debugování.
        // Původní varianta mohla být:
        // window.location.reload()
        console.log("RELOAD DOCASNE VYPNUTY KVULI DEBUGU");
    };

    // Pokud item není dostupný, zobrazí se hláška a debug výpis kontextu.
    if (!item) {
        return (
            <div>
                Položka nenalezena
                <pre>{JSON.stringify(gqlContext, null, 2)}</pre>
            </div>
        );
    }

    // Výchozí obsah stránky jsou children.
    let content = children;

    // Podle action se zkusí získat konkrétní atribut z itemu.
    const attributeValue = patchedItem?.[action];

    console.log("FINANCE ITEM:", item);
    console.log("PATCHED ITEM:", patchedItem);
    console.log("COLLECTED TRANSFERS:", collectTransfers(item));

    // Režim __def slouží pro výpis GraphQL dotazů a mutací.
    if (action === "__def") {
        content = (
            <Row>
                {/* Výpis queryById */}
                <Col>
                    <CardCapsule header="queryById">
                        <SimpleCardCapsuleRightCorner>
                            <CopyButton className="btn btn-sm border-0" text={queryById} />
                        </SimpleCardCapsuleRightCorner>

                        <pre>{queryById?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                    </CardCapsule>
                </Col>

                {/* Výpis queryVector */}
                <Col>
                    <CardCapsule header="queryVector">
                        <SimpleCardCapsuleRightCorner>
                            <CopyButton className="btn btn-sm border-0" text={queryVector} />
                        </SimpleCardCapsuleRightCorner>

                        <pre>{queryVector?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                    </CardCapsule>
                </Col>

                {/* Výpis všech mutací */}
                {Object.entries(mutations).map(([name, value]) => {
                    return (
                        <Col key={name}>
                            <CardCapsule header={name}>
                                <SimpleCardCapsuleRightCorner>
                                    <CopyButton className="btn btn-sm border-0" text={value} />
                                </SimpleCardCapsuleRightCorner>

                                <pre>{value?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                            </CardCapsule>
                        </Col>
                    );
                })}
            </Row>
        );
    } else if (action === "view") {
        // Standardní zobrazení detailu finance.
        content = (
            <>
                <FinanceTransferSunburst
                    item={patchedItem}
                    header="Graf finančních přesunů"
                    onTransferInserted={handleTransferInserted}
                />

                <MediumCardScalars key="MediumCardScalars" item={patchedItem} />

                <MediumCardVectors key="MediumCardVectors" item={patchedItem} />
            </>
        );
    } else if (Array.isArray(attributeValue)) {
        // Pokud je action název atributu, který je pole, zobrazí se jako VectorAttribute.
        content = <VectorAttribute attribute_name={action} item={patchedItem} />;
    } else if (attributeValue) {
        // Pokud je action název jednoduchého atributu, zobrazí se jako ScalarAttribute.
        content = <ScalarAttribute attribute_name={action} item={patchedItem} />;
    }

    return (
        <>
            {/* Hlavní obsah stránky */}
            <LargeCard item={patchedItem}>
                {content}
            </LargeCard>

            {/* Debug panely pod stránkou */}
            <Row>
                <Col>
                    <CardCapsule header="QueryById">
                        <pre>{queryById}</pre>
                    </CardCapsule>
                </Col>

                <Col>
                    <CardCapsule header="Parametry">
                        <pre>{JSON.stringify(params, null, 2)}</pre>
                    </CardCapsule>
                </Col>

                <Col>
                    <CardCapsule header="Response">
                        <pre>{JSON.stringify(patchedItem, null, 2)}</pre>
                    </CardCapsule>
                </Col>
            </Row>
        </>
    );
};

// =======================================================
// Hlavní komponenta Page
// =======================================================

// Tato komponenta je hlavním vstupem stránky.
// Z URL zjistí typ entity a ID,
// podle typu najde správný GraphQL dotaz,
// a potom obalí PageContent do AsyncActionProvideru.
export const Page = ({ children }) => {
    // Z URL se načte id entity a typename GraphQL modelu.
    const { id, typename } = useParams();

    // Provider potřebuje alespoň ID položky.
    const item = { id };

    // Podle typename se dynamicky získá:
    // - ByIdAsyncAction pro načtení detailu,
    // - queryById pro výpis dotazu,
    // - queryVector pro výpis vektorového dotazu,
    // - mutations pro výpis dostupných mutací.
    const { ByIdAsyncAction, queryById, queryVector, mutations } = useGQLType(typename || "RoleGQLModel");

    return (
        <>
            {/* Pokud se podařilo najít async akci pro daný typ, zobrazí se stránka */}
            {ByIdAsyncAction && (
                <AsyncActionProvider item={item} queryAsyncAction={ByIdAsyncAction}>
                    <PageContent
                        queryById={queryById}
                        queryVector={queryVector}
                        mutations={mutations}
                        params={item}
                    >
                        {children}
                    </PageContent>
                </AsyncActionProvider>
            )}

            {/* Pokud typ není podporovaný, zobrazí se jednoduchá chyba */}
            {!ByIdAsyncAction && (
                <div>No ByIdAsyncAction for type {typename}</div>
            )}
        </>
    );
};