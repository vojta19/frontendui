import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Filter as BaseFilter,
    useFilterDesigner
} from "../../../../_template/src/Base/FormControls/Filter";

import { Row } from "../../../../_template/src/Base/Components/Row";
import { Col } from "../../../../_template/src/Base/Components/Col";

import {
    SimpleCardCapsule
} from "../../../../_template/src/Base/Components/CardCapsule";


/**
 * Regular expression used to validate UUID version 1–5 identifiers.
 *
 * @constant
 * @type {RegExp}
 */
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
 * `true` when the normalized item text starts with the normalized search
 * input; otherwise `false`.
 *
 * @example
 * matchText("Rozpočet WP2", "rozpocet");
 *
 * // Returns: true
 */
const matchText = (itemText, searchInput) => {
    if (!itemText) {
        return false;
    }

    const normalizedItem = normalizeText(itemText);
    const normalizedSearch = normalizeText(searchInput);

    return normalizedItem.startsWith(normalizedSearch);
};


/**
 * Provides filtering functionality for finance UUID identifiers.
 *
 * The component accepts either a complete UUID or a partial identifier.
 * Partial identifiers are matched against the available suggestions.
 * Once a valid identifier is resolved, the component updates the shared
 * filter context using the GraphQL `_eq` operator.
 *
 * The component must be rendered inside `BaseFilter`, because it relies on
 * the context provided by `useFilterDesigner`.
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
 * Available UUID values used for autocomplete and partial matching.
 *
 * @returns {JSX.Element}
 * UUID filter input with autocomplete suggestions.
 *
 * @example
 * <CustomUUIDFilter
 *     id="id"
 *     label="ID"
 *     suggestions={financeIds}
 * />
 */
