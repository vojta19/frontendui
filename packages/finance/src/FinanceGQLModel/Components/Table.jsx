import {
    useMemo, // Importuje hook pro memoizaci výpočetně náročných operací
    useState // Importuje hook pro správu stavu uvnitř funkcionální komponenty
} from "react"; // Importuje React hooky pro optimalizaci výkonu a správu stavu komponenty

import {
    Table as BaseTable, // Importuje základní tabulkovou komponentu pod aliasem BaseTable
    buildTableDef // Importuje pomocnou funkci pro vygenerování výchozí definice tabulky
} from "../../../../_template/src/Base/Components/Table"; // Importuje obecný komponent pro zobrazení tabulky a funkci pro sestavení definice tabulky

import { UpdateLink } from "../Mutations/Update"; // Importuje komponentu pro zobrazení odkazu na stránku aktualizace finance entity
import { DeleteButton } from "../Mutations/Delete"; // Importuje komponenty pro zobrazení odkazu na aktualizaci a tlačítka pro odstranění finance entity
import { KebabMenu } from "../../../../_template/src/Base/Components/Table"; // Importuje komponentu pro zobrazení kontextového menu s akcemi pro jednotlivé řádky tabulky


/**
 * Column definitions displayed in the finance table.
 *
 * Object keys correspond to finance entity properties and values
 * represent localized column headers.
 *
 * @constant
 * @type {Object<string, string>}
 */
const WANTED_COLUMNS = { // Definuje sloupce zobrazené v tabulce financí.
    __typename: "Typ", // Mapuje atribut __typename na textový popisek sloupce
    id: "ID", // Mapuje atribut id na textový popisek sloupce
    name: "Název", // Mapuje atribut name na textový popisek sloupce
    lastchange: "Naposledy změněno", // Mapuje atribut lastchange na textový popisek sloupce
    created: "Vytvořeno", // Mapuje atribut created na textový popisek sloupce
    nameEn: "EN název", // Mapuje atribut nameEn na textový popisek sloupce
    value: "Částka", // Mapuje atribut value na textový popisek sloupce
    description: "Popis", // Mapuje atribut description na textový popisek sloupce
    tools: "Nástroje" // Mapuje akční sloupec nástrojů na příslušný popisek
};


