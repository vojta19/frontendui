import {
    useMemo,
    useState
} from "react";

import {
    Table as BaseTable,
    buildTableDef
} from "../../../../_template/src/Base/Components/Table";


/**
 * Column configuration used by the finance table.
 *
 * Keys correspond to finance entity attributes and values define the
 * localized labels displayed in the table header.
 *
 * @constant
 * @type {Object<string, string>}
 */
const WANTED_COLUMNS = {
    __typename: "Typ",
    id: "ID",
    name: "Název",
    lastchange: "Naposledy změněno",
    created: "Vytvořeno",
    nameEn: "EN název",
    value: "Částka",
    description: "Popis",
    tools: "Nástroje"
};


/**
 * Finance entity properties that support client-side sorting.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_SORT_KEYS = [
    "id",
    "name",
    "value"
];


/**
 * Formats a numeric value as Czech currency.
 *
 * Non-numeric values are converted to numbers. Invalid values are represented
 * as zero.
 *
 * @param {number|string|null|undefined} value
 * Financial value to format.
 *
 * @returns {string}
 * Localized currency string expressed in Czech crowns.
 *
 * @example
 * formatCurrency(250000);
 *
 * // Returns: "250 000 Kč"
 */
const formatCurrency = (value) => {
    // Ověří, zda je hodnota číslo, pokud ne, převede ji na číslo, případně použije 0 jako fallback
    const numericValue =
        typeof value === "number"
            ? value
            : Number(value) || 0;

    // Vrátí zformátované číslo podle české lokalizace s připojenou měnou "Kč"
    return `${numericValue.toLocaleString("cs-CZ")} Kč`;
};


/**
 * Formats a date value using the Czech locale.
 *
 * Invalid or missing date values are returned as a fallback representation.
 *
 * @param {string|null|undefined} dateString
 * ISO date string or another value accepted by the JavaScript `Date`
 * constructor.
 *
 * @returns {string}
 * Localized date and time, a dash for missing values, or the original string
 * for invalid dates.
 *
 * @example
 * formatDate("2026-07-13T15:18:34.884Z");
 *
 * // Returns a localized Czech date and time.
 */
