import { useState } from "react";

import { SunburstDiagram } from "./SunBurstDiagram";

import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";

import {
    FinanceTransferInsertAsyncAction
} from "../Queries/FinanceTransferInsertAsyncAction";


/**
 * Returns a human-readable name for a finance entity.
 *
 * The function prefers the Czech name stored in `name`. If the Czech
 * name is unavailable, it uses the English name, the entity identifier,
 * or a fallback label.
 *
 * @param {Object|null|undefined} finance
 * Finance entity whose display name should be determined.
 *
 * @param {string} [finance.name]
 * Czech name of the finance entity.
 *
 * @param {string} [finance.nameEn]
 * English name of the finance entity.
 *
 * @param {string} [finance.id]
 * Unique identifier of the finance entity.
 *
 * @returns {string}
 * Human-readable finance name.
 *
 * @example
 * getFinanceName({
 *     id: "30000000-0000-0000-0000-000000000003",
 *     name: "Rozpočet WP2"
 * });
 *
 * // Returns: "Rozpočet WP2"
 */
const getFinanceName = (finance) => {
    return (
        finance?.name ||
        finance?.nameEn ||
        finance?.id ||
        "Neznámý prvek"
    );
};


/**
 * Determines whether a financial transfer between two finance entities
 * is allowed.
 *
 * A transfer is rejected when:
 *
 * - the source or destination is missing,
 * - both entities have the same identifier,
 * - both entities belong to different parent finances.
 *
 * If one of the entities does not provide `masterfinanceId`, the transfer
 * is currently allowed.
 *
 * @param {Object|null|undefined} source
 * Source finance entity.
 *
 * @param {string} [source.id]
 * Unique identifier of the source finance.
 *
 * @param {string} [source.masterfinanceId]
 * Identifier of the parent finance of the source entity.
 *
 * @param {Object|null|undefined} destination
 * Destination finance entity.
 *
 * @param {string} [destination.id]
 * Unique identifier of the destination finance.
 *
 * @param {string} [destination.masterfinanceId]
 * Identifier of the parent finance of the destination entity.
 *
 * @returns {boolean}
 * `true` when the transfer is allowed; otherwise `false`.
 *
 * @example
 * canTransferBetween(
 *     {
 *         id: "source-id",
 *         masterfinanceId: "parent-id"
 *     },
 *     {
 *         id: "destination-id",
 *         masterfinanceId: "parent-id"
 *     }
 * );
 *
 * // Returns: true
 */
const canTransferBetween = (source, destination) => {
    if (!source || !destination) {
        return false;
    }

    if (source.id === destination.id) {
        return false;
    }

    if (
        source.masterfinanceId &&
        destination.masterfinanceId
    ) {
        return (
            source.masterfinanceId ===
            destination.masterfinanceId
        );
    }

    return true;
};


/**
 * Interactive component for displaying a finance hierarchy and creating
 * transfers between finance entities.
 *
 * The component renders a Sunburst diagram and allows the user to:
 *
 * - select a source finance,
 * - select a destination finance,
 * - enter a transfer amount,
 * - validate whether the transfer is allowed,
 * - execute the GraphQL transfer mutation,
 * - notify the parent component after a successful transfer.
 *
 * The first selected diagram node becomes the source. The second selected
 * node becomes the destination. Transfers are allowed only between different
 * finance entities and, when both parent identifiers are available, within
 * the same parent finance.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Root finance entity containing the hierarchy displayed by the Sunburst
 * diagram.
 *
 * @param {string} props.item.id
 * Unique identifier of the root finance.
 *
 * @param {string} [props.item.name]
 * Name of the root finance.
 *
 * @param {number} [props.item.value]
 * Current value of the root finance.
 *
 * @param {Array<Object>} [props.item.subfinances]
 * Child finance entities displayed in the diagram.
 *
 * @param {string} [props.header="Finance – přesun financí"]
 * Heading displayed above the Sunburst diagram.
 *
 * @param {Function} [props.onTransferInserted]
 * Callback invoked after a finance transfer has been inserted successfully.
 *
 * @returns {JSX.Element}
 * Interactive finance transfer interface with a Sunburst diagram.
 *
 * @example
 * <FinanceTransferSunburst
 *     item={finance}
 *     header="Graf finančních přesunů"
 *     onTransferInserted={(transfer) => {
 *         console.log("Inserted transfer:", transfer);
 *     }}
 * />
 */
