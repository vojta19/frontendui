import { useEffect, useState } from "react"
import { SunburstDiagram } from "./SunBurstDiagram"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { FinanceTransferInsertAsyncAction } from "../Queries/FinanceTransferInsertAsyncAction"

const getFinanceName = (finance) => {
    return finance?.name || finance?.nameEn || finance?.id || "Neznámý prvek"
}

const canTransferBetween = (source, destination) => {
    if (!source || !destination) return false

    if (source.id === destination.id) return false

    if (source.masterfinanceId && destination.masterfinanceId) {
        return source.masterfinanceId === destination.masterfinanceId
    }

    return true
}

const updateNodeValue = (node, nodeId, valueDiff) => {
    if (!node || typeof node !== "object") return node

    const isTargetNode = node.id === nodeId

    const updatedNode = {
        ...node,
        value: isTargetNode
            ? Number(node.value || 0) + valueDiff
            : node.value
    }

    if (Array.isArray(node.subfinances)) {
        updatedNode.subfinances = node.subfinances.map((child) =>
            updateNodeValue(child, nodeId, valueDiff)
        )
    }

    if (Array.isArray(node.children)) {
        updatedNode.children = node.children.map((child) =>
            updateNodeValue(child, nodeId, valueDiff)
        )
    }

    if (Array.isArray(node.items)) {
        updatedNode.items = node.items.map((child) =>
            updateNodeValue(child, nodeId, valueDiff)
        )
    }

    if (Array.isArray(node.nodes)) {
        updatedNode.nodes = node.nodes.map((child) =>
            updateNodeValue(child, nodeId, valueDiff)
        )
    }

    return updatedNode
}

const applyLocalTransfer = (root, sourceId, destinationId, amount) => {
    let updatedRoot = updateNodeValue(root, sourceId, -amount)
    updatedRoot = updateNodeValue(updatedRoot, destinationId, amount)

    return updatedRoot
}

export const FinanceTransferSunburst = ({
    item,
    header = "Finance – přesun financí",
    onTransferInserted = () => {},
}) => {
    const [source, setSource] = useState(null)
    const [destination, setDestination] = useState(null)
    const [hoveredTarget, setHoveredTarget] = useState(null)
    const [diagramItem, setDiagramItem] = useState(item)
    const [transferAmount, setTransferAmount] = useState("")

    useEffect(() => {
        setDiagramItem(item)
    }, [item])

    const {
        run: runFinanceTransferInsert,
        loading
    } = useAsyncThunkAction(
        FinanceTransferInsertAsyncAction,
        {},
        {
            deferred: true,
            network: true
        }
    )

    const handleSelect = (node) => {
        console.log("KLIK V DIAGRAMU:", node)
        console.log("AKTUALNI SOURCE:", source)

        if (!node?.id) return

        if (!source) {
            setSource(node)
            setDestination(null)
            setHoveredTarget(null)
            setTransferAmount("")
            return
        }

        if (!canTransferBetween(source, node)) {
            window.alert(
                "Přesun je povolen pouze mezi dvěma různými finančními prvky."
            )
            return
        }

        setDestination(node)
        setHoveredTarget(node.id)
    }
    const handleTransferConfirm = async () => {
        if (!source || !destination) {
            window.alert("Nejdřív vyber zdroj i cíl přesunu.")
            return
        }

        const amount = Number(String(transferAmount).replace(",", "."))

        if (!Number.isFinite(amount) || amount <= 0) {
            window.alert("Nejdřív zadej platnou částku k přesunu.")
            return
        }

        if (Number(source.value) < amount) {
            window.alert("Zdroj nemá dostatek financí pro tento přesun.")
            return
        }

        try {
            const variables = {
                financeTransfer_financeSourceId: source.id,
                financeTransfer_financeDestinationId: destination.id,
                financeTransfer_name: `${getFinanceName(source)} → ${getFinanceName(destination)}`,
                financeTransfer_amount: amount,
            }

            console.log("ODESILAM TRANSFER:", variables)

            const result = await runFinanceTransferInsert(variables)

            console.log("VYSLEDEK TRANSFERU:", result)

            const inserted = result?.data?.financeTransferInsert

            if (inserted?.__typename !== "FinanceTransferGQLModel") {
                console.error("TRANSFER NEPROBEHL USPESNE:", inserted)
                return
            }

            const insertedTransfer = {
                financeSourceId: variables.financeTransfer_financeSourceId,
                financeDestinationId: variables.financeTransfer_financeDestinationId,
                amount: Number(variables.financeTransfer_amount || 0),
                name: variables.financeTransfer_name,
            }

            console.log("USPESNY TRANSFER:", insertedTransfer)

            onTransferInserted?.(insertedTransfer)

            setDiagramItem((currentItem) =>
                applyLocalTransfer(
                    currentItem,
                    source.id,
                    destination.id,
                    amount
                )
            )

            window.alert("Přesun financí byl zaznamenán.")

            setSource(null)
            setDestination(null)
            setHoveredTarget(null)
            setTransferAmount("")
        } catch (error) {
            console.error("CHYBA PRI PRESUNU:", error)

            window.alert(
                "Přesun financí se nepodařilo provést. Detail chyby je v konzoli."
            )
        }
    }
    const handleCancel = () => {
        setSource(null)
        setDestination(null)
        setHoveredTarget(null)
        setTransferAmount("")
    }

    return (
        <div>
            {source && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                        <div>
                            Zdroj financí: <strong>{getFinanceName(source)}</strong>.
                        </div>

                        {!destination && (
                            <div>
                                Teď klikni na cílový prvek.
                            </div>
                        )}

                        {destination && (
                            <>
                                <div>
                                    Cíl financí: <strong>{getFinanceName(destination)}</strong>.
                                </div>

                                <div className="mt-2">
                                    <label className="form-label mb-1">
                                        Částka k přesunu:
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        style={{ maxWidth: "260px" }}
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        placeholder="Zadej částku"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-success btn-sm mt-2"
                                    onClick={handleTransferConfirm}
                                    disabled={loading}
                                >
                                    Provést přesun
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
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
                item={diagramItem}
                header={header}
                onSelect={handleSelect}
                selectedSourceId={source?.id}
                selectedTargetId={hoveredTarget}
            />
        </div>
    )
}