// Import React hooku pro správu lokálního stavu komponenty.
import { useState } from "react";

// Import samotné komponenty, která vykresluje Sunburst diagram.
import { SunburstDiagram } from "./SunBurstDiagram";

// Import hooku pro spuštění asynchronní thunk akce,
// která komunikuje s backendem přes GraphQL.
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";

// Import konkrétní GraphQL async akce pro vytvoření finančního přesunu.
import {
    FinanceTransferInsertAsyncAction
} from "../Queries/FinanceTransferInsertAsyncAction";


/**
 * Returns a human-readable name for a finance entity.
 *
 * The function prefers the Czech name stored in `name`. If the Czech
 * name is unavailable, it uses the English name, the entity identifier
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
 */
const getFinanceName = (finance) => {
    // Vrací první dostupnou hodnotu podle zadané priority:
    // český název, anglický název, ID, případně výchozí text.
    return (
        finance?.name ||
        finance?.nameEn ||
        finance?.id ||
        "Neznámý prvek"
    );
};


/**
 * Determines whether a transfer between two finance entities is allowed.
 *
 * A transfer is rejected when:
 * - the source or destination is missing,
 * - both entities have the same identifier,
 * - both entities belong to different parent finances.
 *
 * If one of the entities does not provide `masterfinanceId`,
 * the transfer is currently allowed.
 *
 * @param {Object|null|undefined} source
 * Source finance entity.
 *
 * @param {string} [source.id]
 * Unique identifier of the source finance.
 *
 * @param {string} [source.masterfinanceId]
 * Identifier of the parent finance.
 *
 * @param {Object|null|undefined} destination
 * Destination finance entity.
 *
 * @param {string} [destination.id]
 * Unique identifier of the destination finance.
 *
 * @param {string} [destination.masterfinanceId]
 * Identifier of the parent finance.
 *
 * @returns {boolean}
 * Returns `true` when the transfer is allowed.
 */
const canTransferBetween = (source, destination) => {
    // Přesun nelze provést, pokud chybí zdroj nebo cíl.
    if (!source || !destination) {
        return false;
    }

    // Finance nemůže převádět prostředky sama na sebe.
    if (source.id === destination.id) {
        return false;
    }

    // Pokud oba uzly obsahují ID nadřazené finance,
    // je povolen pouze přesun mezi položkami se stejným rodičem.
    if (
        source.masterfinanceId &&
        destination.masterfinanceId
    ) {
        return (
            source.masterfinanceId ===
            destination.masterfinanceId
        );
    }

    // Pokud informace o rodičovské finance chybí,
    // aktuální implementace přesun povolí.
    return true;
};


/**
 * Displays an interactive Sunburst diagram for finance transfers.
 *
 * The component allows the user to:
 * - select a source finance,
 * - select a destination finance,
 * - enter the transfer amount,
 * - validate the transfer,
 * - execute the GraphQL transfer mutation,
 * - notify the parent component after a successful transfer.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Root finance entity displayed in the diagram.
 *
 * @param {string} props.item.id
 * Unique identifier of the root finance.
 *
 * @param {string} [props.item.name]
 * Display name of the root finance.
 *
 * @param {number} [props.item.value]
 * Current finance value.
 *
 * @param {Array<Object>} [props.item.subfinances]
 * Child finance entities displayed in the diagram.
 *
 * @param {string} [props.header="Finance – přesun financí"]
 * Diagram heading.
 *
 * @param {Function} [props.onTransferInserted]
 * Callback invoked after a successful transfer.
 *
 * @returns {JSX.Element}
 * Interactive finance transfer interface.
 *
 * @example
 * <FinanceTransferSunburst
 *     item={finance}
 *     onTransferInserted={handleTransfer}
 * />
 */
