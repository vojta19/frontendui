import {
    useCallback, // Importuje hook pro memoizaci callback funkcí
    useEffect, // Importuje hook pro spouštění vedlejších účinků (side effects)
    useMemo, // Importuje hook pro memoizaci výpočetně náročných hodnot
    useState // Importuje hook pro správu lokálního stavu v komponentě
} from "react"; // Hlavní knihovna React

import {
    Filter as BaseFilter, // Importuje základní komponentu Filter pod aliasem BaseFilter
    useFilterDesigner // Importuje hook pro přístup k návrháři/kontextu filtrů
} from "../../../../_template/src/Base/FormControls/Filter"; // Relativní cesta k šabloně filtru

import { Row } from "../../../../_template/src/Base/Components/Row"; // Importuje řádkovou komponentu pro layout
import { Col } from "../../../../_template/src/Base/Components/Col"; // Importuje sloupcovou komponentu pro layout

import {
    SimpleCardCapsule // Importuje komponentu pro vizuální obalení prvků (kartu)
} from "../../../../_template/src/Base/Components/CardCapsule"; // Relativní cesta ke komponentě karty


/**
 * Regular expression used to validate UUID version 1–5 identifiers.
 *
 * @constant
 * @type {RegExp}
 */
// Definice regulárního výrazu pro validaci UUID v1-5 s ignorováním velikosti písmen
const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


/**
 * Normalizes a text value for case-insensitive and accent-insensitive
 * comparison.
 *
 * @param {string} value
 * Text value to normalize.
 *
 * @returns {string}
 * Lowercase text without diacritical marks.
 */
const normalizeText = (value) => {
    // Převede vstup na řetězec, na malá písmena, rozloží diakritiku a odstraní ji
    return String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};


/**
 * Determines whether a text value begins with the provided search input.
 *
 * Comparison is case-insensitive and ignores diacritical marks.
 *
 * @param {string} itemText
 * Text value from a finance entity.
 *
 * @param {string} searchInput
 * Search expression entered by the user.
 *
 * @returns {boolean}
 * Returns `true` when the normalized item text starts with the normalized
 * search input.
 *
 * @example
 * matchText("Rozpočet WP2", "rozpocet");
 */
const matchText = (itemText, searchInput) => {
    // Pokud je text položky prázdný nebo neexistuje, vrátí false
    if (!itemText) {
        return false;
    }

    // Znormalizuje text položky (převede na malá písmena a odstraní diakritiku)
    const normalizedItem = normalizeText(itemText);
    // Znormalizuje vyhledávaný řetězec zadaný uživatelem
    const normalizedSearch = normalizeText(searchInput);

    // Vrátí true, pokud znormalizovaný text začíná znormalizovaným hledaným slovem
    return normalizedItem.startsWith(normalizedSearch);
};


/**
 * Provides filtering functionality for finance UUID identifiers.
 *
 * The component accepts either a complete UUID or a partial identifier.
 * Partial identifiers are matched against the available suggestions.
 * Once a valid identifier is resolved, the shared filter context is updated
 * using the GraphQL `_eq` operator.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} props.id
 * Name of the filtered GraphQL field.
 *
 * @param {string} [props.label]
 * Label displayed above the filter input.
 *
 * @param {string[]} [props.suggestions=[]]
 * Available UUID values used for autocomplete.
 *
 * @returns {JSX.Element}
 * UUID filter input with autocomplete suggestions.
 */
