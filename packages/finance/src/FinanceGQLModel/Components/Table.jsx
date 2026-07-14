import {
    useMemo,
    useState
} from "react";

import {
    Table as BaseTable,
    buildTableDef
} from "../../../../_template/src/Base/Components/Table";

import { UpdateLink } from "../Mutations/Update";
import { DeleteButton } from "../Mutations/Delete";
import { KebabMenu } from "../../../../_template/src/Base/Components/Table";


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
    const numericValue =
        typeof value === "number"
            ? value
            : Number(value) || 0;

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
    if (!dateString) {
        return "-";
    }

    try {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        const localizedDate =
            date.toLocaleDateString("cs-CZ");

        const localizedTime =
            date.toLocaleTimeString(
                "cs-CZ",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        return `${localizedDate} ${localizedTime}`;
    } catch {
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
    if (!idValue) {
        return 0;
    }

    const parts = String(idValue).split("-");
    const lastPart = parts.at(-1);

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
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

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
        if (!ALLOWED_SORT_KEYS.includes(key)) {
            return;
        }

        const direction =
            sortConfig.key === key &&
                sortConfig.direction === "asc"
                ? "desc"
                : "asc";

        setSortConfig({
            key,
            direction
        });
    };


    const sortedData = useMemo(() => {
        const sortableItems = [...data];

        if (!sortConfig.key) {
            return sortableItems;
        }

        sortableItems.sort((firstItem, secondItem) => {
            let firstValue =
                firstItem?.[sortConfig.key];

            let secondValue =
                secondItem?.[sortConfig.key];

            if (sortConfig.key === "id") {
                const firstNumber =
                    getLastNumberFromId(firstValue);

                const secondNumber =
                    getLastNumberFromId(secondValue);

                return sortConfig.direction === "asc"
                    ? firstNumber - secondNumber
                    : secondNumber - firstNumber;
            }

            if (sortConfig.key === "value") {
                const firstNumber =
                    Number(firstValue) || 0;

                const secondNumber =
                    Number(secondValue) || 0;

                return sortConfig.direction === "asc"
                    ? firstNumber - secondNumber
                    : secondNumber - firstNumber;
            }

            firstValue =
                String(firstValue ?? "")
                    .toLocaleLowerCase("cs-CZ");

            secondValue =
                String(secondValue ?? "")
                    .toLocaleLowerCase("cs-CZ");

            const comparison =
                firstValue.localeCompare(
                    secondValue,
                    "cs-CZ"
                );

            return sortConfig.direction === "asc"
                ? comparison
                : -comparison;
        });

        return sortableItems;
    }, [
        data,
        sortConfig
    ]);


    const customTableDef = useMemo(() => {
        const baseDefinition =
            buildTableDef(sortedData);

        const filteredDefinition = {};

        Object.keys(WANTED_COLUMNS).forEach((key) => {
            if (key === "tools") {
                filteredDefinition[key] = {
                    label: WANTED_COLUMNS[key],
                    component: ({ row }) => (
                        <td>
                            <KebabMenu actions={[
                                {
                                    children: (
                                        <UpdateLink
                                            className="btn btn-sm btn-outline-secondary border-0 text-start w-100"
                                            item={row}
                                            rbacitem={row?.rbacobject}
                                        >
                                            Editovat
                                        </UpdateLink>
                                    )
                                },
                                {
                                    children: (
                                        <DeleteButton
                                            className="btn btn-sm btn-outline-danger border-0 text-start w-100"
                                            item={row}
                                            rbacitem={row?.rbacobject}
                                        >
                                            Smazat
                                        </DeleteButton>
                                    )
                                }
                            ]} />
                        </td>
                    )
                }
                return
            }

            if (!baseDefinition[key]) {
                return;
            }

            let label = WANTED_COLUMNS[key];

            if (
                sortConfig.key === key &&
                ALLOWED_SORT_KEYS.includes(key)
            ) {
                label +=
                    sortConfig.direction === "asc"
                        ? " ▲"
                        : " ▼";
            }

            filteredDefinition[key] = {
                ...baseDefinition[key],
                label
            };

            if (key === "value") {
                filteredDefinition[key].component =
                    ({ row }) => (
                        <td>
                            {formatCurrency(row?.value)}
                        </td>
                    );
            }

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
        const clickedElement = event.target;

        if (
            clickedElement.closest("[role='menu']") ||
            clickedElement.closest("button")
        ) {
            return;
        }

        const headerCell =
            clickedElement.closest("th");

        if (!headerCell) {
            return;
        }

        const clickedLabel =
            headerCell.innerText
                .replace(" ▲", "")
                .replace(" ▼", "")
                .trim();

        const columnKey =
            Object.keys(WANTED_COLUMNS).find(
                (key) =>
                    WANTED_COLUMNS[key] ===
                    clickedLabel
            );

        if (columnKey) {
            handleSort(columnKey);
        }
    };


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