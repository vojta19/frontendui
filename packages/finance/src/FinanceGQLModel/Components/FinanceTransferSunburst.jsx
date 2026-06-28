// Importuje useState z Reactu.
// useState se zde používá pro ukládání vybraného zdroje, cíle a částky přesunu.
import { useState } from "react";

// Importuje komponentu SunburstDiagram.
// Tato komponenta vykresluje kruhový Sunburst diagram finanční struktury.
import { SunburstDiagram } from "./SunBurstDiagram";

// Importuje vlastní hook pro spouštění asynchronních akcí.
// Používá se pro spuštění GraphQL mutace.
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";

// Importuje GraphQL async akci pro vložení finančního transferu.
// Tato akce odešle na backend informaci o zdroji, cíli a částce přesunu.
import { FinanceTransferInsertAsyncAction } from "../Queries/FinanceTransferInsertAsyncAction";

// Pomocná funkce pro získání zobrazitelného názvu finance.
// Pokud finance nemá name, použije nameEn.
// Pokud nemá ani nameEn, použije id.
// Pokud není dostupné nic, vrátí text "Neznámý prvek".
const getFinanceName = (finance) => {
    return finance?.name || finance?.nameEn || finance?.id || "Neznámý prvek";
};

// Pomocná funkce, která kontroluje,
// jestli je možné provést přesun mezi dvěma finančními prvky.
const canTransferBetween = (source, destination) => {
    // Pokud chybí zdroj nebo cíl, přesun není možný.
    if (!source || !destination) return false;

    // Nelze přesouvat finance ze stejného prvku do stejného prvku.
    if (source.id === destination.id) return false;

    // Pokud mají oba prvky masterfinanceId,
    // povolíme přesun pouze v rámci stejné nadřazené finance.
    if (source.masterfinanceId && destination.masterfinanceId) {
        return source.masterfinanceId === destination.masterfinanceId;
    }

    // Pokud masterfinanceId není u obou prvků dostupné,
    // přesun zatím povolíme.
    return true;
};

