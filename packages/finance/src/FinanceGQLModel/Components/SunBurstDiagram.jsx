// Importuje hook 'useMemo' z knihovny React pro memoizaci výpočetně náročných operací
import { useMemo } from "react";

// PŮVODNÍ ZAKOMENTOVANÝ IMPORT: import { useNavigate } from "react-router"

// Importuje komponentu CardCapsule, která slouží jako obalový designový prvek (karta) s hlavičkou
import { CardCapsule } from "../../../../_template/src/Base/Components/CardCapsule";

// Definuje pole hexadecimálních kódů barev, které se budou cyklicky používat pro jednotlivé výseče diagramu
const COLORS = [
    "#0d6efd", // Modrá
    "#198754", // Zelená
    "#ffc107", // Žlutá
    "#dc3545", // Červená
    "#6f42c1", // Fialová
    "#20c997", // Tyrkysová
    "#fd7e14", // Oranžová
    "#0dcaf0"  // Světle modrá
]; // Konec definice pole barev

// Funkce přepočítává polární souřadnice (úhel a poloměr) na kartézské souřadnice X a Y
const polarToCartesian = (cx, cy, r, angle) => {
    
    // Převádí úhel ve stupních na radiány a posouvá ho o 90 stupňů (zarovnání na 12. hodinu)
    const a = (angle - 90) * Math.PI / 180;

    // Vrací objekt se spočítanými souřadnicemi X a Y na základě goniometrických funkcí cos a sin
    return {
        x: cx + r * Math.cos(a), // Výsledná X souřadnice bodu
        y: cy + r * Math.sin(a)  // Výsledná Y souřadnice bodu
    }; // Konec objektu souřadnic
}; // Konec definice funkce polarToCartesian

// Funkce generuje textový řetězec pro SVG path definující prstencovou výseč (arc)
const describeArc = (cx, cy, innerR, outerR, startAngle, endAngle) => {
    
    // Určuje příznak pro velký oblouk (large-arc-flag); 1 pokud je výseč větší než 180 stupňů, jinak 0
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    // Spočítá koncový vnější bod výseče
    const p1 = polarToCartesian(cx, cy, outerR, endAngle);
    
    // Spočítá počáteční vnější bod výseče
    const p2 = polarToCartesian(cx, cy, outerR, startAngle);
    
    // Spočítá počáteční vnitřní bod výseče
    const p3 = polarToCartesian(cx, cy, innerR, startAngle);
    
    // Spočítá koncový vnitřní bod výseče
    const p4 = polarToCartesian(cx, cy, innerR, endAngle);

    // Sestaví pole instrukcí pro SVG cestu (Move, Arc, Line) a spojí je mezerami do jednoho řetězce
    return [
        `M ${p1.x} ${p1.y}`, // Přesunout kurzor na koncový vnější bod (p1)
        `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${p2.x} ${p2.y}`, // Kreslit vnější oblouk do bodu p2 proti směru hodin
        `L ${p3.x} ${p3.y}`, // Kreslit úsečku dovnitř na počáteční vnitřní bod (p3)
        `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${p4.x} ${p4.y}`, // Kreslit vnitřní oblouk do bodu p4 po směru hodin
        "Z" // Uzavřít cestu (spojit zpět do bodu p1)
    ].join(" "); // Spojení prvků pole do řetězce
}; // Konec definice funkce describeArc

// Funkce pro bezpečné získání textového popisku uzlu z různých možných datových klíčů
const getNodeLabel = (node) => {
    
    // Vrací první nalezenou textovou vlastnost z uzlu, nebo fallback "node"
    return (
        node?.name || // Zkusí vlastnost name
        node?.nameEn || // Zkusí vlastnost nameEn
        node?.label || // Zkusí vlastnost label
        node?.title || // Zkusí vlastnost title
        node?.typename || // Zkusí vlastnost typename
        node?.__typename || // Zkusí interní GraphQL vlastnost __typename
        node?.id || // Zkusí textovou podobu ID
        "node" // Výchozí řetězec, pokud uzel nemá žádný popisek
    ); // Konec prioritního řetězce
}; // Konec definice funkce getNodeLabel

