import { useEffect, useState } from "react" // React hooks pro state a side effects
import { SunburstDiagram } from "./SunBurstDiagram" // komponenta diagramu pro vizualizaci financí
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks" // hook pro asynchronní akce
import { FinanceTransferInsertAsyncAction } from "../Queries/FinanceTransferInsertAsyncAction" // GQL mutace pro vložení transferu

// vrací zobrazitelné jméno finance prvku
const getFinanceName = (finance) => {
    // priorita: name > nameEn > id > fallback
    return finance?.name || finance?.nameEn || finance?.id || "Neznámý prvek"
}

// ověřuje, zda je přesun mezi uzly povolený
const canTransferBetween = (source, destination) => {
    // pokud chybí zdroj nebo cíl, není povoleno
    if (!source || !destination) return false

    // nelze přesunout na sebe sama
    if (source.id === destination.id) return false

    // pokud oba mají masterfinanceId, musí být stejné (stejná hierarchie)
    if (source.masterfinanceId && destination.masterfinanceId) {
        return source.masterfinanceId === destination.masterfinanceId
    }

    // v ostatních případech je přesun povolený
    return true
}

// rekurzivně aktualizuje hodnotu uzlu v stromu
const updateNodeValue = (node, nodeId, valueDiff) => {
    // pokud není objekt, vrátí tak jak je
    if (!node || typeof node !== "object") return node

    // zkontroluje, zda je to cílový uzel
    const isTargetNode = node.id === nodeId

    // vytvoří nový uzel s aktualizovanou hodnotou
    const updatedNode = {
        ...node, // kopíruje všechny vlastnosti
        value: isTargetNode // pokud je to cílový uzel, přičítá valueDiff
            ? Number(node.value || 0) + valueDiff
            : node.value // jinak zachovává původní hodnotu
    }

    // rekurzivně aktualizuje všechny možné typy podřízených prvků
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

    // vrací aktualizovaný uzel
    return updatedNode
}

// aplikuje místní přesun v datovém stromu
const applyLocalTransfer = (root, sourceId, destinationId, amount) => {
    // nejdřív odečte částku ze zdroje
    let updatedRoot = updateNodeValue(root, sourceId, -amount)
    // pak přičte částku do cíle
    updatedRoot = updateNodeValue(updatedRoot, destinationId, amount)

    // vrací aktualizovaný strom
    return updatedRoot
}