// Komponenta FinanceTransferSunburst řeší:
// - výběr zdrojového finančního prvku,
// - výběr cílového finančního prvku,
// - zadání částky,
// - odeslání transferu na backend,
// - vykreslení Sunburst diagramu.
export const FinanceTransferSunburst = ({
    item, // Kořenový finanční objekt, ze kterého se vykresluje diagram.
    header = "Finance – přesun financí", // Výchozí nadpis diagramu.
    onTransferInserted = () => {}, // Callback zavolaný po úspěšném vložení transferu.
}) => {
    // Ukládá vybraný zdroj přesunu.
    const [source, setSource] = useState(null);

    // Ukládá vybraný cíl přesunu.
    const [destination, setDestination] = useState(null);

    // Ukládá ID cílového prvku pro vizuální zvýraznění v diagramu.
    const [hoveredTarget, setHoveredTarget] = useState(null);

    // Ukládá částku zadanou uživatelem v inputu.
    // Hodnota je string, protože přichází přímo z HTML inputu.
    const [transferAmount, setTransferAmount] = useState("");

    // Připraví funkci pro spuštění GraphQL mutace financeTransferInsert.
    const {
        run: runFinanceTransferInsert, // Funkce, která skutečně odešle mutaci.
        loading, // Boolean hodnota, která říká, jestli právě probíhá request.
    } = useAsyncThunkAction(
        FinanceTransferInsertAsyncAction,
        {},
        {
            deferred: true, // Akce se nespustí hned automaticky.
            network: true, // Akce má jít přes síť na backend.
        }
    );

    // Handler pro kliknutí na uzel v diagramu.
    // První klik vybere zdroj.
    // Druhý klik vybere cíl.
    const handleSelect = (node) => {
        console.log("KLIK V DIAGRAMU:", node);
        console.log("AKTUALNI SOURCE:", source);

        // Pokud kliknutý uzel nemá ID, ignorujeme ho.
        if (!node?.id) return;

        // Pokud ještě není vybraný zdroj,
        // kliknutý uzel nastavíme jako zdroj přesunu.
        if (!source) {
            setSource(node);
            setDestination(null);
            setHoveredTarget(null);
            setTransferAmount("");
            return;
        }

        // Pokud už zdroj existuje, kontrolujeme,
        // jestli je možné kliknutý uzel použít jako cíl.
        if (!canTransferBetween(source, node)) {
            window.alert(
                "Přesun je povolen pouze mezi dvěma různými finančními prvky."
            );
            return;
        }

        // Pokud je přesun povolený, nastavíme kliknutý uzel jako cíl.
        setDestination(node);

        // Nastavíme ID cíle pro zvýraznění v diagramu.
        setHoveredTarget(node.id);
    };

    // Handler pro potvrzení přesunu.
    // Spouští se po kliknutí na tlačítko "Provést přesun".
    const handleTransferConfirm = async () => {
        // Nejprve musí být vybraný zdroj i cíl.
        if (!source || !destination) {
            window.alert("Nejdřív vyber zdroj i cíl přesunu.");
            return;
        }

        // Částku převedeme ze stringu na číslo.
        // replace(",", ".") umožní zadat desetinné číslo i s českou čárkou.
        const amount = Number(String(transferAmount).replace(",", "."));

        // Částka musí být platné kladné číslo.
        if (!Number.isFinite(amount) || amount <= 0) {
            window.alert("Nejdřív zadej platnou částku k přesunu.");
            return;
        }

        // Kontrola, jestli má zdroj dostatek financí.
        if (Number(source.value) < amount) {
            window.alert("Zdroj nemá dostatek financí pro tento přesun.");
            return;
        }

        try {
            // Proměnné pro GraphQL mutaci.
            // Názvy musí odpovídat názvům proměnných v query/mutation definici.
            const variables = {
                financeTransfer_financeSourceId: source.id,
                financeTransfer_financeDestinationId: destination.id,
                financeTransfer_name: `Přesun: ${getFinanceName(source)} → ${getFinanceName(destination)}`,
                financeTransfer_amount: amount,
            };

            console.log("ODESILAM TRANSFER:", variables);

            // Spuštění GraphQL mutace.
            const result = await runFinanceTransferInsert(variables);

            console.log("VYSLEDEK TRANSFERU:", result);

            // Z odpovědi vytáhneme výsledek mutace.
            const inserted = result?.data?.financeTransferInsert;

            // Ověření, že backend opravdu vrátil úspěšně vložený FinanceTransferGQLModel.
            if (inserted?.__typename !== "FinanceTransferGQLModel") {
                console.error("TRANSFER NEPROBEHL USPESNE:", inserted);
                return;
            }

            // Vytvoření zjednodušeného objektu transferu,
            // který předáme rodičovské komponentě přes callback.
            const insertedTransfer = {
                financeSourceId: variables.financeTransfer_financeSourceId,
                financeDestinationId: variables.financeTransfer_financeDestinationId,
                amount: Number(variables.financeTransfer_amount || 0),
                name: variables.financeTransfer_name,
            };

            console.log("USPESNY TRANSFER:", insertedTransfer);

            // Informujeme rodičovskou komponentu,
            // že transfer byl úspěšně vložen.
            // Rodič může například znovu načíst data z backendu.
            await onTransferInserted?.(insertedTransfer);

            // Po úspěšném přesunu resetujeme výběr a input.
            setSource(null);
            setDestination(null);
            setHoveredTarget(null);
            setTransferAmount("");
        } catch (error) {
            // Pokud nastane chyba při requestu nebo při zpracování odpovědi,
            // vypíšeme detail do konzole.
            console.error("CHYBA PRI PRESUNU:", error);

            // Uživateli zobrazíme jednoduchou hlášku.
            window.alert(
                "Přesun financí se nepodařilo provést. Detail chyby je v konzoli."
            );
        }
    };

    // Handler pro zrušení aktuálního výběru.
    // Vrátí komponentu do počátečního stavu.
    const handleCancel = () => {
        setSource(null);
        setDestination(null);
        setHoveredTarget(null);
        setTransferAmount("");
    };

    return (
        <div>
            {/* Informační panel se zobrazí pouze tehdy, když je vybraný zdroj. */}
            {source && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                        <div>
                            Zdroj financí: <strong>{getFinanceName(source)}</strong>.
                        </div>

                        {/* Pokud ještě není vybraný cíl, uživateli řekneme, co má udělat dál. */}
                        {!destination && (
                            <div>
                                Teď klikni na cílový prvek.
                            </div>
                        )}

                        {/* Pokud už je vybraný cíl, zobrazíme cíl, input na částku a potvrzovací tlačítko. */}
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

                    {/* Tlačítko pro zrušení aktuálního výběru. */}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleCancel}
                    >
                        Zrušit výběr
                    </button>
                </div>
            )}

            {/* Loading hláška se zobrazí během probíhajícího requestu. */}
            {loading && (
                <div className="alert alert-warning">
                    Probíhá přesun financí...
                </div>
            )}

            {/* Samotný Sunburst diagram. */}
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