// Funkce, která na základě typu a ID uzlu vygeneruje cílovou URL adresu pro směrování
const getNodeUrl = (node) => {
    
    // Pokud uzel neexistuje nebo to není objekt, ihned vrací null
    if (!node || typeof node !== "object") return null;

    // Pokud uzel již obsahuje explicitní URL, href, path nebo link, vrátí ho přednostně
    if (node.url) return node.url;
    if (node.href) return node.href;
    if (node.path) return node.path;
    if (node.link) return node.link;

    // Pokud má uzel vlastnost 'typename' a 'id', sestaví URL podle tohoto vzoru
    if (node.typename && node.id) {
        return `/finance/${node.typename}/view/${node.id}`;
    } // Konec podmínky pro typename

    // Pokud má uzel GraphQL vlastnost '__typename' a 'id', sestaví URL podle tohoto vzoru
    if (node.__typename && node.id) {
        return `/finance/${node.__typename}/view/${node.id}`;
    } // Konec podmínky pro __typename

    // Záložní varianta (fallback): pokud existuje pouze ID bez specifikace typu, předpokládá se FinanceGQLModel
    if (node.id && !node.typename && !node.__typename) {
        return `/finance/FinanceGQLModel/view/${node.id}`;
    } // Konec záložní podmínky

    // Pokud nebylo možné URL z ničeho sestavit, vrací null
    return null;
}; // Konec definice funkce getNodeUrl

// Pomocná funkce pro vytažení a normalizaci vnořených dětí/potomků z libovolné struktury uzlu
const getNodeChildren = (node) => {
    
    // Pokud uzel neexistuje nebo není objekt, vrací prázdné pole potomků
    if (!node || typeof node !== "object") return [];

    // Pokud obsahuje standardní pole pod klíči children, items nebo nodes, vrátí ho přímo
    if (Array.isArray(node.children)) return node.children;
    if (Array.isArray(node.items)) return node.items;
    if (Array.isArray(node.nodes)) return node.nodes;

    // Pokud explicitní pole chybí, prohledá všechny objektové klíče (property)
    return Object.entries(node)
        
        // Filtruje dvojice klíč-hodnota podle specifických podmínek
        .filter(([key, value]) => {
            
            // Ignoruje interní systémové klíče začínající podtržítkem
            if (key.startsWith("_")) return false;

            // Ignoruje běžné skalární meta-atributy uzlu, které nejsou poli dětí
            if (
                [
                    "id",
                    "name",
                    "label",
                    "title",
                    "typename",
                    "__typename"
                ].includes(key)
            ) {
                return false; // Klíč je vyřazen z pole potomků
            } // Konec vnitřní podmínky

            // Propustí pouze ty vlastnosti, jejichž hodnotou je pole (Array)
            return Array.isArray(value);
        }) // Konec filtrace entries
        
        // Transformuje a sjednocuje strukturu pro všechny nalezené potomky do jednoho plochého pole
        .flatMap(([key, value]) =>
            
            // Mapuje pole dětí a obohacuje je o normalizovaný název, pokud chybí
            value.map((child) => ({
                ...child, // Rozbalí a zachová původní vlastnosti dítěte
                name: getNodeLabel(child) || key // Přiřadí vygenerované jméno nebo název mateřského klíče
            })) // Konec mapování child
        ); // Konec flatMap řetězce
}; // Konec definice funkce getNodeChildren

// Rekurzivní funkce, která transformuje stromovou datovou strukturu na ploché pole uzlů s dopočítanými úhly pro Sunburst diagram
const buildSunburstNodes = (root, maxDepth = 4) => {
    
    // Pole, do kterého se budou postupně ukládat naploché objekty uzlů pro vykreslení
    const result = [];

    // Vnitřní rekurzivní funkce (walk) provádějící průchod stromem (Depth-First Search)
    const walk = (node, depth, startAngle, endAngle, colorIndex) => {
        
        // Pokud uzel neexistuje nebo jsme překročili maximální povolenou hloubku, rekurze končí
        if (!node || depth > maxDepth) return;

        // Vloží aktuálně zpracovávaný uzel s vypočtenými úhly, hloubkou a indexem barvy do výsledného pole
        result.push({
            node,
            depth,
            startAngle,
            endAngle,
            colorIndex
        }); // Konec push objektu

        // Získá pole potomků pro aktuální uzel
        const children = getNodeChildren(node);
        
        // Pokud uzel nemá žádné potomky, rekurzivní větev zde končí (listový uzel)
        if (!children.length) return;

        // Spočítá sumu hodnot všech přímých dětí pro proporcionální rozdělení úhlu (pokud hodnota chybí, použije se 1)
        const totalValue = children.reduce((sum, child) => sum + (Number(child.value) || 1), 0);

        // Nastaví počáteční úhel pro první dítě na hodnotu startAngle aktuálního uzlu
        let currentAngle = startAngle;
        
        // Spočítá celkový úhlový prostor, který má tato úroveň dětí k dispozici
        const availableAngle = endAngle - startAngle;

        // Prochází jednotlivé děti a rekurzivně pro ně spouští funkci walk s rozpočítaným úhlem
        children.forEach((child, index) => {
            
            // Získá číselnou hodnotu dítěte, nebo použije výchozí 1
            const childValue = Number(child.value) || 1;
            
            // Spočítá úhlovou výseč (slice) pro toto konkrétní dítě na základě jeho poměru vůči celkové sumě dětí
            const slice = (childValue / totalValue) * availableAngle;
            
            // Rekurzivně volá funkci walk pro dané dítě, zvyšuje hloubku o 1 a mění index barvy
            walk(
                child,
                depth + 1, // Zvýšení hloubky
                currentAngle, // Počáteční úhel dítěte
                currentAngle + slice, // Koncový úhel dítěte (počátek + velikost výseče)
                colorIndex + index + 1 // Výpočet unikátnějšího indexu barvy
            ); // Konec rekurzivního volání
            
            // Posune počáteční úhel pro následující dítě o velikost aktuálně zpracované výseče
            currentAngle += slice;
        }); // Konec cyklu forEach
    }; // Konec definice vnitřní funkce walk

    // Spustí rekurzivní průchod od kořenového uzlu (root) s hloubkou 0, pokrývající celý kruh (0 až 360 stupňů)
    walk(root, 0, 0, 360, 0);

    // Vrací kompletní pole naploché struktury uzlů připravených pro SVG render
    return result;
}; // Konec definice funkce buildSunburstNodes

