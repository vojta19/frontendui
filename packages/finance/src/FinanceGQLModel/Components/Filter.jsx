import { useState, useCallback, useMemo, useEffect } from "react" // React hooks pro state, callbacks a efekty
import { Filter as BaseFilter, useFilterDesigner } from "../../../../_template/src/Base/FormControls/Filter" // základní filtr komponenta a hook pro filtr kontext
import { Row } from "../../../../_template/src/Base/Components/Row" // komponenta pro řádek v layoutu
import { Col } from "../../../../_template/src/Base/Components/Col" // komponenta pro sloupec v layoutu
import { SimpleCardCapsule } from "../../../../_template/src/Base/Components/CardCapsule" // jednoduchá karta pro obalení filtru

// regex pro validaci UUID formátu
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// pomocná funkce pro porovnání textu s diakritikou - normalizuje oba řetězce a porovnává
const matchText = (itemText, searchInput) => {
    if (!itemText) return false // pokud je text prázdný, není shoda
    // normalizuje text položky odstraněním diakritiky
    const normalizedItem = itemText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    // normalizuje hledaný řetězec stejně
    const normalizedSearch = searchInput
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    // vrací true pokud normalizovaný text začíná normalizovaným hledaným řetězcem
    return normalizedItem.startsWith(normalizedSearch)
}

/**
 * A specialized filter component for UUID/ID field filtering.
 *
 * Allows users to search and filter by ID with suggestions from provided data.
 * Validates UUID format and submits only valid IDs to the parent filter.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The field identifier.
 * @param {string} [props.label] - Display label for the filter field.
 * @param {string[]} [props.suggestions] - Array of UUID suggestions.
 *
 * @returns {JSX.Element} A card-wrapped filter input with UUID validation.
 */
