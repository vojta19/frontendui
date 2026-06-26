// Importuje hook 'useSelector' z knihovny react-redux pro odběr stavu z globálního Redux store
import { useSelector } from "react-redux";

// PŮVODNÍ ZAKOMENTOVANÝ IMPORT: import { selectItemById } from "../Store/ItemSlice"; // uprav cestu

// Importuje designovou obalovou kartu (CardCapsule) z lokálního adresáře komponent
import { CardCapsule } from "../Components/CardCapsule";

// Importuje komponentu MediumCard pro zobrazení detailu entity z lokálního adresáře komponent
import { MediumCard } from "../Components/MediumCard";

// Importuje layout komponentu Col pro definici sloupců mřížky ze sdílené šablony prvků
import { Col } from "../../../../_template/src/Base/Components/Col";

// Importuje layout komponentu Row pro definici řádků mřížky ze sdílené šablony prvků
import { Row } from "../../../../_template/src/Base/Components/Row";

// Importuje funkci selektoru selectItemById pro vytažení entity z dynamického Redux storu aplikace
import { selectItemById } from "../../../../dynamic/src/Store";

// Importuje hook 'useMemo' z knihovny React pro memoizaci výpočetně náročných operací (filtrace klíčů)
import { useMemo } from "react";

// Exportuje pomocnou layout komponentu ScalarAttributeCapsule, která definuje řádkovou strukturu popisku a obsahu
export const ScalarAttributeCapsule = ({ attribute_name, item, children }) => {
    
    // Vrací JSX strukturu řádku mřížky
    return (
        <Row>
            {/* Sloupec o šířce 2 z 12 zobrazující tučně název atributu jako popisek */}
            <Col className="col-2"><b>{attribute_name}</b></Col>
            
            {/* Sloupec o šířce 10 z 12 vyhrazený pro vykreslení vnořeného obsahu (children) */}
            <Col className="col-10">
                {children}
            </Col>
        </Row>
    ); // Konec návratové hodnoty komponenty ScalarAttributeCapsule
}; // Konec definice komponenty ScalarAttributeCapsule

// Exportuje základní prezentační komponentu ScalarAttributeBase, která vkládá MediumCard do obalové kapsle řádku
export const ScalarAttributeBase = ({ attribute_name, item }) => {
    
    // Vrací obalovou kapsli s popiskem a předává jí komponentu MediumCard jako vnitřní children prvek
    return (
        <ScalarAttributeCapsule attribute_name={attribute_name} item={item}>
            <MediumCard item={item} />
        </ScalarAttributeCapsule>
    ); // Konec návratové hodnoty komponenty ScalarAttributeBase
}; // Konec definice komponenty ScalarAttributeBase

// Exportuje komponentu ScalarAttributeBind, která reaktivně propojuje lokální atribut s daty z globálního Redux storu
export const ScalarAttributeBind = ({ attribute_name, item }) => {
    
    // Bezpečně vytáhne identifikátor ID vázaného podřízeného objektu z aktuální položky
    const id = item?.[attribute_name]?.id;
    
    // Pomocí hooku useSelector odebírá data z Redux storu; pokud ID existuje, spustí selektor, jinak vrátí null
    const storedItem = useSelector((rootState) => {
        const result = id != null ? selectItemById(rootState, id) : null;
        return result;
    }); // Konec volání hooku useSelector

    // Vrací prezentační komponentu, které jako datový zdroj předává objekt synchronizovaný z Redux storu
    return (
        <ScalarAttributeBase attribute_name={attribute_name} item={storedItem} />
    ); // Konec návratové hodnoty komponenty ScalarAttributeBind
}; // Konec definice komponenty ScalarAttributeBind

// Exportuje sumární komponentu MediumCardScalars, která automaticky projde objekt a pro všechny nalezené pod-objekty vytvoří vazbu
export const MediumCardScalars = ({ item }) => {
    
    // Ošetřuje situaci, kdy by item mohl být null/undefined, dosazením prázdného objektu jako zálohy
    const sureitem = item || {};
    
    // Pomocí useMemo filtruje vlastnosti objektu; ponechá pouze ty, které jsou objektem, mají platné ID a nejsou polem
    const noArrays = useMemo(() => Object.fromEntries(
        Object.entries(sureitem).filter(([_, v]) => v && typeof v === "object" && !Array.isArray(v) && v.id != null)
    ), [item]); // Výpočet se zopakuje pouze v případě, že se změní reference objektu item

    // Vrací hlavní kartu (kapsli), ve které pro každý odfiltrovaný klíč vyrenderuje navázaný řádek atributu
    return (
        <CardCapsule item={sureitem}>
            {/* Převádí klíče pročištěného objektu na pole a mapuje je na komponenty ScalarAttributeBind */}
            {Object.keys(noArrays).map(
                (attribute_name) => <ScalarAttributeBind key={attribute_name} item={item} attribute_name={attribute_name} />
            )} {/* Konec mapování klíčů */}
        </CardCapsule> // Konec hlavní obalové karty
    ); // Konec návratové hodnoty komponenty MediumCardScalars
}; // Konec definice komponenty MediumCardScalars