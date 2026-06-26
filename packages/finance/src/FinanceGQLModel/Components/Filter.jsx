import { useState, useCallback, useMemo, useEffect } from "react";
import { Filter as BaseFilter, useFilterDesigner } from "../../../../_template/src/Base/FormControls/Filter";
import { Row } from "../../../../_template/src/Base/Components/Row";
import { Col } from "../../../../_template/src/Base/Components/Col";
import { SimpleCardCapsule } from "../../../../_template/src/Base/Components/CardCapsule";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const matchText = (itemText, searchInput) => {
    if (!itemText) return false;
    const normalizedItem = itemText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedSearch = searchInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedItem.startsWith(normalizedSearch);
};

// 1. FILTR PRO ID (Odesílá se až kompletní nebo spárované ID)
export const CustomUUIDFilter = ({ id, label, suggestions = [] }) => {
    const filterContext = useFilterDesigner();
    if (!filterContext) throw Error("<CustomUUIDFilter /> must be placed inside <Filter />");

    const [text, setText] = useState("");

    const filteredIDSuggestions = useMemo(() => {
        const v = text.trim();
        if (!v) return suggestions;
        return suggestions.filter(s => s.toLowerCase().includes(v.toLowerCase()));
    }, [text, suggestions]);

    // Tato funkce provede reálné odeslání do nadřazeného filtru
    const submitFilter = useCallback((currentText) => {
        const v = currentText.trim();

        if (!v) {
            filterContext.handleChange({ target: { id, value: null } });
            return;
        }

        // Pokud je to celé validní UUID, pošleme ho
        if (UUID_RE.test(v)) {
            filterContext.handleChange({ target: { id, value: [{ [id]: { _eq: v } }] } });
            return;
        }

        // Pokud je to jen kus, zkusíme najít shodu v seznamu
        const exactMatch = suggestions.find(s => s.endsWith(v) || s.includes(v));
        if (exactMatch) {
            filterContext.handleChange({ target: { id, value: [{ [id]: { _eq: exactMatch } }] } });
        } else {
            // Pokud nic nesouhlasí, raději filtr vymažeme, ať backend nezkolabuje
            filterContext.handleChange({ target: { id, value: null } });
        }
    }, [id, filterContext, suggestions]);

    const handleChangeText = useCallback((e) => {
        const next = e.target.value;
        setText(next);

        // Pokud uživatel políčko úplně vymaže, ihned resetujeme filtr
        if (!next.trim()) {
            filterContext.handleChange({ target: { id, value: null } });
        }
    }, [id, filterContext]);

    // Jakmile uživatel klikne mimo políčko nebo stiskne Enter (při odeslání formuláře tlačítkem), 
    // zkontrolujeme a odešleme hodnotu
    const handleBlur = useCallback(() => {
        submitFilter(text);
    }, [text, submitFilter]);

    // Sledujeme, jestli uživatel nevybral hodnotu přímo z datalistu (zpravidla vyvolá změnu s celým UUID)
    useEffect(() => {
        if (UUID_RE.test(text.trim())) {
            submitFilter(text);
        }
    }, [text, submitFilter]);

    return (
        <SimpleCardCapsule title={label || id}>
            <Row>
                <Col>
                    <input
                        className="form-control"
                        value={text}
                        onChange={handleChangeText}
                        onBlur={handleBlur} // Odeslání při opuštění políčka
                        placeholder="Vložte ID..."
                        autoComplete="off"
                        list="id-suggestions"
                    />
                    <datalist id="id-suggestions">
                        {filteredIDSuggestions.slice(0, 10).map((val, index) => (
                            <option key={index} value={val} />
                        ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    );
};

// 2. FILTR PRO NÁZEV
export const CustomStringFilter = ({ id, label, suggestions = [] }) => {
    const filterContext = useFilterDesigner();
    if (!filterContext) throw Error("<CustomStringFilter /> must be placed inside <Filter />");

    const [text, setText] = useState("");

    const filteredNameSuggestions = useMemo(() => {
        const v = text.trim();
        if (!v) return suggestions;
        return suggestions.filter(name => matchText(name, v));
    }, [text, suggestions]);

    const submitFilter = useCallback((currentText) => {
        if (!currentText.trim()) {
            filterContext.handleChange({ target: { id, value: null } });
            return;
        }
        const v = currentText.includes("%") ? currentText : `%${currentText}%`;
        filterContext.handleChange({ target: { id, value: [{ [id]: { _ilike: v } }] } });
    }, [id, filterContext]);

    const handleChangeText = useCallback((e) => {
        const next = e.target.value;
        setText(next);
        if (!next.trim()) {
            filterContext.handleChange({ target: { id, value: null } });
        }
    }, [id, filterContext]);

    const handleBlur = useCallback(() => {
        submitFilter(text);
    }, [text, submitFilter]);

    return (
        <SimpleCardCapsule title={label || id}>
            <Row>
                <Col>
                    <input 
                        className="form-control" 
                        value={text} 
                        onChange={handleChangeText} 
                        onBlur={handleBlur} // Odeslání při opuštění políčka
                        placeholder="Začněte psát název..." 
                        autoComplete="off"
                        list="name-suggestions"
                    />
                    <datalist id="name-suggestions">
                        {filteredNameSuggestions.slice(0, 10).map((val, index) => (
                            <option key={index} value={val} />
                        ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    );
};

// HLAVNÍ EXPORT KOMPONENTY
export const Filter = ({ id, data = [], onChange: handleChange, children }) => {
    const actualData = data || [];

    const idSuggestions = useMemo(() => [...new Set(actualData.map(item => item?.id).filter(Boolean))], [actualData]);
    const nameSuggestions = useMemo(() => [...new Set(actualData.map(item => item?.name).filter(Boolean))], [actualData]);

    return (
        <BaseFilter id={id} onChange={handleChange} label="FinanceGQLModel">
            <CustomUUIDFilter id="id" label="ID" suggestions={idSuggestions} />
            <CustomStringFilter id="name" label="Název" suggestions={nameSuggestions} />
            {children}
        </BaseFilter>
    );
};