export const FinanceTransferSunburst = ({
    item, // kořenový prvek financí
    header = "Finance – přesun financí", // titulek diagramu
    onTransferInserted = () => { }, // callback po úspěšném přesunu
}) => {
    // state pro vybraný zdroj přesunu
    const [source, setSource] = useState(null)
    // state pro vybraný cíl přesunu
    const [destination, setDestination] = useState(null)
    // state pro vizuální zvýraznění cíle
    const [hoveredTarget, setHoveredTarget] = useState(null)
    // state pro aktuální diagram data
    const [diagramItem, setDiagramItem] = useState(item)
    // state pro zadanou částku přesunu
    const [transferAmount, setTransferAmount] = useState("")

    // efekt synchronizuje diagram s prop `item` když se změní
    useEffect(() => {
        setDiagramItem(item)
    }, [item])

    // hook pro asynchronní mutaci - vloží transfer do databáze
    const {
        run: runFinanceTransferInsert, // funkce pro spuštění mutace
        loading // flag zda probíhá request
    } = useAsyncThunkAction(
        FinanceTransferInsertAsyncAction, // mutace pro vložení transferu
        {}, // inicijální parametry
        {
            deferred: true, // spustí se až když zavoláme run()
            network: true // provádí síťový request
        }
    )

    // zpracovává klik na uzel v diagramu - vybírá zdroj a cíl
    const handleSelect = (node) => {
        console.log("KLIK V DIAGRAMU:", node) // debug log
        console.log("AKTUALNI SOURCE:", source) // debug log

        if (!node?.id) return // pokud uzel nemá ID, ignoruj klik

        if (!source) {
            // pokud není vybrán zdroj, nyní se vybírá zdroj
            setSource(node) // nastaví vybraný uzel jako zdroj
            setDestination(null) // vynuluje cíl
            setHoveredTarget(null) // vynuluje zvýraznění
            setTransferAmount("") // vynuluje částku
            return
        }

        // kontroluje, zda je přesun povolený
        if (!canTransferBetween(source, node)) {
            window.alert(
                "Přesun je povolen pouze mezi dvěma různými finančními prvky."
            )
            return
        }

        // pokud je přesun povolený, nastaví cíl
        setDestination(node) // nastaví vybraný uzel jako cíl
        setHoveredTarget(node.id) // zvýrazní cíl
    }
    // potvrzuje a provádí přesun
    const handleTransferConfirm = async () => {
        // validace: musí být vybrán zdroj i cíl
        if (!source || !destination) {
            window.alert("Nejdřív vyber zdroj i cíl přesunu.")
            return
        }

        // parsuje částku a nahrazuje čárku tečkou
        const amount = Number(String(transferAmount).replace(",", "."))

        // validace: částka musí být kladné číslo
        if (!Number.isFinite(amount) || amount <= 0) {
            window.alert("Nejdřív zadej platnou částku k přesunu.")
            return
        }

        // validace: zdroj má dostatečné prostředky
        if (Number(source.value) < amount) {
            window.alert("Zdroj nemá dostatek financí pro tento přesun.")
            return
        }

        try {
            // vytváří proměnné pro GraphQL mutaci
            const variables = {
                financeTransfer_financeSourceId: source.id, // ID zdroje
                financeTransfer_financeDestinationId: destination.id, // ID cíle
                financeTransfer_name: `Přesun: ${getFinanceName(source)} → ${getFinanceName(destination)}`, // popis přesunu
                financeTransfer_amount: amount, // částka
            }

            console.log("ODESILAM TRANSFER:", variables) // debug log

            // spustí GraphQL mutaci
            const result = await runFinanceTransferInsert(variables)

            console.log("VYSLEDEK TRANSFERU:", result) // debug log

            // extrahuje vložený transfer z výsledku
            const inserted = result?.data?.financeTransferInsert

            // ověří, že byl transfer úspěšně vložen
            if (inserted?.__typename !== "FinanceTransferGQLModel") {
                console.error("TRANSFER NEPROBEHL USPESNE:", inserted)
                return
            }

            // vytváří objekt s informacemi o vloženém transferu
            const insertedTransfer = {
                financeSourceId: variables.financeTransfer_financeSourceId,
                financeDestinationId: variables.financeTransfer_financeDestinationId,
                amount: Number(variables.financeTransfer_amount || 0),
                name: variables.financeTransfer_name,
            }

            console.log("USPESNY TRANSFER:", insertedTransfer) // debug log

            // zavolá callback s informacemi o transferu
            onTransferInserted?.(insertedTransfer)

            // aplikuje místní aktualizaci diagramu (optimistická aktualizace UI)
            setDiagramItem((currentItem) =>
                applyLocalTransfer(
                    currentItem,
                    source.id,
                    destination.id,
                    amount
                )
            )

            // resetuje UI do počátečního stavu
            setSource(null)
            setDestination(null)
            setHoveredTarget(null)
            setTransferAmount("")
        } catch (error) {
            console.error("CHYBA PRI PRESUNU:", error) // debug log

            window.alert(
                "Přesun financí se nepodařilo provést. Detail chyby je v konzoli."
            )
        }
    }
    // zruší aktuální výběr a vrátí se do počátečního stavu
    const handleCancel = () => {
        setSource(null) // vynuluje zdroj
        setDestination(null) // vynuluje cíl
        setHoveredTarget(null) // vynuluje zvýraznění
        setTransferAmount("") // vynuluje částku
    }

    return (
        <div>
            {source && ( // zobrazí info panel pokud je vybrán zdroj
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                        <div>
                            Zdroj financí: <strong>{getFinanceName(source)}</strong>. {/* zobrazí název zdroje */}
                        </div>

                        {!destination && ( // pokud není vybrán cíl
                            <div>
                                Teď klikni na cílový prvek. {/* instrukce pro uživatele */}
                            </div>
                        )}

                        {destination && ( // pokud je vybrán cíl
                            <>
                                <div>
                                    Cíl financí: <strong>{getFinanceName(destination)}</strong>. {/* zobrazí název cíle */}
                                </div>

                                <div className="mt-2">
                                    <label className="form-label mb-1">
                                        Částka k přesunu: {/* label pro vstup */}
                                    </label>

                                    <input
                                        type="number" // numerický vstup
                                        className="form-control" // Bootstrap styl
                                        style={{ maxWidth: "260px" }} // maximální šířka
                                        value={transferAmount} // vazba na state
                                        onChange={(e) => setTransferAmount(e.target.value)} // aktualizuje state při změně
                                        placeholder="Zadej částku" // placeholder text
                                        min="0" // minimální hodnota
                                        step="0.01" // krok zvyšování/snižování
                                    />
                                </div>

                                <button
                                    type="button" // typ tlačítka
                                    className="btn btn-success btn-sm mt-2" // Bootstrap styl - zelené tlačítko
                                    onClick={handleTransferConfirm} // zavolá handler potvrzení
                                    disabled={loading} // disable během loadingu
                                >
                                    Provést přesun {/* text tlačítka */}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        type="button" // typ tlačítka
                        className="btn btn-sm btn-outline-secondary" // Bootstrap styl - sekundární tlačítko
                        onClick={handleCancel} // zavolá handler zrušení
                    >
                        Zrušit výběr {/* text tlačítka */}
                    </button>
                </div>
            )}

            {loading && ( // zobrazí loading zprávu pokud probíhá přesun
                <div className="alert alert-warning">
                    Probíhá přesun financí... {/* loading text */}
                </div>
            )}

            <SunburstDiagram
                item={diagramItem} // data pro diagram
                header={header} // titulek diagramu
                onSelect={handleSelect} // handler pro kliknutí na uzel
                selectedSourceId={source?.id} // ID vybraného zdroje pro zvýraznění
                selectedTargetId={hoveredTarget} // ID zvýrazněného cíle
            />
        </div>
    )
}