const formatDate = (dateString) => {
    // Pokud datum není definováno, vrátí pomlčku
    if (!dateString) {
        return "-";
    }

    try {
        // Vytvoří novou instanci Date z předaného řetězce
        const date = new Date(dateString);

        // Pokud je vytvořené datum neplatné, vrátí původní řetězec
        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        // Převede datum na český formát zápisu (DD. MM. YYYY)
        const localizedDate =
            date.toLocaleDateString("cs-CZ");

        // Převede čas na český formát se specifikací dvouciferných hodin a minut
        const localizedTime =
            date.toLocaleTimeString(
                "cs-CZ",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        // Spojí zformátované datum a čas mezerou do jednoho řetězce
        return `${localizedDate} ${localizedTime}`;
    } catch {
        // V případě neočekávané chyby při parsování vrátí původní řetězec
        return dateString;
    }
};


/**
 * Extracts the final numeric segment from an identifier.
 *
 * The helper is used for natural sorting of UUID-like values or custom
 * identifiers whose meaningful ordering value is stored in the last
 * hyphen-separated segment.
 *
 * @param {string|number|null|undefined} idValue
 * Identifier whose final numeric segment should be extracted.
 *
 * @returns {number}
 * Parsed numeric suffix or zero when no numeric value is available.
 *
 * @example
 * getLastNumberFromId(
 *     "30000000-0000-0000-0000-000000000003"
 * );
 *
 * // Returns: 3
 */
const getLastNumberFromId = (idValue) => {
    // Pokud ID neexistuje, vrátí výchozí hodnotu 0
    if (!idValue) {
        return 0;
    }

    // Rozdělí řetězec identifikátoru na části podle pomlček
    const parts = String(idValue).split("-");
    // Získá poslední prvek z rozděleného pole
    const lastPart = parts.at(-1);

    // Převede poslední část na celé číslo v desítkové soustavě, v případě neúspěchu vrátí 0
    return Number.parseInt(lastPart, 10) || 0;
};


/**
 * Displays finance entities in a sortable table.
 *
 * The component extends the shared table implementation with:
 *
 * - a restricted set of finance-specific columns,
 * - client-side sorting by identifier, name and amount,
 * - localized Czech currency formatting,
 * - localized date and time formatting,
 * - visual sort direction indicators in column headers.
 *
 * Sorting is triggered by clicking a supported table header. Clicking buttons
 * or contextual menus does not change the current sorting configuration.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object[]} props.data
 * Finance entities rendered as table rows.
 *
 * @returns {JSX.Element|null}
 * Sortable finance table, or `null` when no data is available.
 *
 * @example
 * <Table
 *     data={[
 *         {
 *             id: "30000000-0000-0000-0000-000000000003",
 *             name: "Rozpočet WP2",
 *             value: 900000
 *         }
 *     ]}
 * />
 */
export const Table = ({
    data
}) => {
    // Pokud předaná data nejsou pole nebo je pole prázdné, komponenta nevykreslí nic
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Stav pro uložení aktuálního klíče řazení a směru (výchozí je vzestupně podle "id")
    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "asc"
    });


    /**
     * Updates the active sort key and direction.
     *
     * Clicking the currently active ascending column changes the direction to
     * descending. Selecting another supported column starts with ascending
     * order.
     *
     * @param {string} key
     * Finance property used for sorting.
     *
     * @returns {void}
     */
    const handleSort = (key) => {
        // Ignoruje řazení, pokud vybraný sloupec není v seznamu povolených klíčů pro řazení
        if (!ALLOWED_SORT_KEYS.includes(key)) {
            return;
        }

        // Určí nový směr řazení: pokud se kliklo na již aktivní klíč s 'asc', změní ho na 'desc', jinak nastaví 'asc'
        const direction =
            sortConfig.key === key &&
            sortConfig.direction === "asc"
                ? "desc"
                : "asc";

        // Aktualizuje stav s novým klíčem a směrem řazení
        setSortConfig({
            key,
            direction
        });
    };


    // Memoizované seřazení dat, které se přepočítá pouze při změně dat nebo konfigurace řazení
    const sortedData = useMemo(() => {
        // Vytvoří mělkou kopii dat, aby se neupravovalo původní pole (immutable přístup)
        const sortableItems = [...data];

        // Pokud není nastaven klíč pro řazení, vrátí neupravenou kopii dat
        if (!sortConfig.key) {
            return sortableItems;
        }

        // Seřadí položky v poli na základě aktuální konfigurace
        sortableItems.sort((firstItem, secondItem) => {
            // Získá hodnotu pro řazení z prvního porovnávaného objektu podle nastaveného klíče
            let firstValue =
                firstItem?.[sortConfig.key];

            // Získá hodnotu pro řazení z druhého porovnávaného objektu podle nastaveného klíče
            let secondValue =
                secondItem?.[sortConfig.key];

            // Specifické řazení pro sloupec "id" (např. UUID, kde porovnáváme koncové číslo)
            if (sortConfig.key === "id") {
                // Vytáhne koncové číslo z prvního ID
                const firstNumber =
                    getLastNumberFromId(firstValue);

                // Vytáhne koncové číslo z druhého ID
                const secondNumber =
                    getLastNumberFromId(secondValue);

                // Porovná čísla podle směru řazení (vzestupně / sestupně)
                return sortConfig.direction === "asc"
                    ? firstNumber - secondNumber
                    : secondNumber - firstNumber;
            }

            // Specifické řazení pro číselný sloupec "value" (částka)
            if (sortConfig.key === "value") {
                // Převede hodnotu prvního prvku na číslo s fallbackem na nulu
                const firstNumber =
                    Number(firstValue) || 0;

                // Převede hodnotu druhého prvku na číslo s fallbackem na nulu
                const secondNumber =
                    Number(secondValue) || 0;

                // Porovná číselné hodnoty podle nastaveného směru řazení
                return sortConfig.direction === "asc"
                    ? firstNumber - secondNumber
                    : secondNumber - firstNumber;
            }

            // Výchozí textové řazení pro ostatní sloupce (např. "name") převedené na malá písmena
            firstValue =
                String(firstValue ?? "")
                    .toLocaleLowerCase("cs-CZ");

            // Převod hodnoty druhého textu na malá písmena s českým nastavením
            secondValue =
                String(secondValue ?? "")
                    .toLocaleLowerCase("cs-CZ");

            // Porovná řetězce s respektováním českých pravidel řazení (např. správné řazení "Ch")
            const comparison =
                firstValue.localeCompare(
                    secondValue,
                    "cs-CZ"
                );

            // Vrátí výsledek porovnání textů s ohledem na směr řazení (při sestupném invertuje znaménko)
            return sortConfig.direction === "asc"
                ? comparison
                : -comparison;
        });

        // Vrátí nově seřazené pole
        return sortableItems;
    }, [
        data,
        sortConfig
    ]);


    // Memoizované sestavení definice tabulky (sloupců, labelů a komponent pro buňky)
    const customTableDef = useMemo(() => {
        // Vygeneruje základní definici tabulky z připravených seřazených dat
        const baseDefinition =
            buildTableDef(sortedData);

        // Objekt pro uložení výsledné upravené a vyfiltrované definice sloupců
        const filteredDefinition = {};

        // Projde všechny klíče definované v požadovaných sloupcích (WANTED_COLUMNS)
        Object.keys(WANTED_COLUMNS).forEach((key) => {
            // Pokud požadovaný sloupec v základní definici tabulky neexistuje, přeskočí se
            if (!baseDefinition[key]) {
                return;
            }

            // Načte výchozí český překlad záhlaví sloupce
            let label = WANTED_COLUMNS[key];

            // Pokud je sloupec aktuálně aktivní pro řazení a řazení v něm je povoleno
            if (
                sortConfig.key === key &&
                ALLOWED_SORT_KEYS.includes(key)
            ) {
                // Připojí k názvu sloupce šipku nahoru pro vzestupný směr, nebo šipku dolů pro sestupný
                label +=
                    sortConfig.direction === "asc"
                        ? " ▲"
                        : " ▼";
            }

            // Vytvoří novou definici sloupce, zkopíruje původní a přepíše její popisek (label)
            filteredDefinition[key] = {
                ...baseDefinition[key],
                label
            };

            // Pokud jde o sloupec finanční hodnoty, nastaví vlastní komponentu pro formátování měny
            if (key === "value") {
                filteredDefinition[key].component =
                    ({ row }) => (
                        <td>
                            {formatCurrency(row?.value)}
                        </td>
                    );
            }

            // Pokud jde o sloupce s datem změny nebo vytvoření, nastaví komponentu s formátováním data
            if (
                key === "lastchange" ||
                key === "created"
            ) {
                filteredDefinition[key].component =
                    ({ row }) => (
                        <td>
                            {formatDate(row?.[key])}
                        </td>
                    );
            }
        });

        // Vrátí finální definici tabulky obsahující pouze vybrané a upravené sloupce
        return filteredDefinition;
    }, [
        sortedData,
        sortConfig
    ]);


    /**
     * Handles delegated click events inside the table container.
     *
     * The handler detects sortable table headers while ignoring clicks on
     * buttons and contextual menus.
     *
     * @param {React.MouseEvent<HTMLDivElement>} event
     * Click event originating from the table wrapper.
     *
     * @returns {void}
     */
    const handleTableClick = (event) => {
        // Získá element, na který uživatel skutečně kliknul
        const clickedElement = event.target;

        // Pokud kliknutí proběhlo uvnitř kontextového menu nebo na tlačítko, řazení se ignoruje
        if (
            clickedElement.closest("[role='menu']") ||
            clickedElement.closest("button")
        ) {
            return;
        }

        // Najde nejbližší nadřazený element hlavičky tabulky (th) od místa kliknutí
        const headerCell =
            clickedElement.closest("th");

        // Pokud se nekliklo uvnitř žádné hlavičky sloupce, funkce končí
        if (!headerCell) {
            return;
        }

        // Získá text z hlavičky, odstraní z něj případné indikační šipky řazení a ořízne bílé znaky
        const clickedLabel =
            headerCell.innerText
                .replace(" ▲", "")
                .replace(" ▼", "")
                .trim();

        // Najde odpovídající datový klíč sloupce, jehož překlad odpovídá textu kliknutého záhlaví
        const columnKey =
            Object.keys(WANTED_COLUMNS).find(
                (key) =>
                    WANTED_COLUMNS[key] ===
                    clickedLabel
            );

        // Pokud byl klíč sloupce úspěšně nalezen, spustí na něm logiku řazení
        if (columnKey) {
            handleSort(columnKey);
        }
    };


    // Vykreslí responzivní obal tabulky s delegovaným onClick eventem a samotnou základní tabulku
    return (
        <div
            className="table-responsive"
            onClick={handleTableClick}
        >
            <BaseTable
                data={sortedData}
                table_def={customTableDef}
            />
        </div>
    );
};