// Importuje hooky useMemo a useState z knihovny React pro správu stavu a optimalizaci výpočtů
import { useMemo, useState } from "react";

// Importuje základní komponentu tabulky a pomocnou funkci buildTableDef pro generování definice sloupců ze šablony
import { Table as BaseTable, buildTableDef } from "../../../../_template/src/Base/Components/Table";

// Definuje fixní objekt požadovaných sloupců mapující klíče z databáze na české popisky v záhlaví
const WANTED_COLUMNS = {
    __typename: "Typ", // Sloupec pro název GraphQL typu entity
    id: "ID", // Sloupec pro identifikační číslo
    name: "Název", // Sloupec pro český název položky
    lastchange: "Naposledy změněno", // Sloupec pro čas poslední aktualizace
    created: "Vytvořeno", // Sloupec pro čas vytvoření záznamu
    nameEn: "EN název", // Sloupec pro anglickou mutaci názvu
    value: "Částka", // Sloupec pro finanční obnos
    description: "Popis", // Sloupec pro detailnější textový popis
    tools: "Nástroje" // Sloupec vyhrazený pro kontextová akční tlačítka
}; // Konec definice WANTED_COLUMNS

// Definuje pole klíčů, podle kterých má aplikace dovoleno na frontendu data řadit
const ALLOWED_SORT_KEYS = ["id", "name", "value"];

// --- FORMÁTOVACÍ FUNKCE ---

// Pomocná funkce pro převod číselné hodnoty na formátovanou měnu v Kč dle českých standardů
const formatCurrency = (val) => {
    
    // Pokud hodnota není typu číslo, pokusí se ji přetypovat, případně použije nulu jako zálohu
    if (typeof val !== "number") val = Number(val) || 0;
    
    // Vrací zformátované číslo s oddělovači tisíců doplněné o textový řetězec měny " Kč"
    return val.toLocaleString("cs-CZ") + " Kč";
}; // Konec definice funkce formatCurrency

// Pomocná funkce pro převod ISO řetězce data a času na lidsky čitelný formát
const formatDate = (dateStr) => {
    
    // Pokud řetězec neexistuje nebo je prázdný, vrátí pomlčku
    if (!dateStr) return "-";
    
    // Blok try-catch zachycuje případné chyby při parsování nevalidních formátů dat
    try {
        
        // Vytváří novou instanci objektu Date z předaného textového řetězce
        const d = new Date(dateStr);
        
        // Pokud vytvořené datum není validní (isNaN), vrátí původní nezměněný řetězec
        if (isNaN(d.getTime())) return dateStr;
        
        // Vrací spojené české datum a čas zkrácený na hodiny a minuty
        return d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' });
        
    } catch {
        
        // V případě jakékoliv neočekávané výjimky vrátí původní surový řetězec jako zálohu
        return dateStr;
    } // Konec bloku try-catch
}; // Konec definice funkce formatDate