export const CustomUUIDFilter = ({
    id,
    label,
    suggestions = []
}) => {
    const filterContext = useFilterDesigner();

    if (!filterContext) {
        throw new Error(
            "<CustomUUIDFilter /> must be placed inside <Filter />"
        );
    }

    const [text, setText] = useState("");

    const filteredIDSuggestions = useMemo(() => {
        const searchValue = text.trim().toLowerCase();

        if (!searchValue) {
            return suggestions;
        }

        return suggestions.filter((suggestion) =>
            suggestion
                .toLowerCase()
                .includes(searchValue)
        );
    }, [text, suggestions]);


    /**
     * Clears the current UUID filter.
     *
     * @returns {void}
     */
    const clearFilter = useCallback(() => {
        filterContext.handleChange({
            target: {
                id,
                value: null
            }
        });
    }, [filterContext, id]);


    /**
     * Applies a complete UUID value to the shared filter context.
     *
     * @param {string} uuid
     * Complete UUID used for filtering.
     *
     * @returns {void}
     */
    const applyUUIDFilter = useCallback((uuid) => {
        filterContext.handleChange({
            target: {
                id,
                value: [
                    {
                        [id]: {
                            _eq: uuid
                        }
                    }
                ]
            }
        });
    }, [filterContext, id]);


    /**
     * Resolves the current input value and submits the UUID filter.
     *
     * Complete UUID values are submitted directly. Partial identifiers are
     * compared with the suggestion list. The first matching suggestion is
     * used as the complete filter value.
     *
     * @param {string} currentText
     * Current value of the UUID input.
     *
     * @returns {void}
     */
    const submitFilter = useCallback((currentText) => {
        const value = currentText.trim();

        if (!value) {
            clearFilter();
            return;
        }

        if (UUID_RE.test(value)) {
            applyUUIDFilter(value);
            return;
        }

        const normalizedValue = value.toLowerCase();

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

        if (exactMatch) {
            applyUUIDFilter(exactMatch);
            return;
        }

        clearFilter();
    }, [
        applyUUIDFilter,
        clearFilter,
        suggestions
    ]);


    /**
     * Updates the UUID input state.
     *
     * The active filter is cleared immediately when the input becomes empty.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event
     * Input change event.
     *
     * @returns {void}
     */
    const handleChangeText = useCallback((event) => {
        const nextValue = event.target.value;

        setText(nextValue);

        if (!nextValue.trim()) {
            clearFilter();
        }
    }, [clearFilter]);


    /**
     * Applies the current UUID filter when the input loses focus.
     *
     * @returns {void}
     */
    const handleBlur = useCallback(() => {
        submitFilter(text);
    }, [submitFilter, text]);


    useEffect(() => {
        const value = text.trim();

        if (UUID_RE.test(value)) {
            applyUUIDFilter(value);
        }
    }, [applyUUIDFilter, text]);


    return (
        <SimpleCardCapsule title={label || id}>
            <Row>
                <Col>
                    <input
                        className="form-control"
                        value={text}
                        onChange={handleChangeText}
                        onBlur={handleBlur}
                        placeholder="Vložte ID nebo jeho část..."
                        autoComplete="off"
                        list={`${id}-suggestions`}
                    />

                    <datalist id={`${id}-suggestions`}>
                        {filteredIDSuggestions
                            .slice(0, 10)
                            .map((value) => (
                                <option
                                    key={value}
                                    value={value}
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
 * The component uses GraphQL `_ilike` filtering and displays autocomplete
 * suggestions based on the currently available finance data. Suggestion
 * matching ignores capitalization and diacritical marks.
 *
 * The component must be rendered inside `BaseFilter`.
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
 * Text filter input with finance name suggestions.
 *
 * @example
 * <CustomStringFilter
 *     id="name"
 *     label="Název"
 *     suggestions={financeNames}
 * />
 */
export const CustomStringFilter = ({
    id,
    label,
    suggestions = []
}) => {
    const filterContext = useFilterDesigner();

    if (!filterContext) {
        throw new Error(
            "<CustomStringFilter /> must be placed inside <Filter />"
        );
    }

    const [text, setText] = useState("");

    const filteredNameSuggestions = useMemo(() => {
        const searchValue = text.trim();

        if (!searchValue) {
            return suggestions;
        }

        return suggestions.filter((name) =>
            matchText(name, searchValue)
        );
    }, [text, suggestions]);


    /**
     * Clears the current string filter.
     *
     * @returns {void}
     */
    const clearFilter = useCallback(() => {
        filterContext.handleChange({
            target: {
                id,
                value: null
            }
        });
    }, [filterContext, id]);


    /**
     * Applies the current text value using the GraphQL `_ilike` operator.
     *
     * Wildcard characters are added automatically unless the user already
     * provided them.
     *
     * @param {string} currentText
     * Current value of the text input.
     *
     * @returns {void}
     */
    const submitFilter = useCallback((currentText) => {
        const trimmedValue = currentText.trim();

        if (!trimmedValue) {
            clearFilter();
            return;
        }

        const filterValue = trimmedValue.includes("%")
            ? trimmedValue
            : `%${trimmedValue}%`;

        filterContext.handleChange({
            target: {
                id,
                value: [
                    {
                        [id]: {
                            _ilike: filterValue
                        }
                    }
                ]
            }
        });
    }, [
        clearFilter,
        filterContext,
        id
    ]);


    /**
     * Updates the text input state.
     *
     * The active filter is cleared immediately when the input becomes empty.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event
     * Input change event.
     *
     * @returns {void}
     */
    const handleChangeText = useCallback((event) => {
        const nextValue = event.target.value;

        setText(nextValue);

        if (!nextValue.trim()) {
            clearFilter();
        }
    }, [clearFilter]);


    /**
     * Applies the current text filter when the input loses focus.
     *
     * @returns {void}
     */
    const handleBlur = useCallback(() => {
        submitFilter(text);
    }, [submitFilter, text]);


    return (
        <SimpleCardCapsule title={label || id}>
            <Row>
                <Col>
                    <input
                        className="form-control"
                        value={text}
                        onChange={handleChangeText}
                        onBlur={handleBlur}
                        placeholder="Začněte psát název..."
                        autoComplete="off"
                        list={`${id}-suggestions`}
                    />

                    <datalist id={`${id}-suggestions`}>
                        {filteredNameSuggestions
                            .slice(0, 10)
                            .map((value) => (
                                <option
                                    key={value}
                                    value={value}
                                />
                            ))}
                    </datalist>
                </Col>
            </Row>
        </SimpleCardCapsule>
    );
};


/**
 * Provides the primary filtering interface for `FinanceGQLModel` entities.
 *
 * The component combines UUID and name filtering into one filter form.
 * Unique identifier and name suggestions are extracted automatically from
 * the supplied finance data.
 *
 * Additional custom filter controls can be appended through `children`.
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
 * Callback invoked when the composed filter changes.
 *
 * @param {React.ReactNode} [props.children]
 * Optional additional filter components.
 *
 * @returns {JSX.Element}
 * Complete filtering interface for finance entities.
 *
 * @example
 * <Filter
 *     id="finance-filter"
 *     data={finances}
 *     onChange={handleFilterChange}
 * />
 */
export const Filter = ({
    id,
    data = [],
    onChange: handleChange,
    children
}) => {
    const actualData = Array.isArray(data)
        ? data
        : [];

    const idSuggestions = useMemo(() => {
        return [
            ...new Set(
                actualData
                    .map((item) => item?.id)
                    .filter(Boolean)
            )
        ];
    }, [actualData]);

    const nameSuggestions = useMemo(() => {
        return [
            ...new Set(
                actualData
                    .map((item) => item?.name)
                    .filter(Boolean)
            )
        ];
    }, [actualData]);

    return (
        <BaseFilter
            id={id}
            onChange={handleChange}
            label="FinanceGQLModel"
        >
            <CustomUUIDFilter
                id="id"
                label="ID"
                suggestions={idSuggestions}
            />

            <CustomStringFilter
                id="name"
                label="Název"
                suggestions={nameSuggestions}
            />

            {children}
        </BaseFilter>
    );
};