/**
 * Finance entity properties that support client-side sorting.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_SORT_KEYS = [ // Definuje vlastnosti financí, podle kterých lze provádět řazení na straně klienta.
    "id", // Povoluje řazení podle sloupce ID
    "name", // Povoluje řazení podle sloupce Název
    "value" // Povoluje řazení podle sloupce Částka
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
const formatCurrency = (value) => { // Pomocná funkce pro převod hodnoty na měnový formát
    const numericValue = // Inicializuje lokální konstantu pro uložení číselné hodnoty
        typeof value === "number" // Ověřuje, zda je vstupní hodnota typu číslo
            ? value // Pokud ano, použije ji přímo
            : Number(value) || 0; // Pokud ne, pokusí se ji zkonvertovat na číslo, případně dosadí 0

    return `${numericValue.toLocaleString("cs-CZ")} Kč`; // Formátuje číslo jako českou měnu s mezerami jako oddělovači tisíců a přidává symbol "Kč".
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
const formatDate = (dateString) => { // Formátuje datum a čas podle české lokalizace.
    if (!dateString) { // Kontrola existence řetězce s datem
        return "-"; // Pokud hodnota chybí, vrátí pomlčku jako fallback
    }

    try { // Začátek bloku pro ošetření chyb při práci s datem
        const date = new Date(dateString); // Pokusí se naparsovat datum ze vstupního řetězce

        if (Number.isNaN(date.getTime())) { // Kontroluje, zda je datum platné. Pokud není, vrátí původní řetězec.
            return dateString; // Vrátí nezměněný původní vstupní řetězec
        }

        const localizedDate = // Inicializuje konstantu pro zformátované datum
            date.toLocaleDateString("cs-CZ"); // Formátuje datum podle české lokalizace (např. "13. 7. 2026").

        const localizedTime = // Inicializuje konstantu pro zformátovaný čas
            date.toLocaleTimeString( // Nastavuje časové parametry lokalizace
                "cs-CZ", // Použije češtinu jako lokalizační formát
                { // Konfigurační objekt pro toLocaleTimeString
                    hour: "2-digit", // Hodiny se zobrazí vždy jako dvouciferné číslo
                    minute: "2-digit" // Minuty se zobrazí vždy jako dvouciferné číslo
                } // Konec konfiguračního objektu
            ); // Konec volání toLocaleTimeString

        return `${localizedDate} ${localizedTime}`; // Vrátí spojené datum a čas oddělené mezerou
    } catch { // Pokud nastane jakákoliv výjimka při parsování
        return dateString; // Vrátí původní řetězec v nezměněném stavu
    } // Konec catch bloku
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
const getLastNumberFromId = (idValue) => { // Získává poslední číselnou část z identifikátoru, který je oddělen pomlčkami.
    if (!idValue) { // Kontrola, zda hodnota identifikátoru vůbec existuje
        return 0; // Pokud je hodnota prázdná, vrátí výchozí nulu
    }

    const parts = String(idValue).split("-"); // Rozděluje řetězec identifikátoru na části podle pomlček a získává poslední část.
    const lastPart = parts.at(-1); // Získá poslední prvek z rozděleného pole částí

    return Number.parseInt(lastPart, 10) || 0; // Převede získanou část na celé desítkové číslo s fallbackem na 0
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
 * @param {Array<Object>} props.data
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
export const Table = ({ // Exportuje funkcionální komponentu Table
    data // Očekává vstupní vlastnost data, což je pole objektů k zobrazení
}) => { // Začátek definice komponenty
    if (!Array.isArray(data) || data.length === 0) { // Kontroluje, zda je k dispozici pole dat. Pokud ne, vrátí `null`, aby se zabránilo vykreslení prázdné tabulky.
        return null; // Zamezí vykreslení komponenty a vrátí prázdný uzel (null)
    }

    const [sortConfig, setSortConfig] = useState({ // Inicializuje stav pro konfiguraci řazení s výchozím klíčem "id" and směrem "asc".
        key: "id", // Jako výchozí sloupec pro řazení nastaví ID
        direction: "asc" // Jako výchozí směr řazení zvolí vzestupný (asc)
    }); // Konec useState hooku


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
    const handleSort = (key) => { // Pomocná metoda pro změnu nebo aktivaci řazení podle kliknutého klíče
        if (!ALLOWED_SORT_KEYS.includes(key)) { // Kontroluje, zda je vybraný klíč podporován pro řazení. Pokud ne, ukončí funkci bez změny konfigurace řazení.
            return; // Ukončí metodu a nezmění aktuální stav řazení
        }

        const direction = // Logické vyhodnocení nového směru řazení do lokální konstanty
            sortConfig.key === key && // Pokud je kliknutý sloupec již aktivně řazený
                sortConfig.direction === "asc" // ...a aktuální směr řazení byl vzestupný
                ? "desc" // ...přepne směr řazení na sestupný (desc)
                : "asc"; // V opačném případě (nový sloupec nebo směr desc) začíná řadit vzestupně (asc)

        setSortConfig({ // Uloží novou konfiguraci do vnitřního stavu komponenty
            key, // Nastaví nový nebo stávající klíč sloupce
            direction // Nastaví nově určený směr řazení
        }); // Konec setSortConfig
    }; // Konec handleSort definice


    /**
    * Memoized collection of finance entities sorted according to
    * the currently selected column and direction.
    */
    const sortedData = useMemo(() => { // Memoizuje seřazená data pro optimalizaci výkonu při překreslení
        const sortableItems = [...data]; // Vytvoří mělkou kopii pole dat, abychom neupravovali původní data

        if (!sortConfig.key) { // Kontrola, zda máme vůbec nastavený nějaký klíč pro řazení
            return sortableItems; // Pokud ne, vrátí neupravené pole kopií prvků
        }

        sortableItems.sort((firstItem, secondItem) => { // Spustí nativní JS řazení s vlastním komparátorem
            let firstValue = // Hodnota z prvního porovnávaného objektu
                firstItem?.[sortConfig.key]; // Získá hodnotu na základě aktuálně nastaveného klíče řazení

            let secondValue = // Hodnota z druhého porovnávaného objektu
                secondItem?.[sortConfig.key]; // Získá hodnotu na základě aktuálně nastaveného klíče řazení

            if (sortConfig.key === "id") { // Specifická řadicí logika pro ID sloupce
                const firstNumber = // Extrahuje koncové číslo z prvního ID
                    getLastNumberFromId(firstValue); // Volání dříve definované pomocné funkce

                const secondNumber = // Extrahuje koncové číslo z druhého ID
                    getLastNumberFromId(secondValue); // Volání dříve definované pomocné funkce

                return sortConfig.direction === "asc" // Vyhodnotí směr řazení pro ID sloupce
                    ? firstNumber - secondNumber // Pro 'asc' provede standardní číselný odpočet
                    : secondNumber - firstNumber; // Pro 'desc' provede obrácený číselný odpočet
            }

            if (sortConfig.key === "value") { // Specifická řadicí logika pro číselný sloupec Částka
                const firstNumber = // Převede hodnotu prvního prvku na reálné číslo
                    Number(firstValue) || 0; // Fallback na 0 v případě neplatného čísla

                const secondNumber = // Převede hodnotu druhého prvku na reálné číslo
                    Number(secondValue) || 0; // Fallback na 0 v případě neplatného čísla

                return sortConfig.direction === "asc" // Vyhodnotí směr řazení pro číselné hodnoty
                    ? firstNumber - secondNumber // Pro 'asc' seřadí vzestupně
                    : secondNumber - firstNumber; // Pro 'desc' seřadí sestupně
            }

            firstValue = // Textový převod s českou lokalizací pro ostatní hodnoty (např. názvy)
                String(firstValue ?? "") // Ošetří případné nullové hodnoty a převede na string
                    .toLocaleLowerCase("cs-CZ"); // Převede text na malá písmena podle české znakové sady

            secondValue = // Textový převod s českou lokalizací pro druhý porovnávaný objekt
                String(secondValue ?? "") // Ošetří případné nullové hodnoty a převede na string
                    .toLocaleLowerCase("cs-CZ"); // Převede text na malá písmena podle české znakové sady

            const comparison = // Provede standardní abecední srovnání s respektováním češtiny
                firstValue.localeCompare( // Metoda pro bezpečné porovnání lokalizovaných řetězců
                    secondValue, // Porovná s druhým znormalizovaným řetězcem
                    "cs-CZ" // Explicitně použije česká pravidla (např. řazení "ch" po "h")
                ); // Konec localeCompare

            return sortConfig.direction === "asc" // Vyhodnotí směr řazení pro abecední řetězce
                ? comparison // Pro 'asc' vrátí přímý výsledek porovnání
                : -comparison; // Pro 'desc' výsledek neguje
        }); // Konec komparátoru řazení

        return sortableItems; // Vrátí seřazené kopírované pole
    }, [ // Pole závislostí pro useMemo
        data, // Přepočítá se při změně vstupních dat
        sortConfig // ...nebo při změně konfigurace klíče či směru řazení
    ]); // Konec useMemo pro sortedData


    /**
    * Memoized table definition extending the shared table
    * configuration with finance-specific formatting,
    * localized labels and action buttons.
    */
    const customTableDef = useMemo(() => { // Memoizuje definici sloupců a jejich chování pro BaseTable
        const baseDefinition =
            buildTableDef(sortedData);      // Vytvoří základní definici tabulky z aktuálně seřazených dat.

        const filteredDefinition = {}; // Inicializuje prázdný objekt pro naši novou upravenou definici

        Object.keys(WANTED_COLUMNS).forEach((key) => { // Prochází pouze klíče sloupců, které chceme reálně zobrazit
            if (key === "tools") { // Specifická konfigurace pro akční sloupec "Nástroje"
                filteredDefinition[key] = { // Definice objektu pro klíč "tools"
                    label: WANTED_COLUMNS[key], // Nastaví popisek sloupce "Nástroje" pro akční tlačítka.
                    component: ({ row }) => ( // Nastaví komponentu, která se vykreslí v každé buňce tohoto sloupce
                        <td>
                            <KebabMenu actions={[ // Vykreslí rozbalovací menu s akcemi pro daný řádek
                                { // Definice první akce v kebab menu
                                    children: ( // Vnitřní JSX element první akce
                                        <UpdateLink     // Zobrazuje odkaz pro úpravu finance entity s oprávněními a výchozím URI pro navigaci na stránku úpravy.
                                            className="btn btn-sm btn-outline-secondary border-0 text-start w-100" // CSS třídy pro vzhled tlačítka
                                            item={row} // Předá celý objekt řádku jako cíl úpravy
                                            rbacitem={row?.rbacobject} // Předá přístupový rbac objekt pro ověření uživatelských práv
                                        >
                                            Editovat
                                        </UpdateLink> // Konec komponenty UpdateLink
                                    ) // Konec dětí první akce
                                }, // Konec první akce
                                { // Definice druhé akce v kebab menu
                                    children: ( // Vnitřní JSX element druhé akce
                                        <DeleteButton // Zobrazuje tlačítko pro odstranění finance entity s oprávněními a výchozím URI pro navigaci na stránku odstranění.
                                            className="btn btn-sm btn-outline-danger border-0 text-start w-100" // CSS třídy pro varovné červené tlačítko
                                            item={row} // Předá celý objekt řádku k odstranění
                                            rbacitem={row?.rbacobject} // Předá rbac objekt pro ověření práv na smazání
                                        >
                                            Smazat
                                        </DeleteButton> // Konec komponenty DeleteButton
                                    ) // Konec dětí druhé akce
                                } // Konec druhé akce
                            ]} /> {/* Konec komponenty KebabMenu */}
                        </td> // Konec buňky td
                    ) // Konec definice komponenty buňky
                }; // Konec definice pro sloupec tools
                return // Ukončí iteraci pro aktuální klíč "tools" a pokračuje dalším sloupcem
            } // Konec podmínky pro tools

            if (!baseDefinition[key]) { // Pokud klíč sloupce neexistuje ve vygenerované základní definici
                return; // Přeskočí tento klíč a pokračuje v cyklu
            }

            let label = WANTED_COLUMNS[key]; // Získá lokalizovaný název sloupce z naší mapy WANTED_COLUMNS

            if ( // Podmínka pro zobrazení indikátoru aktivního řazení u záhlaví sloupce
                sortConfig.key === key && // Sloupec musí odpovídat aktuálnímu řazenému klíči
                ALLOWED_SORT_KEYS.includes(key) // ...a zároveň musí patřit mezi podporované sloupce pro řazení
            ) { // Pokud jsou splněny obě podmínky
                label += // Připojí k textovému popisku sloupce odpovídající znak šipky
                    sortConfig.direction === "asc" // Přidává vizuální indikátor směru řazení do popisku sloupce.
                        ? " ▲" // Šipka nahoru pro vzestupné řazení
                        : " ▼"; // Šipka dolů pro sestupné řazení
            } // Konec bloku pro přidání šipek

            filteredDefinition[key] = { // Zkopíruje vlastnosti a doplní upravený popisek do naší definice
                ...baseDefinition[key], // Rozbalí existující základní nastavení sloupce
                label // Přepíše nebo definuje nový popisek záhlaví (label) se šipkou
            }; // Konec přiřazení definice sloupce

            if (key === "value") { // Pokud se jedná o sloupec s finanční hodnotou
                filteredDefinition[key].component = // Nastaví vlastní komponentu pro formátování finanční buňky
                    ({ row }) => ( // Funkce pro vykreslení buňky
                        <td>
                            {formatCurrency(row?.value)} {/* Zobrazí zformátovanou měnu pomocí dříve popsané funkce */}
                        </td> // Konec buňky
                    ); // Konec definice komponenty
            } // Konec bloku pro formátování value

            if ( // Pokud se jedná o časové sloupce
                key === "lastchange" || // Sloupec "Naposledy změněno"
                key === "created" // ...nebo sloupec "Vytvořeno"
            ) { // Pokud se podmínka splní
                filteredDefinition[key].component = // Nastaví vlastní komponentu pro formátování časových údajů
                    ({ row }) => ( // Funkce pro vykreslení buňky
                        <td>
                            {formatDate(row?.[key])} {/* Zobrazí datum zformátované dle české lokace */}
                        </td> // Konec buňky
                    ); // Konec definice komponenty
            } // Konec bloku pro formátování časových údajů
        }); // Konec procházení klíčů WANTED_COLUMNS

        return filteredDefinition; // Vrátí kompletní sestavenou a upravenou definici tabulky
    }, [ // Pole závislostí useMemo
        sortedData, // Přepočítá se, pokud se změní seřazená data
        sortConfig // ...nebo pokud se změní nastavení řazení (pro překreslení šipek v záhlaví)
    ]); // Konec useMemo pro customTableDef


    /**
    * Handles delegated click events inside the table container.
    *
    * The handler detects sortable table headers while ignoring clicks
    * on action buttons and contextual menus.
    *
    * @param {Object} event
    * Click event originating from the table wrapper.
    *
    * @returns {void}
    */
    const handleTableClick = (event) => { // Metoda pro odchycení kliknutí na záhlaví sloupce (event delegation)
        const clickedElement = event.target; // Získá konkrétní DOM prvek, na který uživatel kliknul

        if ( // Filtruje nechtěná kliknutí uvnitř tabulky
            clickedElement.closest("[role='menu']") || // Pokud kliknutí proběhlo uvnitř jakéhokoliv menu
            clickedElement.closest("button") // ...nebo přímo na jakémkoliv tlačítku
        ) { // Pokud platí jedna z podmínek
            return; // Zastaví zpracování a neprovádí žádné řazení
        } // Konec kontroly nežádoucích prvků

        const headerCell = // Pokusí se najít buňku záhlaví
            clickedElement.closest("th"); // Vyhledá nejbližší nadřazený tag th od místa kliku

        if (!headerCell) { // Pokud se kliklo mimo záhlaví sloupce (např. do těla tabulky)
            return; // Ukončí provádění funkce
        } // Konec kontroly existence th

        const clickedLabel = // Získá čistý text hlavičky zbavený indikačních znaků
            headerCell.innerText // Načte textový obsah buňky hlavičky
                .replace(" ▲", "") // Odstraní znak šipky vzestupného řazení
                .replace(" ▼", "") // Odstraní znak šipky sestupného řazení
                .trim(); // Odstraní případné prázdné znaky na začátku a konci textu

        const columnKey = // Najde příslušný kódový klíč z WANTED_COLUMNS odpovídající vyčištěnému popisku
            Object.keys(WANTED_COLUMNS).find( // Najde klíč sloupce podle jeho popisku
                (key) => // Iteruje přes klíče mapy
                    WANTED_COLUMNS[key] === // Pokud popisek v mapě
                    clickedLabel // ...odpovídá získanému textu záhlaví
            ); // Konec metody find

        if (columnKey) { // Pokud se podařilo klíč sloupce úspěšně dohledat
            handleSort(columnKey); // Spustí metodu pro změnu konfigurace řazení podle tohoto klíče
        } // Konec kontroly columnKey
    }; // Konec definice handleTableClick


    return ( // Vrací výsledné JSX struktury k vykreslení
        <div // Obalový kontejner tabulky
            className="table-responsive" // Vytvoří obalový prvek pro tabulku s podporou horizontálního posouvání
            onClick={handleTableClick} // Deleguje zachycení události click na celý obal tabulky
        > {/* Konec úvodního div tagu */}
            <BaseTable // Vykreslí dříve importovanou základní tabulkovou komponentu
                data={sortedData} // Předává se seřazená data do základní tabulky
                table_def={customTableDef} // Předá nakonfigurovanou definici sloupců a vlastních buněk
            /> {/* Konec BaseTable */}
        </div> // Konec obalového divu
    ); // Konec returnu
}; // Konec definice komponenty Table