// Definuje a exportuje hlavní React komponentu SunburstDiagram pro vykreslení grafu
export const SunburstDiagram = ({
    item, // Vstupní kořenový objekt s daty
    header = "Sunburst diagram", // Výchozí text nadpisu karty
    size = 600, // Výchozí šířka a výška diagramu v pixelech
    maxDepth = 4, // Výchozí maximální hloubka zanoření
    onSelect, // Volitelný callback při kliknutí na libovolnou výseč
    selectedSourceId = null, // ID označeného zdrojového uzlu (pro šrafování)
    selectedTargetId = null // ID označeného cílového uzlu (pro záři a zvýraznění)
}) => {
    // PŮVODNÍ ZAKOMENTOVANÝ ŘÁDEK: const navigate = useNavigate()

    // Spočítá středový bod diagramu (osa X i Y) jako polovinu z celkové velikosti
    const center = size / 2;
    
    // Definuje fixní šířku jednoho prstence (úrovně hloubky) v pixelech
    const ringWidth = 85;

    // Pomocí useMemo vypočítá a optimalizuje ploché uzly diagramu; přepočítá se pouze při změně položky či hloubky
    const nodes = useMemo(() => {
        return buildSunburstNodes(item, maxDepth);
    }, [item, maxDepth]); // Pole závislostí useMemo

    // Pokud vstupní objekt neexistuje, komponenta nevykreslí vůbec nic (vrátí null)
    if (!item) return null;

    // Vrací strukturu karty obsahující centrovaný SVG prvek
    return (
        <CardCapsule header={header}>
            <div className="d-flex justify-content-center align-items-center">
                <svg
                    width="100%" // SVG se přizpůsobí šířce rodičovského kontejneru
                    height={size} // Pevná výška definovaná v props
                    viewBox={`-120 -120 ${size + 240} ${size + 240}`} // Nastavení výřezu zohledňující odsazení pro popisky na okrajích
                    role="img" // Definice přístupnosti jako obrázek
                    aria-label={header} // Popisek obrázku pro asistenční technologie
                >
                    <defs>
                        {/* Definuje vzor (pattern) pro šikmé šrafování, které se použije pro označený zdrojový uzel */}
                        <pattern
                            id="diagonalHatch" // Unikátní ID vzoru
                            patternUnits="userSpaceOnUse" // Jednotky vzoru se mapují na souřadnicový systém uživatele
                            width="8" // Šířka jedné dlaždice vzoru
                            height="8" // Výška jedné dlaždice vzoru
                            patternTransform="rotate(45)" // Otočení celého šrafování o 45 stupňů
                        >
                            <line
                                x1="0" // Počáteční X souřadnice čáry vzoru
                                y1="0" // Počáteční Y souřadnice čáry vzoru
                                x2="0" // Koncová X souřadnice čáry vzoru
                                y2="8" // Koncová Y souřadnice čáry vzoru
                                stroke="blue" // Modrá barva šrafy
                                strokeWidth="3" // Tloušťka šrafovací čáry
                                opacity="0.5" // Poloviční průhlednost čáry
                            />
                        </pattern>
                        
                        {/* Definuje SVG filtr pro efekt záře (glow effect) okolo vybraného cílového uzlu */}
                        <filter id="glow">
                            {/* Vytvoří rozostření (blur) na základě standardní odchylky */}
                            <feGaussianBlur
                                stdDeviation="4" // Míra rozostření záře
                                result="coloredBlur" // Pojmenování výstupu tohoto kroku
                            />

                            {/* Sloučí rozostřený podklad s původním ostrým grafickým prvkem */}
                            <feMerge>
                                <feMergeNode in="coloredBlur" /> {/* Spodní vrstva: rozostření */}
                                <feMergeNode in="SourceGraphic" /> {/* Horní vrstva: původní prvek */}
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Iteruje přes pole vypočtených uzlů a pro každý vygeneruje odpovídající SVG grafické prvky */}
                    {nodes.map((entry, index) => {
                        
                        // Destrukturalizuje parametry aktuálního uzlu z pole uzlů
                        const {
                            node,
                            depth,
                            startAngle,
                            endAngle,
                            colorIndex
                        } = entry; // Konec destrukturalizace entry

                        // Získání popisku a dětí uzlu pro lokální podmínky vykreslení
                        const label = getNodeLabel(node);
                        const children = getNodeChildren(node);
                        const isLeaf = children.length === 0; // Kontrola, zda je uzel koncovým listem
                        const isSource = node?.id === selectedSourceId; // Kontrola, zda se jedná o označený zdroj
                        const isTarget = node?.id === selectedTargetId; // Kontrola, zda se jedná o označený cíl

                        // Handler pro zpracování kliknutí na konkrétní prvek diagramu
                        const handleClick = (event) => {
                            
                            // Zamezí probublávání události click do nadřazených SVG vrstev a kontejnerů
                            event.stopPropagation();

                            // Pokud uzel nemá platné ID, akci nelze provést
                            if (!node?.id) return;

                            // Vyvolá externí callback onSelect a předá mu kliknutý objekt uzlu
                            onSelect?.(node);
                        }; // Konec funkce handleClick

                        // Výpočet vnitřního poloměru: kořenový uzel (depth 0) začíná v nule, ostatní se násobí šířkou prstence
                        const innerR = depth === 0 ? 0 : depth * ringWidth;
                        
                        // Výpočet vnějšího poloměru pro danou úroveň
                        const outerR = depth == 0
                            ? ringWidth
                            : (depth + 1) * ringWidth;

                        // Výpočet poloměru pro umístění textového popisku (v polovině šířky daného prstence)
                        const labelR = depth === 0
                            ? innerR + (outerR - innerR) * 0.5
                            : innerR + (outerR - innerR) * 0.5;

                        // Spočítá středový úhel výseče pro správné natočení a umístění textu
                        const angle = (startAngle + endAngle) / 2;
                        
                        // Přepočítá polární souřadnice středu výseče na kartézský bod (X, Y) pro text
                        const labelPoint = polarToCartesian(
                            center,
                            center,
                            labelR,
                            angle
                        ); // Konec volání polarToCartesian pro text

                        // Speciální render pro centrální kořenový uzel (hloubka 0) - vykresluje se jako plný kruh (circle)
                        if (depth === 0) {
                            return (
                                <g
                                    key={index} // Unikátní klíč pro React iteraci
                                    onClick={handleClick} // Přiřazení handleru kliknutí
                                    style={{ cursor: node?.id ? "pointer" : "default" }} // Kurzor ruky pouze u uzlů s ID
                                >
                                    {/* Centrální kruh kořene */}
                                    <circle
                                        cx={center} // Střed X
                                        cy={center} // Střed Y
                                        r={outerR} // Poloměr kruhu
                                        fill={COLORS[0]} // První barva z pole barev
                                        opacity="0.9" // Mírná průhlednost
                                    >
                                        <title>{label}</title> {/* SVG tooltip při najetí myší */}
                                    </circle>

                                    {/* Textový popisek uprostřed centrálního kruhu */}
                                    <text
                                        x={center} // Vycentrování X
                                        y={center} // Vycentrování Y
                                        textAnchor="middle" // Horizontální zarovnání textu na střed
                                        dominantBaseline="middle" // Vertikální zarovnání textu na střed
                                        fontSize="18" // Velikost písma centrálního textu
                                        fill="white" // Bílá barva písma
                                    >
                                        {/* Rozděluje text na řádky po maximálně 14 znacích tak, aby se vešel do kruhu */}
                                        {String(label)
                                            .match(/.{1,14}(\s|$)/g) // Regulární výraz pro zalomení slov
                                            ?.map((line, i) => (
                                                <tspan
                                                    key={i} // Klíč řádku textu
                                                    x={center} // Zarovnání každého řádku na střed X
                                                    dy={i === 0 ? "-0.6em" : "1.2em"} // Vertikální posun řádků pod sebe
                                                >
                                                    {line.trim()} {/* Odstranění prázdných znaků a výpis řádku */}
                                                </tspan>
                                            ))}
                                    </text>
                                </g>
                            ); // Konec rekurzivního JSX pro depth 0
                        } // Konec podmínky depth === 0

                        // Standardní render pro všechny ostatní prstence a výseče (depth > 0) pomocí SVG path
                        return (
                            <g
                                key={index} // Unikátní klíč iterace
                                onClick={handleClick} // Handler kliknutí na výseč
                                style={{ cursor: node?.id ? "pointer" : "default" }} // Styl kurzoru myši
                            >
                                {/* Vykreslení samotné prstencové výseče */}
                                <path
                                    d={describeArc(
                                        center,
                                        center,
                                        innerR,
                                        outerR,
                                        startAngle,
                                        endAngle
                                    )} // Generování souřadnic cesty z úhlů a poloměrů
                                    fill={
                                        isSource
                                            ? `url(#diagonalHatch)` // Pokud je uzel zdroj, aplikuje šrafovaný vzor
                                            : COLORS[colorIndex % COLORS.length] // Jinak vezme barvu z pole podle vypočteného indexu
                                    }
                                    stroke={
                                        isTarget
                                            ? "#000000" // Černý výrazný okraj pro vybraný cíl
                                            : "black" // Standardní tenký černý okraj
                                    }
                                    strokeWidth={
                                        isTarget
                                            ? "10" // Tlustá čára pro označený cíl
                                            : "4" // Standardní tloušťka čáry výsečí
                                    }
                                    opacity={
                                        isSource || isTarget
                                            ? "1" // Plná opacita pro vybrané/zvýrazněné uzly
                                            : "0.88" // Mírná průhlednost pro běžné výseče
                                    }
                                    filter={isTarget ? "url(#glow)" : "undefined"} // Aplikuje filtr záře, pokud jde o cílový uzel
                                >
                                    <title>{label}</title> {/* Nativní SVG tooltip s popiskem */}
                                </path>

                                {/* Zobrazí textový popisek uvnitř výseče pouze v případě, že je výseč dostatečně široká (> 8 stupňů) */}
                                {endAngle - startAngle > 8 && (
                                    <text
                                        x={labelPoint.x} // Pozice X textu ve středu výseče
                                        y={labelPoint.y} // Pozice Y textu ve středu výseče
                                        textAnchor="middle" // Horizontální vystředění textu k bodu
                                        dominantBaseline="central" // Vertikální vystředění textu k bodu
                                        // Otáčí text podél poloměru výseče; pokud je text "vzhůru nohama" (úhel 90-270), otočí ho o dalších 180 stupňů pro lepší čitelnost
                                        transform={`rotate(${angle > 90 && angle < 270 ? angle + 180 : angle} ${labelPoint.x} ${labelPoint.y})`}
                                        fontSize={depth >= 2 ? "13" : "15"} // Menší písmo pro vzdálenější vnější prstence
                                        fill={isSource ? "#000000" : "white"} // Černý text na šrafování, jinak bílý text
                                        pointerEvents="none" // Zakáže zachytávání myši textem (aby neblokoval kliknutí na path pod ním)
                                    >
                                        {/* Rozdělí text popisku na kusy po 12 znacích a vezme maximálně první 3 řádky */}
                                        {String(label)
                                            .match(/.{1,12}/g) // Split textu po 12 znacích
                                            ?.slice(0, 3) // Omezení na maximálně 3 řádky textu
                                            ?.map((line, i) => (
                                                <tspan
                                                    key={i} // Klíč tspan elementu
                                                    x={labelPoint.x} // Zarovnání řádku na X střed bodu
                                                    dy={i === 0 ? "-0.5em" : "1.1em"} // Vertikální odřádkování tspan prvků
                                                >
                                                    {line} {/* Výpis textu řádku */}
                                                </tspan>
                                            ))}
                                    </text>
                                )}
                            </g>
                        ); // Konec návratové hodnoty standardního prstencového uzlu
                    })} 
                </svg>
            </div>
        </CardCapsule>
    ); // Konec hlavní návratové hodnoty komponenty SunburstDiagram
}; // Konec definice komponenty SunburstDiagram