export const CustomUUIDFilter = ({
    id, // Identifikátor filtrovaného pole (prop)
    label, // Textový popisek filtru (prop)
    suggestions = [] // Pole doporučených UUID pro našeptávání s výchozím prázdným polem (prop)
}) => { // Začátek komponenty CustomUUIDFilter
    // Získá sdílený kontext filtru z nadřazené komponenty
    const filterContext = useFilterDesigner();

    // Pokud komponenta není umístěna uvnitř Filter provideru, vyhodí vývojářskou chybu
    if (!filterContext) {
        throw new Error(
            "<CustomUUIDFilter /> must be placed inside <Filter />"
        );
    }

    // Inicializuje stav pro sledování textu v inputu s výchozí prázdnou hodnotou
    const [text, setText] = useState("");

    // Vytvoří memoizovaný seznam vyfiltrovaných návrhů UUID
    const filteredIDSuggestions = useMemo(() => {
        // Ořízne mezery a převede text z inputu na malá písmena
        const searchValue = text.trim().toLowerCase();

        // Pokud je vyhledávací pole prázdné, vrátí všechny původní návrhy bez filtrování
        if (!searchValue) {
            return suggestions;
        }

        // Filtruje návrhy podle toho, zda obsahují zadaný podřetězec
        return suggestions.filter((suggestion) =>
            suggestion
                .toLowerCase()
                .includes(searchValue)
        );
    }, [text, suggestions]); // Přepočítá se pouze při změně zadaného textu nebo seznamu návrhů


    /**
    * Clears the currently applied UUID filter.
    *
    * @returns {void}
    */
    // Callback pro vymazání filtru (nastaví hodnotu v kontextu na null)
    const clearFilter = useCallback(() => {
        filterContext.handleChange({
            target: {
                id, // Předá ID filtrovaného pole
                value: null // Nastaví hodnotu filtru na null (vypnuto)
            }
        });
    }, [filterContext, id]); // Závislosti callbacku pro vymazání filtru


    /**
    * Applies a complete UUID value to the shared filter context.
    *
    * @param {string} uuid
    * Complete UUID used for filtering.
    *
    * @returns {void}
    */
    // Callback pro aplikování kompletního UUID do GraphQL filtru (využívá operátor _eq)
    const applyUUIDFilter = useCallback((uuid) => {
        filterContext.handleChange({
            target: {
                id, // Předá ID filtrovaného pole
                value: [
                    {
                        [id]: {
                            _eq: uuid // Použije GraphQL operátor rovnosti (_eq) s hodnotou UUID
                        }
                    }
                ]
            }
        });
    }, [filterContext, id]); // Závislosti callbacku pro aplikování UUID filtru


    /**
    * Resolves the current input value and applies the UUID filter.
    *
    * Complete UUID values are submitted directly. Partial identifiers are
    * matched against the available suggestions and the first matching UUID
    * is used.
    *
    * @param {string} currentText
    * Current value of the UUID input.
    *
    * @returns {void}
    */
    // Callback pro odeslání a vyhodnocení zapsaného textu jako filtru
    const submitFilter = useCallback((currentText) => {
        // Odstraní úvodní a koncové mezery
        const value = currentText.trim();

        // Pokud je hodnota prázdná, vymaže aktivní filtr
        if (!value) {
            clearFilter();
            return;
        }

        // Pokud hodnota odpovídá plnému formátu UUID, ihned ji aplikuje
        if (UUID_RE.test(value)) {
            applyUUIDFilter(value);
            return;
        }

        // Převede hodnotu na malá písmena pro case-insensitive vyhledávání
        const normalizedValue = value.toLowerCase();

        // Pokusí se najít shodu v suggestions (buď konec řetězce nebo výskyt kdekoli uvnitř)
        const exactMatch = suggestions.find((suggestion) => {
            const normalizedSuggestion =
                suggestion.toLowerCase();

            return (
                normalizedSuggestion.endsWith(
                    normalizedValue
                ) ||
                normalizedSuggestion.includes(
                    normalizedValue
                )
            );
        });

        // Pokud byl nalezen odpovídající záznam, aplikuje jeho plné UUID
        if (exactMatch) {
            applyUUIDFilter(exactMatch);
            return;
        }

        // Pokud se nic nenašlo a není to validní UUID, filtr se vyčistí
        clearFilter();
    }, [
        applyUUIDFilter,
        clearFilter,
        suggestions
    ]); // Konec pole závislostí callbacku submitFilter


    /**
    * Updates the UUID input value.
    *
    * The active filter is cleared immediately when the input becomes empty.
    *
    * @param {*} event
    * Input change event.
    *
    * @returns {void}
    */
    // Callback reagující na změnu textu v inputu
    const handleChangeText = useCallback((event) => {
        // Získá novou hodnotu z elementu inputu
        const nextValue = event.target.value;

        // Uloží aktuální hodnotu do lokálního stavu
        setText(nextValue);

        // Pokud uživatel smazal text, okamžitě zruší aktivní filtr v kontextu
        if (!nextValue.trim()) {
            clearFilter();
        }
    }, [clearFilter]); // Závislosti callbacku pro změnu textu


    /**
    * Applies the current UUID filter when the input loses focus.
    *
    * @returns {void}
    */
    // Callback spouštěný při opuštění inputu (onBlur) – vyhodnotí a aplikuje filtr
    const handleBlur = useCallback(() => {
        submitFilter(text);
    }, [submitFilter, text]); // Závislosti callbacku handleBlur


    // Efekt, který automaticky aplikuje filtr, jakmile uživatel dopíše kompletní validní UUID
    useEffect(() => {
        const value = text.trim();

        if (UUID_RE.test(value)) {
            applyUUIDFilter(value);
        }
    }, [applyUUIDFilter, text]); // Spustí se při změně callbacku pro aplikování nebo změně textu


    // Vrací JSX strukturu komponenty
    return (
        <SimpleCardCapsule title={label || id}> {/* Zabalí input do karty s titulkem (label nebo id) */}
            <Row> {/* Vykreslí kontejnerový řádek */}
                <Col> {/* Vykreslí sloupec pro rozvržení */}
                    <input // Vykreslí samotné textové vstupní pole
                        className="form-control" // Bootstrap třída pro stylování
                        value={text} // Propojí hodnotu inputu s lokálním stavem text
                        onChange={handleChangeText} // Přiřadí callback pro změnu hodnoty
                        onBlur={handleBlur} // Přiřadí callback pro ztrátu fokusu (focus out)
                        placeholder="Vložte ID nebo jeho část..." // Zobrazí nápovědu, pokud je pole prázdné
                        autoComplete="off" // Zakáže automatické doplňování prohlížeče
                        list={`${id}-suggestions`} // Propojí vstup se seznamem datalistu níže
                    />

                    <datalist id={`${id}-suggestions`}> {/* Vykreslí seznam možností pro našeptávač */}
                        {filteredIDSuggestions // Projde vyfiltrované návrhy UUID
                            .slice(0, 10) // Omezí počet zobrazených návrhů na maximálně 10
                            .map((value) => ( // Převede každý návrh na element <option>
                                <option
                                    key={value} // Nastaví unikátní React klíč pro optimální vykreslování
                                    value={value} // Nastaví hodnotu možnosti
                                />
                            ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    );
};


/**
 * Provides case-insensitive filtering for finance names.
 *
 * The component uses the GraphQL `_ilike` operator and displays
 * autocomplete suggestions based on the available finance names.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} props.id
 * Name of the filtered GraphQL field.
 *
 * @param {string} [props.label]
 * Label displayed above the filter input.
 *
 * @param {string[]} [props.suggestions=[]]
 * Available finance names used for autocomplete.
 *
 * @returns {JSX.Element}
 * Text filter input with autocomplete suggestions.
 */
export const CustomStringFilter = ({
    id, // Identifikátor filtrovaného pole (prop)
    label, // Textový popisek filtru (prop)
    suggestions = [] // Pole doporučených názvů pro našeptávání (prop)
}) => { // Začátek komponenty CustomStringFilter
    // Získá sdílený kontext filtru z nadřazené komponenty
    const filterContext = useFilterDesigner();

    // Pokud komponenta není umístěna uvnitř Filter provideru, vyhodí vývojářskou chybu
    if (!filterContext) {
        throw new Error(
            "<CustomStringFilter /> must be placed inside <Filter />"
        );
    }

    // Stav pro uchování zapsaného textu filtru názvu
    const [text, setText] = useState("");

    // Memoizované filtrování návrhů pro názvy
    const filteredNameSuggestions = useMemo(() => {
        const searchValue = text.trim();

        // Pokud je pole prázdné, vrátí kompletní seznam návrhů
        if (!searchValue) {
            return suggestions;
        }

        // Vyfiltruje návrhy, které odpovídají hledanému výrazu (bez ohledu na velikost písma a diakritiku)
        return suggestions.filter((name) =>
            matchText(name, searchValue)
        );
    }, [text, suggestions]); // Přepočítá se pouze při změně zadaného textu nebo seznamu návrhů


    /**
    * Clears the currently applied text filter.
    *
    * @returns {void}
    */
    // Callback pro zrušení aktivního filtru názvu v kontextu
    const clearFilter = useCallback(() => {
        filterContext.handleChange({
            target: {
                id, // Předá ID filtrovaného pole
                value: null // Nastaví hodnotu na null
            }
        });
    }, [filterContext, id]); // Závislosti callbacku pro vymazání filtru


    /**
    * Applies the current text value using the GraphQL `_ilike` operator.
    *
    * Wildcard characters are added automatically unless already provided.
    *
    * @param {string} currentText
    * Current value of the text input.
    *
    * @returns {void}
    */
    // Callback pro odeslání a aplikování textového filtru do GraphQL
    const submitFilter = useCallback((currentText) => {
        const trimmedValue = currentText.trim();

        // Pokud je input prázdný, zruší aktivní filtr
        if (!trimmedValue) {
            clearFilter();
            return;
        }

        // Pokud hodnota již obsahuje znak %, použije ji přímo, jinak ji obalí do % pro vyhledávání podslov
        const filterValue = trimmedValue.includes("%")
            ? trimmedValue
            : `%${trimmedValue}%`;

        // Aplikuje filtr do kontextu s využitím GraphQL operátoru _ilike (case-insensitive vyhledávání)
        filterContext.handleChange({
            target: {
                id, // Předá ID filtrovaného pole
                value: [
                    {
                        [id]: {
                            _ilike: filterValue // Nastaví operátor _ilike s vygenerovanou hodnotou
                        }
                    }
                ]
            }
        });
    }, [
        clearFilter,
        filterContext,
        id
    ]); // Konec závislostí callbacku submitFilter


    /**
    * Updates the text input value.
    *
    * The active filter is cleared immediately when the input becomes empty.
    *
    * @param {*} event
    * Input change event.
    *
    * @returns {void}
    */
    // Callback pro zpracování změn v textovém inputu
    const handleChangeText = useCallback((event) => {
        const nextValue = event.target.value;

        // Nastaví novou hodnotu do lokálního stavu
        setText(nextValue);

        // Pokud uživatel text smazal, okamžitě vymaže filtr v kontextu
        if (!nextValue.trim()) {
            clearFilter();
        }
    }, [clearFilter]); // Závislosti callbacku pro změnu textu


    /**
    * Applies the current text filter when the input loses focus.
    *
    * @returns {void}
    */
    // Callback spouštěný při opuštění inputu názvu
    const handleBlur = useCallback(() => {
        submitFilter(text);
    }, [submitFilter, text]); // Závislosti callbacku handleBlur


    // Vykreslení obalové komponenty a samotného textového inputu s našeptávačem názvů
    return (
        <SimpleCardCapsule title={label || id}> {/* Zabalí input do karty s titulkem */}
            <Row> {/* Vykreslí kontejnerový řádek */}
                <Col> {/* Vykreslí sloupec pro rozvržení */}
                    <input // Vykreslí textové vstupní pole
                        className="form-control" // Bootstrap třída pro stylování
                        value={text} // Propojí hodnotu inputu s lokálním stavem text
                        onChange={handleChangeText} // Přiřadí callback pro změnu hodnoty
                        onBlur={handleBlur} // Přiřadí callback pro ztrátu fokusu (focus out)
                        placeholder="Začněte psát název..." // Zobrazí nápovědu, pokud je pole prázdné
                        autoComplete="off" // Zakáže automatické doplňování prohlížeče
                        list={`${id}-suggestions`} // Propojí vstup se seznamem datalistu níže
                    />

                    <datalist id={`${id}-suggestions`}> {/* Vykreslí seznam možností pro našeptávač */}
                        {filteredNameSuggestions // Projde vyfiltrované návrhy názvů
                            .slice(0, 10) // Omezí počet zobrazených návrhů na maximálně 10
                            .map((value) => ( // Převede každý návrh na element <option>
                                <option
                                    key={value} // Nastaví unikátní React klíč
                                    value={value} // Nastaví hodnotu možnosti
                                />
                            ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    );
};


/**
 * Provides the primary filtering interface for finance entities.
 *
 * The component combines UUID and name filtering into a single filter
 * form. Suggestions are automatically extracted from the supplied data.
 *
 * Additional custom filter controls can be rendered through `children`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} props.id
 * Identifier of the filter context.
 *
 * @param {Object[]} [props.data=[]]
 * Finance entities used to build autocomplete suggestions.
 *
 * @param {Function} [props.onChange]
 * Callback invoked whenever the composed filter changes.
 *
 * @param {*} [props.children]
 * Optional additional filter components.
 *
 * @returns {JSX.Element}
 * Complete filtering interface for finance entities.
 *
 * @example
 * <Filter
 *     id="finance-filter"
 *     data={finances}
 * />
 */
export const Filter = ({
    id, // Identifikátor kontextu filtru (prop)
    data = [], // Zdrojová data pro sestavení našeptávačů (prop)
    onChange: handleChange, // Callback vyvolaný při změně filtru (prop s přejmenováním na handleChange)
    children // Volitelné dceřiné komponenty (prop)
}) => { // Začátek komponenty Filter
    // Zajistí, že data jsou vždy pole (pokud ne, dosadí prázdné pole)
    const actualData = Array.isArray(data)
        ? data
        : [];

    // Memoizuje unikátní seznam ID ze všech předaných dat pro našeptávač UUID filtru
    const idSuggestions = useMemo(() => {
        return [
            ...new Set( // Využije Set pro eliminaci duplicitních ID
                actualData
                    .map((item) => item?.id) // Vytáhne ID z každého objektu
                    .filter(Boolean) // Odstraní null/undefined/prázdné hodnoty
            )
        ];
    }, [actualData]); // Přepočítá se pouze při změně actualData

    // Memoizuje unikátní seznam názvů ze všech předaných dat pro našeptávač textového filtru
    const nameSuggestions = useMemo(() => {
        return [
            ...new Set( // Využije Set pro eliminaci duplicitních názvů
                actualData
                    .map((item) => item?.name) // Vytáhne název (name) z každého objektu
                    .filter(Boolean) // Odstraní null/undefined/prázdné hodnoty
            )
        ];
    }, [actualData]); // Přepočítá se pouze při změně actualData

    // Vykreslí hlavní obalovací komponentu BaseFilter obsahující filtry pro ID, Název a další children
    return (
        <BaseFilter
            id={id} // Předá ID filtru
            onChange={handleChange} // Předá callback pro zpracování změn
            label="FinanceGQLModel" // Nastaví výchozí typ modelu
        >
            <CustomUUIDFilter
                id="id" // Nastaví filtrování na klíč "id"
                label="ID" // Nastaví český popisek filtru
                suggestions={idSuggestions} // Předá vygenerované návrhy ID
            />

            <CustomStringFilter
                id="name" // Nastaví filtrování na klíč "name"
                label="Název" // Nastaví český popisek filtru
                suggestions={nameSuggestions} // Předá vygenerované návrhy názvů
            />

            {children} {/* Vykreslí doplňkové filtry předané jako dceřiné prvky */}
        </BaseFilter>
    );
};