export const CustomUUIDFilter = ({ id, label, suggestions = [] }) => { // filtr pro ID/UUID s validací
    // získá kontext filtru ze sousední komponenty <BaseFilter>
    const filterContext = useFilterDesigner()
    if (!filterContext) throw Error("<CustomUUIDFilter /> must be placed inside <Filter />") // vyhodí chybu pokud není v kontextu

    // lokální state pro text v políčku
    const [text, setText] = useState("")

    // memoizované filtrované návrhy ID - vrací jen ty, které obsahují zadaný text
    const filteredIDSuggestions = useMemo(() => {
        const v = text.trim() // odtrhne mezery
        if (!v) return suggestions // vrací všechny návrhy pokud je políčko prázdné
        // filtruje návrhy podle malých písmen
        return suggestions.filter((s) => s.toLowerCase().includes(v.toLowerCase()))
    }, [text, suggestions])

    // callback pro odeslání filtru - validuje UUID a odesílá do kontextu
    const submitFilter = useCallback(
        (currentText) => {
            const v = currentText.trim() // odtrhne mezery

            if (!v) {
                // pokud je políčko prázdné, vynuluje filtr
                filterContext.handleChange({ target: { id, value: null } })
                return
            }

            // pokud je to validní UUID, odesílá ho
            if (UUID_RE.test(v)) {
                filterContext.handleChange({ target: { id, value: [{ [id]: { _eq: v } }] } })
                return
            }

            // hledá přesnou shodu v seznamu návrhů
            const exactMatch = suggestions.find((s) => s.endsWith(v) || s.includes(v))
            if (exactMatch) {
                // pokud je shoda, odesílá ji
                filterContext.handleChange({ target: { id, value: [{ [id]: { _eq: exactMatch } }] } })
            } else {
                // pokud není shoda, vynuluje filtr aby se neposílalo nevalidní data
                filterContext.handleChange({ target: { id, value: null } })
            }
        },
        [id, filterContext, suggestions]
    )

    // callback pro změnu textu v políčku
    const handleChangeText = useCallback(
        (e) => {
            const next = e.target.value // získá novou hodnotu
            setText(next) // aktualizuje state

            // pokud uživatel políčko vymaže, ihned vynuluje filtr
            if (!next.trim()) {
                filterContext.handleChange({ target: { id, value: null } })
            }
        },
        [id, filterContext]
    )

    // callback pro odeslání při opuštění políčka
    const handleBlur = useCallback(() => {
        submitFilter(text) // zavolá submitFilter s aktuálním textem
    }, [text, submitFilter])

    // efekt - sleduje, jestli uživatel vybral UUID z datalistu
    useEffect(() => {
        if (UUID_RE.test(text.trim())) {
            // pokud je text validní UUID, ihned ho odešle
            submitFilter(text)
        }
    }, [text, submitFilter])

    return (
        <SimpleCardCapsule title={label || id}> {/* obalí filtr do karty s titulkem */}
            <Row> {/* vytvořít řádek */}
                <Col> {/* vytvořit sloupec */}
                    <input
                        className="form-control" // Bootstrap CSS třída
                        value={text} // vazba na state
                        onChange={handleChangeText} // handler pro změnu textu
                        onBlur={handleBlur} // handler pro opuštění políčka - odešle filtr
                        placeholder="Vložte ID..." // placeholder text
                        autoComplete="off" // vypne autocompletion
                        list="id-suggestions" // vazba na datalist
                    />
                    <datalist id="id-suggestions">
                        {/* renderuje prvních 10 filtrovaných návrhů */}
                        {filteredIDSuggestions.slice(0, 10).map((val, index) => (
                            <option key={index} value={val} /> // vytváří option elementy
                        ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    )
}

/**
 * A specialized filter component for string/name field filtering.
 *
 * Allows users to search and filter by name with case-insensitive matching.
 * Uses normalized text comparison to handle diacritical marks.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The field identifier.
 * @param {string} [props.label] - Display label for the filter field.
 * @param {string[]} [props.suggestions] - Array of name suggestions.
 *
 * @returns {JSX.Element} A card-wrapped filter input with text matching.
 */
export const CustomStringFilter = ({ id, label, suggestions = [] }) => { // filtr pro text/název
    // získá kontext filtru
    const filterContext = useFilterDesigner()
    if (!filterContext) throw Error("<CustomStringFilter /> must be placed inside <Filter />") // vyhodí chybu pokud není v kontextu

    // lokální state pro text v políčku
    const [text, setText] = useState("")

    // memoizované filtrované návrhy - používá matchText pro normalizované porovnání
    const filteredNameSuggestions = useMemo(() => {
        const v = text.trim() // odtrhne mezery
        if (!v) return suggestions // vrací všechny návrhy pokud je políčko prázdné
        // filtruje pomocí matchText které normalizuje diakritiku
        return suggestions.filter((name) => matchText(name, v))
    }, [text, suggestions])

    // callback pro odeslání filtru - používá like operátor pro částečné shody
    const submitFilter = useCallback(
        (currentText) => {
            if (!currentText.trim()) {
                // pokud je políčko prázdné, vynuluje filtr
                filterContext.handleChange({ target: { id, value: null } })
                return
            }
            // přidá znaky % pro SQL LIKE hledání (case-insensitive)
            const v = currentText.includes("%") ? currentText : `%${currentText}%`
            // odesílá filtr s _ilike operátorem pro case-insensitive porovnání
            filterContext.handleChange({ target: { id, value: [{ [id]: { _ilike: v } }] } })
        },
        [id, filterContext]
    )

    // callback pro změnu textu v políčku
    const handleChangeText = useCallback(
        (e) => {
            const next = e.target.value // získá novou hodnotu
            setText(next) // aktualizuje state
            if (!next.trim()) {
                // pokud uživatel políčko vymaže, ihned vynuluje filtr
                filterContext.handleChange({ target: { id, value: null } })
            }
        },
        [id, filterContext]
    )

    // callback pro odeslání při opuštění políčka
    const handleBlur = useCallback(() => {
        submitFilter(text) // zavolá submitFilter s aktuálním textem
    }, [text, submitFilter])

    return (
        <SimpleCardCapsule title={label || id}> {/* obalí filtr do karty s titulkem */}
            <Row> {/* vytvořit řádek */}
                <Col> {/* vytvořit sloupec */}
                    <input
                        className="form-control" // Bootstrap CSS třída
                        value={text} // vazba na state
                        onChange={handleChangeText} // handler pro změnu textu
                        onBlur={handleBlur} // handler pro opuštění políčka - odešle filtr
                        placeholder="Začněte psát název..." // placeholder text
                        autoComplete="off" // vypne autocompletion
                        list="name-suggestions" // vazba na datalist
                    />
                    <datalist id="name-suggestions">
                        {/* renderuje prvních 10 filtrovaných návrhů */}
                        {filteredNameSuggestions.slice(0, 10).map((val, index) => (
                            <option key={index} value={val} /> // vytváří option elementy
                        ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    )
}

/**
 * Main filter component for FinanceGQLModel.
 *
 * Combines CustomUUIDFilter and CustomStringFilter to provide complete filtering
 * capabilities for finance data. Extracts unique suggestions from the data.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The filter context identifier.
 * @param {Object[]} [props.data] - Array of data items to extract suggestions from.
 * @param {Function} [props.onChange] - Callback when filter changes.
 * @param {React.ReactNode} [props.children] - Additional filter components.
 *
 * @returns {JSX.Element} A complete filter form with ID and name fields.
 */
export const Filter = ({ id, data = [], onChange: handleChange, children }) => { // hlavní filtr komponenta
    // fallback na prázdné pole pokud data nejsou poskytnutá
    const actualData = data || []

    // memoizované návrhy ID - extrahuje unikátní ID ze všech položek
    const idSuggestions = useMemo(
        () => [...new Set(actualData.map((item) => item?.id).filter(Boolean))], // vytvoří Set pro unikátní hodnoty a převede na pole
        [actualData]
    )

    // memoizované návrhy jmen - extrahuje unikátní jména ze všech položek
    const nameSuggestions = useMemo(
        () => [...new Set(actualData.map((item) => item?.name).filter(Boolean))], // vytvoří Set pro unikátní hodnoty a převede na pole
        [actualData]
    )

    return (
        <BaseFilter id={id} onChange={handleChange} label="FinanceGQLModel"> {/* obalí do BaseFilter s identifikátorem */}
            <CustomUUIDFilter id="id" label="ID" suggestions={idSuggestions} /> {/* přidá UUID filtr */}
            <CustomStringFilter id="name" label="Název" suggestions={nameSuggestions} /> {/* přidá string filtr */}
            {children} {/* renderuje další potomky */}
        </BaseFilter>
    )
}
