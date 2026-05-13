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
    header = "Finance – přesun financí"
}) => {
    const [source, setSource] = useState(null)
    const [hoveredTarget, setHoveredTarget] = useState(null)
    const [diagramItem, setDiagramItem] = useState(item)

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

    const handleSelect = async (node) => {
        console.log("KLIK V DIAGRAMU:", node)
        console.log("AKTUALNI SOURCE:", source)

        if (!node?.id) return

        if (!source) {
            setSource(node)
            setHoveredTarget(null)
            return
        }

        setHoveredTarget(node.id)
        const destination = node

        if (!canTransferBetween(source, destination)) {
            window.alert(
                "Přesun je povolen pouze mezi dvěma různými finančními prvky."
            )
            setSource(null)
            setHoveredTarget(null)
            return
        }

        const amountInput = window.prompt(
            `Zadejte částku k přesunu:\n\nZ: ${getFinanceName(source)}\nDo: ${getFinanceName(destination)}`
        )

        if (!amountInput) {
            setSource(null)
            setHoveredTarget(null)
            return
        }

        const amount = Number(String(amountInput).replace(",", "."))

        if (!Number.isFinite(amount) || amount <= 0) {
            window.alert("Zadaná částka není platná.")
            setSource(null)
            setHoveredTarget(null)
            return
        }

        if (Number(source.value) < amount) {
            window.alert("Zdrojový prvek nemá dostatek financí.")
            setSource(null)
            setHoveredTarget(null)
            return
        }

        try {
            const transferVariables = {
                financeTransfer_financeSourceId: source.id,
                financeTransfer_financeDestinationId: destination.id,
                financeTransfer_name: `Přesun financí: ${getFinanceName(source)} -> ${getFinanceName(destination)}`,
                financeTransfer_amount: amount,
                financeTransfer_id: null
            }

            console.log("JDU VOLAT financeTransferInsert")
            console.log("financeTransferInsert variables:", transferVariables)

            const transferInsertResult = await runFinanceTransferInsert(
                transferVariables
            )

            console.log("financeTransferInsert result:", transferInsertResult)

            const transferResult =
                transferInsertResult?.data?.financeTransferInsert ||
                transferInsertResult?.financeTransferInsert

            if (transferResult?.__typename === "FinanceTransferGQLModelInsertError") {
                console.error("Chyba z backendu:", transferResult)
                window.alert(
                    transferResult?.msg ||
                    "Backend odmítl přesun financí."
                )
                setSource(null)
                setHoveredTarget(null)
                return
            }

            setDiagramItem((currentItem) =>
                applyLocalTransfer(
                    currentItem,
                    source.id,
                    destination.id,
                    amount
                )
            )

            window.alert(
                "Přesun financí byl zaznamenán a hodnoty byly lokálně upraveny v diagramu."
            )

            setSource(null)
            setHoveredTarget(null)
        } catch (error) {
            console.error("Chyba při přesunu financí:", error)

            const msg =
                error?.errors?.msg ||
                error?.message ||
                "Přesun financí se nepodařilo provést."

            window.alert(msg)
            setSource(null)
            setHoveredTarget(null)
        }
    }

    const handleCancel = () => {
        setSource(null)
        setHoveredTarget(null)
    }

    return (
        <div>
            {source && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                        Zdroj financí: <strong>{getFinanceName(source)}</strong>.
                        Teď klikni na cílový prvek.
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