// Definuje a exportuje komponentu Table, která přijímá pole objektů 'data'
export const Table = ({ data }) => {
    
    // Pokud data chybí, nebo je pole prázdné, komponenta nevykreslí vůbec nic (vrátí null)
    if (!data || data.length === 0) return null;

    // Inicializuje stav pro konfiguraci řazení; výchozí je řazení podle sloupce 'id' vzestupně ('asc')
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

    // Funkce měnící konfiguraci řazení při kliknutí na validní záhlaví sloupce
    const handleSort = (key) => {
        
        // Pokud sloupec nepatří mezi povolené klíče pro řazení, operaci ihned ignoruje
        if (!ALLOWED_SORT_KEYS.includes(key)) return;
        
        // Nastaví výchozí směr řazení na vzestupný
        let direction = "asc";
        
        // Pokud se kliklo na stejný sloupec, který je již aktivní a řazený vzestupně, otočí směr na sestupný
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        } // Konec podmínky pro změnu směru
        
        // Aktualizuje stav komponenty nově vyhodnoceným klíčem a směrem řazení
        setSortConfig({ key, direction });
    }; // Konec definice funkce handleSort

    // Pomocná funkce pro vytažení posledního číselného segmentu z řetězcového ID (např. z UUID nebo "finance-123")
    const getLastNumberFromId = (idString) => {
        
        // Pokud ID neexistuje, vrátí výchozí hodnotu 0
        if (!idString) return 0;
        
        // Rozdělí řetězec na pole částí podle znaku pomlčky
        const parts = idString.toString().split("-");
        
        // Získá poslední prvek z tohoto pole částí
        const lastPart = parts[parts.length - 1];
        
        // Převede tento poslední segment na celé číslo o základu 10, v případě selhání vrátí 0
        return parseInt(lastPart, 10) || 0;
    }; // Konec definice funkce getLastNumberFromId

    // Memoizuje seřazená data; výpočet se spustí znovu pouze při změně vstupních dat nebo konfigurace řazení
    const sortedData = useMemo(() => {
        
        // Vytváří mělkou kopii původního pole dat, aby nedocházelo k mutaci props
        let sortableItems = [...data];
        
        // Pokud je vybrán klíč pro řazení, provede se řazení pole pomocí vestavěné metody .sort()
        if (sortConfig.key !== null) {
            
            // Spouští porovnávací funkci pro dvojice položek (a, b)
            sortableItems.sort((a, b) => {
                
                // Získává hodnoty řazeného atributu pro oba porovnávané objekty
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Specifické řazení pro sloupec 'id' na základě koncových čísel
                if (sortConfig.key === "id") {
                    return sortConfig.direction === "asc" 
                        ? getLastNumberFromId(aValue) - getLastNumberFromId(bValue)
                        : getLastNumberFromId(bValue) - getLastNumberFromId(aValue);
                } // Konec řazení ID

                // Specifické číselné řazení pro sloupec 'value' (Částka) s ošetřením nevalidních hodnot
                if (sortConfig.key === "value") {
                    return sortConfig.direction === "asc" 
                        ? (Number(aValue) || 0) - (Number(bValue) || 0)
                        : (Number(bValue) || 0) - (Number(aValue) || 0);
                } // Konec řazení Částky

                // Standardní textové (abecední) řazení pro ostatní sloupce (např. jméno)
                aValue = (aValue ?? "").toString().toLowerCase(); // Převod hodnoty A na malá písmena
                bValue = (bValue ?? "").toString().toLowerCase(); // Převod hodnoty B na malá písmena
                
                // Porovnání řetězců a vrácení výsledku na základě aktivního směru řazení
                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0; // Hodnoty jsou totožné
            }); // Konec metody sort
        } // Konec podmínky aktivního řazení
        
        // Vrací upravené a seřazené pole položek
        return sortableItems;
        
    }, [data, sortConfig]); // Závislosti memoizace: zdrojová data a stav řazení

    // Memoizuje definici tabulky pro šablonu; filtruje a transformuje sloupce, přidává ikony řazení a formátovací sub-komponenty
    const customTableDef = useMemo(() => {
        
        // Generuje základní objekt definice sloupců na základě aktuálně seřazených dat
        const baseDef = buildTableDef(sortedData);
        
        // Inicializuje prázdný objekt pro výslednou přizpůsobenou definici sloupců
        const filteredDef = {};

        // Prochází všechny klíče definované v požadovaných sloupcích (WANTED_COLUMNS)
        Object.keys(WANTED_COLUMNS).forEach((key) => {
            
            // Pokud generovaná základní definice obsahuje odpovídající klíč, zpracuje ho
            if (baseDef[key]) {
                
                // Načte výchozí český text popisku sloupce
                let label = WANTED_COLUMNS[key];
                
                // Pokud je tento sloupec právě aktivní pro řazení, připojí k textu vizuální šipku směru
                if (sortConfig.key === key && ALLOWED_SORT_KEYS.includes(key)) {
                    label += sortConfig.direction === "asc" ? " ▲" : " ▼";
                } // Konec doplňování šipky

                // Zkopíruje vlastnosti sloupce z baseDef a přepíše label novou hodnotou (případně se šipkou)
                filteredDef[key] = {
                    ...baseDef[key], // Rozbalení původních parametrů sloupce
                    label: label // Dosazení upraveného štítku
                }; // Konec definice sloupce

                // Pokud jde o sloupec 'value', vloží do definice vlastní komponentu buňky pro formát měny
                if (key === "value") {
                    filteredDef[key].component = ({ row }) => <td>{formatCurrency(row?.value)}</td>;
                } // Konec custom komponenty pro Částku
                
                // Pokud jde o časové údaje, vloží vlastní komponentu buňky pro formát data a času
                if (key === "lastchange" || key === "created") {
                    filteredDef[key].component = ({ row }) => <td>{formatDate(row?.[key])}</td>;
                } // Konec custom komponenty pro data
            } // Konec kontroly existence klíče v baseDef
        }); // Konec cyklu forEach přes WANTED_COLUMNS

        // O sloupce "tools" se vůbec nestaráme – šablona si tam sama vloží své originální KebabMenu 
        // a provede ty importy z Mutations, které máš na obrázku.
        return filteredDef;
        
    }, [sortedData, sortConfig]); // Závislosti memoizace: seřazená data a konfigurace šipek řazení

    // Společný event handler pro zachycení kliknutí nad celým kontejnerem tabulky (Event Delegation)
    const handleTableClick = (e) => {
        
        // Pokud kliknutí přišlo z vnitřku rozbalovacího menu nebo akčního tlačítka nástrojů, událost ignoruje
        if (e.target.closest("[role='menu']") || e.target.closest("button")) return;
        
        // Hledá nejbližší nadřazený element hlavičky tabulky (th) od místa kliknutí
        const th = e.target.closest("th");
        
        // Pokud kliknutí neproběhlo uvnitř záhlaví th, ukončí funkci
        if (!th) return;

        // Očistí text v záhlaví od případných šipek řazení a mezer, aby získal čistý název sloupce
        const clickedLabel = th.innerText.replace(" ▲", "").replace(" ▼", "").trim();
        
        // Vyhledá v WANTED_COLUMNS klíč (např. 'id', 'name'), který odpovídá očištěnému textu záhlaví
        const foundKey = Object.keys(WANTED_COLUMNS).find(key => WANTED_COLUMNS[key] === clickedLabel);

        // Pokud byl odpovídající systémový klíč nalezen, předá ho funkci pro spuštění/změnu řazení
        if (foundKey) handleSort(foundKey);
    }; // Konec definice handleTableClick

    // Vrací obalový div prvek s třídou pro responzivitu, zachytáváním kliknutí a samotnou základní tabulkou
    return (
        <div className="table-responsive" onClick={handleTableClick}>
            {/* Vykresluje BaseTable s předáním připravených dat a přizpůsobené definice sloupců */}
            <BaseTable data={sortedData} table_def={customTableDef} />
        </div>
    ); // Konec návratové hodnoty JSX
}; // Konec definice komponenty Table