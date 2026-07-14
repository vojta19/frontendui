// Importuje designovou obalovou kartu (CardCapsule) z lokálního adresáře komponent
import { CardCapsule } from "../Components/CardCapsule";

// Importuje komponentu tabulky (Table) pro strukturované vykreslení dat z lokálního adresáře komponent
import { Table } from "../Components/Table";

// Importuje layout komponentu Col pro definici sloupců mřížky ze sdílené šablony prvků
import { Col } from "../../../../_template/src/Base/Components/Col";

// Importuje layout komponentu Row pro definici řádků mřížky ze sdílené šablony prvků
import { Row } from "../../../../_template/src/Base/Components/Row";

/**
 * Creates a component that displays a vector attribute of an entity.
 *
 * The generated component renders the selected array attribute inside a
 * table wrapped by a card and arranged using the shared row/column layout.
 *
 * @param {string} attribute_name
 * Name of the vector attribute to display.
 *
 * @returns {React.ComponentType}
 * Component rendering the selected vector attribute.
 */
// Exportuje funkci vyššího řádu (Factory), která dynamicky generuje React komponentu pro zobrazení mřížkového řádku s polem
export const VectorAttributeFactory = (attribute_name) => ({ item }) => {
    
    // Bezpečně vyvádí pole hodnot z objektu na základě názvu klíče, v případě absence nastaví prázdné pole
    const attribute_value = item?.[attribute_name] || [];
    
    // Vrací JSX strukturu řádku obsahující název atributu a obalenou tabulku s daty
    return (
        <Row key={attribute_name}>
            {/* Sloupec o šířce 2 z 12 zobrazující tučně název atributu */}
            <Col className="col-2"><b>{attribute_name}</b></Col>
            
            {/* Sloupec o šířce 10 z 12 obsahující kartu s tabulkou prvků */}
            <Col className="col-10">
                <CardCapsule item={item}>
                    <Table data={attribute_value} />
                </CardCapsule>
            </Col>
        </Row>
    ); // Konec návratové hodnoty generované komponenty
}; // Konec definice tovární funkce VectorAttributeFactory

/**
 * Displays a vector attribute using the row-based layout.
 *
 * The attribute name is displayed in the left column while the vector
 * contents are rendered as a table inside a card in the right column.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} props.attribute_name
 * Name of the vector attribute.
 *
 * @param {Object} props.item
 * Entity containing the vector attribute.
 *
 * @returns {JSX.Element}
 * Row-based presentation of the vector attribute.
 */
// Exportuje alternativní standardní komponentu VectorAttribute_ pro řádkové zobrazení mřížky s popiskem na boku
export const VectorAttribute_ = ({ attribute_name, item }) => {
    
    // Bezpečně vyvádí pole hodnot z objektu podle klíče, nebo použije prázdné pole jako zálohu
    const attribute_value = item?.[attribute_name] || [];
    
    // Vrací JSX strukturu řádku s tabulkou (funkčně identická s výstupem tovární funkce)
    return (
        <Row key={attribute_name}>
            {/* Sloupec pro tučný popisek klíče o šířce 2 */}
            <Col className="col-2"><b>{attribute_name}</b></Col>
            
            {/* Sloupec pro obalenou tabulku prvků o šířce 10 */}
            <Col className="col-10">
                <CardCapsule item={item}>
                    <Table data={attribute_value} />
                </CardCapsule>
            </Col>
        </Row>
    ); // Konec návratové hodnoty komponenty VectorAttribute_
}; // Konec definice komponenty VectorAttribute_

/**
 * Displays a vector attribute inside a standalone card.
 *
 * The card title contains the attribute name and the vector contents are
 * rendered using the shared table component.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} props.attribute_name
 * Name of the vector attribute.
 *
 * @param {Object} props.item
 * Entity containing the vector attribute.
 *
 * @returns {JSX.Element}
 * Card displaying the selected vector attribute.
 */
// Exportuje komponentu VectorAttribute, která vykresluje pole samostatně jako ucelenou kartu s označením pole v titulku
export const VectorAttribute = ({ attribute_name, item }) => {
    
    // Bezpečně vyvádí pole dat z objektu na základě dynamického klíče
    const attribute_value = item?.[attribute_name] || [];
    
    // Vrací kartu (kapsli), kde titulek tvoří název klíče s vizuálním symbolem pole '[]', a jejím vnitřkem je tabulka dat
    return (
        <CardCapsule item={item} title={`${attribute_name}[]`}>
            {/* Vykresluje tabulku naplněnou daty z vytaženého pole */}
            <Table data={attribute_value} />
        </CardCapsule>
    ); // Konec návratové hodnoty komponenty VectorAttribute
}; // Konec definice komponenty VectorAttribute

/**
 * Displays all vector attributes of an entity.
 *
 * The component scans all properties of the supplied entity and renders
 * every array-valued property as a separate vector card.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Entity whose vector attributes should be displayed.
 *
 * @returns {JSX.Element}
 * Card containing all detected vector attributes.
 */
// Exportuje sumární komponentu MediumCardVectors, která automaticky projde celý objekt a vykreslí z něj všechna nalezená pole
export const MediumCardVectors = ({ item }) => {
    
    // Vrací hlavní obalovou kartu, uvnitř které se dynamicky vygenerují podřízené tabulky
    return (
        <CardCapsule item={item}>
            
            {/* Převádí objekt na pole dvojic [klíč, hodnota] a iteruje přes ně pomocí metody .map() */}
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                
                // Podmínka: Pokud je aktuálně procházená hodnota typu pole (Array), vykreslí pro ni tabulku
                if (Array.isArray(attribute_value)) {
                    // Vrací komponentu VectorAttribute s unikátním React klíčem a předáním parametrů
                    return <VectorAttribute key={attribute_name} attribute_name={attribute_name} item={item} />;
                } else {
                    // Pokud hodnota není pole (např. řetězec, číslo, jiný objekt), ignoruje ji a vrátí null
                    return null;
                } // Konec podmínky větvení datového typu
            })} {/* Konec dynamické iterace map */}
            
        </CardCapsule> // Konec hlavní obalové karty
    ); // Konec návratové hodnoty komponenty MediumCardVectors
}; // Konec definice komponenty MediumCardVectors