export const FinanceTransferSunburst = ({
    // Kořenový objekt finance, ze kterého se vykreslí celý diagram.
    item,

    // Text zobrazený v záhlaví diagramu.
    header = "Finance – přesun financí",

    // Callback volaný po úspěšném vytvoření finančního přesunu.
    onTransferInserted = () => {},
}) => {
    // Uchovává finance vybranou jako zdroj přesunu.
    const [source, setSource] = useState(null);

    // Uchovává finance vybranou jako cíl přesunu.
    const [destination, setDestination] = useState(null);

    // Uchovává ID cílového uzlu pro jeho grafické zvýraznění v diagramu.
    const [hoveredTarget, setHoveredTarget] = useState(null);

    // Uchovává částku zadanou uživatelem do formulářového pole.
    const [transferAmount, setTransferAmount] = useState("");

    // Uchovává potvrzovací zprávu po úspěšném provedení přesunu.
    const [successMessage, setSuccessMessage] = useState("");

    // Inicializace asynchronní GraphQL akce pro vytvoření nového transferu.
    // Funkce run je přejmenována na runFinanceTransferInsert,
    // aby bylo jasné, jakou operaci provádí.
    const {
        run: runFinanceTransferInsert,

        // Indikuje, zda právě probíhá síťový požadavek.
        loading,
    } = useAsyncThunkAction(
        // Async thunk akce obsahující GraphQL mutaci.
        FinanceTransferInsertAsyncAction,

        // Výchozí vstupní data akce jsou prázdný objekt.
        {},

        {
            // Akce se nespustí automaticky při vytvoření hooku,
            // ale až ručním zavoláním funkce run.
            deferred: true,

            // Zapnutí skutečné síťové komunikace s backendem.
            network: true,
        }
    );


    /**
    * Handles selection of a finance node in the Sunburst diagram.
    *
    * The first selected node becomes the transfer source.
    * The second selected node becomes the destination.
    *
    * @param {Object|null|undefined} node
    * Selected finance node.
    *
    * @param {string} [node.id]
    * Unique identifier of the selected finance.
    *
    * @returns {void}
    */
    const handleSelect = (node) => {
        // Při zahájení nového výběru se odstraní předchozí potvrzovací zpráva.
        setSuccessMessage("");

        // Ladicí výpis právě kliknutého uzlu.
        console.log("KLIK V DIAGRAMU:", node);

        // Ladicí výpis aktuálně vybraného zdroje.
        console.log("AKTUALNI SOURCE:", source);

        // Uzel bez platného ID nelze použít pro vytvoření transferu.
        if (!node?.id) {
            return;
        }

        // Pokud ještě není vybrán zdroj,
        // stane se kliknutý uzel zdrojovou financí.
        if (!source) {
            setSource(node);

            // Předchozí výběr cíle se odstraní.
            setDestination(null);

            // Zruší se grafické zvýraznění cílového uzlu.
            setHoveredTarget(null);

            // Vymaže se dříve zadaná částka.
            setTransferAmount("");

            return;
        }

        // Ověření, zda je možné přesun mezi zdrojem a kliknutým cílem provést.
        if (!canTransferBetween(source, node)) {
            // Uživateli se zobrazí upozornění,
            // pokud vybral neplatnou kombinaci financí.
            window.alert(
                "Přesun je povolen pouze mezi dvěma různými finančními prvky."
            );
            return;
        }

        // Kliknutý uzel se uloží jako cíl přesunu.
        setDestination(node);

        // ID cíle se uloží také pro jeho zvýraznění v Sunburst diagramu.
        setHoveredTarget(node.id);
    };


    /**
    * Validates and executes the selected finance transfer.
    *
    * The function verifies that:
    * - both source and destination are selected,
    * - the amount is a valid positive number,
    * - the source contains sufficient funds.
    *
    * After successful validation, the GraphQL mutation is executed.
    *
    * @async
    *
    * @returns {Promise<void>}
    * Promise resolved after the transfer has been processed.
    */
    const handleTransferConfirm = async () => {
        // Přesun nelze spustit, dokud není vybrán zdroj i cíl.
        if (!source || !destination) {
            window.alert(
                "Nejdřív vyber zdroj i cíl přesunu."
            );
            return;
        }

        // Převod textové hodnoty na číslo.
        // Nahrazení čárky tečkou umožní zadání desetinného čísla českým způsobem.
        const amount = Number(
            String(transferAmount).replace(",", ".")
        );

        // Kontrola, zda je částka platné kladné číslo.
        if (!Number.isFinite(amount) || amount <= 0) {
            window.alert(
                "Nejdřív zadej platnou částku k přesunu."
            );
            return;
        }

        // Ověření, že zdrojová finance obsahuje dostatek prostředků.
        if (Number(source.value) < amount) {
            window.alert(
                "Zdroj nemá dostatek financí pro tento přesun."
            );
            return;
        }

        // Uložení čitelných názvů pro následnou potvrzovací zprávu.
        const sourceName = getFinanceName(source);
        const destinationName = getFinanceName(destination);

        try {
            // Sestavení objektu proměnných očekávaných GraphQL mutací.
            const variables = {
                // ID finance, ze které se částka odečte.
                financeTransfer_financeSourceId:
                    source.id,

                // ID finance, do které se částka přičte.
                financeTransfer_financeDestinationId:
                    destination.id,

                // Automaticky vytvořený čitelný název transferu.
                financeTransfer_name:
                    `Přesun: ${getFinanceName(source)} → ` +
                    `${getFinanceName(destination)}`,

                // Číselná hodnota převáděné částky.
                financeTransfer_amount:
                    amount,
            };

            // Ladicí výpis proměnných odesílaných na backend.
            console.log(
                "ODESILAM TRANSFER:",
                variables
            );

            // Spuštění asynchronní GraphQL mutace s připravenými proměnnými.
            const result =
                await runFinanceTransferInsert(variables);

            // Ladicí výpis kompletní odpovědi backendu.
            console.log(
                "VYSLEDEK TRANSFERU:",
                result
            );

            // Vytažení výsledku konkrétní mutace z GraphQL odpovědi.
            const inserted =
                result?.data?.financeTransferInsert;

            // Ověření, zda backend skutečně vrátil nově vytvořený transfer,
            // a nikoliv chybový objekt jiného typu.
            if (
                inserted?.__typename !==
                "FinanceTransferGQLModel"
            ) {
                // Neúspěšná odpověď se vypíše do konzole.
                console.error(
                    "TRANSFER NEPROBEHL USPESNE:",
                    inserted
                );
                return;
            }

            // Vytvoření normalizovaného objektu transferu,
            // který bude předán rodičovské komponentě.
            const insertedTransfer = {
                // ID zdrojové finance.
                financeSourceId:
                    variables.financeTransfer_financeSourceId,

                // ID cílové finance.
                financeDestinationId:
                    variables.financeTransfer_financeDestinationId,

                // Částka je znovu bezpečně převedena na číslo.
                amount:
                    Number(
                        variables.financeTransfer_amount || 0
                    ),

                // Popisný název transferu.
                name:
                    variables.financeTransfer_name,
            };

            // Ladicí výpis úspěšně vytvořeného transferu.
            console.log(
                "USPESNY TRANSFER:",
                insertedTransfer
            );

            // Informování rodičovské komponenty o úspěšně vytvořeném transferu.
            // Rodič může například znovu načíst data z backendu.
            await onTransferInserted?.(
                insertedTransfer
            );

            // Zobrazení potvrzení obsahujícího částku, zdroj a cíl přesunu.
            setSuccessMessage(
                `Přesun částky ${amount.toLocaleString("cs-CZ")} Kč ` +
                `z „${sourceName}“ do „${destinationName}“ byl úspěšně proveden.`
            );

            // Po úspěchu se kompletně vyčistí stav výběru.
            setSource(null);
            setDestination(null);
            setHoveredTarget(null);
            setTransferAmount("");
        } catch (error) {
            // Zachycení síťové nebo jiné neočekávané chyby.
            console.error(
                "CHYBA PRI PRESUNU:",
                error
            );

            // Zobrazení obecné chybové zprávy uživateli.
            window.alert(
                "Přesun financí se nepodařilo provést. " +
                "Detail chyby je v konzoli."
            );
        }
    };


    /**
    * Clears the currently selected transfer.
    *
    * The source, destination, highlighted node and entered amount
    * are reset to their initial values.
    *
    * @returns {void}
    */
    const handleCancel = () => {
        // Zrušení vybraného zdroje.
        setSource(null);

        // Zrušení vybraného cíle.
        setDestination(null);

        // Odstranění grafického zvýraznění cíle.
        setHoveredTarget(null);

        // Vymazání zadané částky.
        setTransferAmount("");
    };


    return (
        <div>
            {/* Potvrzení úspěšného finančního přesunu. */}
            {successMessage && (
                <div
                    className={
                        "alert alert-success " +
                        "alert-dismissible fade show"
                    }
                    role="alert"
                >
                    <strong>Úspěch: </strong>
                    {successMessage}

                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Zavřít"
                        onClick={() => setSuccessMessage("")}
                    />
                </div>
            )}

            {/* Informační panel se zobrazí až po výběru zdrojové finance. */}
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
                                {/* Zobrazení čitelného názvu vybraného zdroje */}
                                {getFinanceName(source)}
                            </strong>.
                        </div>

                        {/* Pokud ještě nebyl vybrán cíl,
                            uživatel dostane instrukci k dalšímu kroku. */}
                        {!destination && (
                            <div>
                                Teď klikni na cílový prvek.
                            </div>
                        )}

                        {/* Formulář částky se zobrazí až po výběru cílové finance. */}
                        {destination && (
                            <>
                                <div>
                                    Cíl financí:{" "}
                                    <strong>
                                        {/* Zobrazení názvu cílové finance */}
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
                                        // Číselný typ inputu omezuje zadávání na číselné hodnoty.
                                        type="number"

                                        // Bootstrap formátování vstupního pole.
                                        className="form-control"

                                        // Omezení maximální šířky formuláře.
                                        style={{
                                            maxWidth: "260px",
                                        }}

                                        // Řízená hodnota inputu z React stavu.
                                        value={transferAmount}

                                        // Při každé změně se nová hodnota uloží do stavu.
                                        onChange={(event) =>
                                            setTransferAmount(
                                                event.target.value
                                            )
                                        }

                                        // Nápověda uvnitř prázdného pole.
                                        placeholder="Zadej částku"

                                        // Záporné částky nejsou uživatelským rozhraním povoleny.
                                        min="0"

                                        // Povolení zadání částky na dvě desetinná místa.
                                        step="0.01"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className={
                                        "btn btn-success " +
                                        "btn-sm mt-2"
                                    }

                                    // Po kliknutí se provede validace a GraphQL mutace.
                                    onClick={
                                        handleTransferConfirm
                                    }

                                    // Během komunikace s backendem je tlačítko deaktivované,
                                    // aby nedošlo k odeslání stejného transferu vícekrát.
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

                        // Obnovení komponenty do počátečního stavu.
                        onClick={handleCancel}
                    >
                        Zrušit výběr
                    </button>
                </div>
            )}

            {/* Během ukládání transferu se zobrazí stavová zpráva. */}
            {loading && (
                <div className="alert alert-warning">
                    Probíhá přesun financí...
                </div>
            )}

            {/* Samotný Sunburst diagram finanční hierarchie. */}
            <SunburstDiagram
                // Kořenová finance s jejími podřízenými položkami.
                item={item}

                // Nadpis karty diagramu.
                header={header}

                // Callback reagující na kliknutí na uzel diagramu.
                onSelect={handleSelect}

                // ID zdrojového uzlu slouží pro jeho grafické označení.
                selectedSourceId={source?.id}

                // ID cílového uzlu slouží pro jeho grafické zvýraznění.
                selectedTargetId={hoveredTarget}
            />
        </div>
    );
};