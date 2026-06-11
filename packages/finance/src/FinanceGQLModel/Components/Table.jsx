import { useMemo, useState } from "react";
import { Table as BaseTable, buildTableDef } from "../../../../_template/src/Base/Components/Table";

// Kompletní seznam sloupců včetně Typu a Nástrojů
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

const ALLOWED_SORT_KEYS = ["id", "name", "value"];

// --- FORMÁTOVACÍ FUNKCE ---
const formatCurrency = (val) => {
    if (typeof val !== "number") val = Number(val) || 0;
    return val.toLocaleString("cs-CZ") + " Kč";
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateStr;
    }
};

export const Table = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Výchozí stav: řazení podle ID vzestupně
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

    const handleSort = (key) => {
        if (!ALLOWED_SORT_KEYS.includes(key)) return;
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getLastNumberFromId = (idString) => {
        if (!idString) return 0;
        const parts = idString.toString().split("-");
        const lastPart = parts[parts.length - 1];
        return parseInt(lastPart, 10) || 0;
    };

    // Seřazení dat (ID podle posledního čísla, Částka číselně, Název abecedně)
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === "id") {
                    return sortConfig.direction === "asc" 
                        ? getLastNumberFromId(aValue) - getLastNumberFromId(bValue)
                        : getLastNumberFromId(bValue) - getLastNumberFromId(aValue);
                }

                if (sortConfig.key === "value") {
                    return sortConfig.direction === "asc" 
                        ? (Number(aValue) || 0) - (Number(bValue) || 0)
                        : (Number(bValue) || 0) - (Number(aValue) || 0);
                }

                aValue = (aValue ?? "").toString().toLowerCase();
                bValue = (bValue ?? "").toString().toLowerCase();
                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // Definice sloupců pro BaseTable
    const customTableDef = useMemo(() => {
        const baseDef = buildTableDef(sortedData);
        const filteredDef = {};

        Object.keys(WANTED_COLUMNS).forEach((key) => {
            if (baseDef[key]) {
                let label = WANTED_COLUMNS[key];
                if (sortConfig.key === key && ALLOWED_SORT_KEYS.includes(key)) {
                    label += sortConfig.direction === "asc" ? " ▲" : " ▼";
                }

                filteredDef[key] = {
                    ...baseDef[key],
                    label: label
                };

                // Formátování Částky
                if (key === "value") {
                    filteredDef[key].component = ({ row }) => <td>{formatCurrency(row?.value)}</td>;
                }
                // Formátování Datumů
                if (key === "lastchange" || key === "created") {
                    filteredDef[key].component = ({ row }) => <td>{formatDate(row?.[key])}</td>;
                }
            }
        });

        // O sloupce "tools" se vůbec nestaráme – šablona si tam sama vloží své originální KebabMenu 
        // a provede ty importy z Mutations, které máš na obrázku.
        return filteredDef;
    }, [sortedData, sortConfig]);

    const handleTableClick = (e) => {
        // Ignorujeme kliknutí na menu nástrojů
        if (e.target.closest("[role='menu']") || e.target.closest("button")) return;
        const th = e.target.closest("th");
        if (!th) return;

        const clickedLabel = th.innerText.replace(" ▲", "").replace(" ▼", "").trim();
        const foundKey = Object.keys(WANTED_COLUMNS).find(key => WANTED_COLUMNS[key] === clickedLabel);

        if (foundKey) handleSort(foundKey);
    };

    return (
        <div className="table-responsive" onClick={handleTableClick}>
            <BaseTable data={sortedData} table_def={customTableDef} />
        </div>
    );
};