export const FinanceTransferSunburst = ({
    item,
    header = "Finance – přesun financí",
    onTransferInserted = () => {},
}) => {
    const [source, setSource] = useState(null);

    const [destination, setDestination] = useState(null);

    const [hoveredTarget, setHoveredTarget] = useState(null);

    const [transferAmount, setTransferAmount] = useState("");

    const {
        run: runFinanceTransferInsert,
        loading,
    } = useAsyncThunkAction(
        FinanceTransferInsertAsyncAction,
        {},
        {
            deferred: true,
            network: true,
        }
    );


    /**
     * Handles selection of a finance node in the Sunburst diagram.
     *
     * The first valid node becomes the transfer source. After a source
     * has been selected, the next valid node becomes the destination.
     *
     * @param {Object|null|undefined} node
     * Finance node selected in the diagram.
     *
     * @param {string} [node.id]
     * Unique identifier of the selected finance node.
     *
     * @returns {void}
     */
    const handleSelect = (node) => {
        console.log("KLIK V DIAGRAMU:", node);
        console.log("AKTUALNI SOURCE:", source);

        if (!node?.id) {
            return;
        }

        if (!source) {
            setSource(node);
            setDestination(null);
            setHoveredTarget(null);
            setTransferAmount("");
            return;
        }

        if (!canTransferBetween(source, node)) {
            window.alert(
                "Přesun je povolen pouze mezi dvěma různými finančními prvky."
            );
            return;
        }

        setDestination(node);
        setHoveredTarget(node.id);
    };


    /**
     * Validates and executes the selected finance transfer.
     *
     * The function verifies that:
     *
     * - both source and destination are selected,
     * - the transfer amount is a valid positive number,
     * - the source contains sufficient funds.
     *
     * After validation, the function executes the GraphQL mutation. On
     * success, it invokes `onTransferInserted` and resets the component
     * selection state.
     *
     * @async
     *
     * @returns {Promise<void>}
     * Promise resolved after the transfer has been processed.
     */
    const handleTransferConfirm = async () => {
        if (!source || !destination) {
            window.alert(
                "Nejdřív vyber zdroj i cíl přesunu."
            );
            return;
        }

        const amount = Number(
            String(transferAmount).replace(",", ".")
        );

        if (!Number.isFinite(amount) || amount <= 0) {
            window.alert(
                "Nejdřív zadej platnou částku k přesunu."
            );
            return;
        }

        if (Number(source.value) < amount) {
            window.alert(
                "Zdroj nemá dostatek financí pro tento přesun."
            );
            return;
        }

        try {
            const variables = {
                financeTransfer_financeSourceId:
                    source.id,

                financeTransfer_financeDestinationId:
                    destination.id,

                financeTransfer_name:
                    `Přesun: ${getFinanceName(source)} → ` +
                    `${getFinanceName(destination)}`,

                financeTransfer_amount:
                    amount,
            };

            console.log(
                "ODESILAM TRANSFER:",
                variables
            );

            const result =
                await runFinanceTransferInsert(variables);

            console.log(
                "VYSLEDEK TRANSFERU:",
                result
            );

            const inserted =
                result?.data?.financeTransferInsert;

            if (
                inserted?.__typename !==
                "FinanceTransferGQLModel"
            ) {
                console.error(
                    "TRANSFER NEPROBEHL USPESNE:",
                    inserted
                );
                return;
            }

            const insertedTransfer = {
                financeSourceId:
                    variables.financeTransfer_financeSourceId,

                financeDestinationId:
                    variables.financeTransfer_financeDestinationId,

                amount:
                    Number(
                        variables.financeTransfer_amount || 0
                    ),

                name:
                    variables.financeTransfer_name,
            };

            console.log(
                "USPESNY TRANSFER:",
                insertedTransfer
            );

            await onTransferInserted?.(
                insertedTransfer
            );

            setSource(null);
            setDestination(null);
            setHoveredTarget(null);
            setTransferAmount("");
        } catch (error) {
            console.error(
                "CHYBA PRI PRESUNU:",
                error
            );

            window.alert(
                "Přesun financí se nepodařilo provést. " +
                "Detail chyby je v konzoli."
            );
        }
    };


    /**
     * Clears the currently selected source, destination and transfer amount.
     *
     * @returns {void}
     */
    const handleCancel = () => {
        setSource(null);
        setDestination(null);
        setHoveredTarget(null);
        setTransferAmount("");
    };


    return (
        <div>
            {source && (
                <div
                    className={
                        "alert alert-info " +
                        "d-flex justify-content-between " +
                        "align-items-center"
                    }
                >
                    <div>
                        <div>
                            Zdroj financí:{" "}
                            <strong>
                                {getFinanceName(source)}
                            </strong>.
                        </div>

                        {!destination && (
                            <div>
                                Teď klikni na cílový prvek.
                            </div>
                        )}

                        {destination && (
                            <>
                                <div>
                                    Cíl financí:{" "}
                                    <strong>
                                        {getFinanceName(
                                            destination
                                        )}
                                    </strong>.
                                </div>

                                <div className="mt-2">
                                    <label
                                        className={
                                            "form-label mb-1"
                                        }
                                    >
                                        Částka k přesunu:
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        style={{
                                            maxWidth: "260px",
                                        }}
                                        value={transferAmount}
                                        onChange={(event) =>
                                            setTransferAmount(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Zadej částku"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className={
                                        "btn btn-success " +
                                        "btn-sm mt-2"
                                    }
                                    onClick={
                                        handleTransferConfirm
                                    }
                                    disabled={loading}
                                >
                                    Provést přesun
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        className={
                            "btn btn-sm " +
                            "btn-outline-secondary"
                        }
                        onClick={handleCancel}
                    >
                        Zrušit výběr
                    </button>
                </div>
            )}

            {loading && (
                <div className="alert alert-warning">
                    Probíhá přesun financí...
                </div>
            )}

            <SunburstDiagram
                item={item}
                header={header}
                onSelect={handleSelect}
                selectedSourceId={source?.id}
                selectedTargetId={hoveredTarget}
            />
        </div>
    );
};