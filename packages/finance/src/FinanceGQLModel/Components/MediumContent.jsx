// Importuje komponentu Col pro tvorbu sloupcového layoutu ze šablony
import { Col } from "../../../../_template/src/Base/Components/Col";

// Importuje komponentu Row pro tvorbu řádkového layoutu ze šablony
import { Row } from "../../../../_template/src/Base/Components/Row";

// Importuje lokální komponentu Link a přejmenovává ji na ItemLink kvůli zamezení kolizí jmen
import { Link as ItemLink } from "./Link";

// Importuje komponentu ProxyLink pro interní routování projektů a přejmenovává ji na ProjectLink
import { ProxyLink as ProjectLink } from "../../../../_template/src/Base/Components/ProxyLink";

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * * <TemplateMediumContent template={templateEntity}>
 * <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
*/

// Importuje základní komponentu MediumContent ze sdílené šablony jako MediumContent_
import { MediumContent as MediumContent_ } from "../../../../_template/src/Base/Components/MediumContent";

// Importuje sadu komponent a utilit (Attribute, formatDateTime, Link, ProxyLink) ze základních komponent šablony
import { Attribute, formatDateTime, Link, ProxyLink } from "../../../../_template/src/Base/Components";


// Definuje a exportuje novou komponentu MediumContent pro vykreslení strukturovaných atributů finanční položky
export const MediumContent = ({ item, children }) => {
    
    // Vypisuje aktuální objekt do vývojářské konzole pro účely ladění
    console.log("item", item);
    
    // Vrací JSX strukturu složenou z jednotlivých řádků atributů
    return (
        <>
            {/* Blok pro zobrazení primárního českého názvu */}
            <Attribute label="Název">
                {/* Vykresluje komponentu odkazu na samotný detail této položky */}
                <ItemLink item={item} />
            </Attribute>

            {/* Blok pro zobrazení anglického názvu */}
            <Attribute label="EN název">
                {/* Vykresluje odkaz s vlastním vnitřním textem z parametru nameEn */}
                <ItemLink item={item}>
                    {item?.nameEn}
                </ItemLink>
            </Attribute>

            {/* Blok pro zobrazení identifikačního znaku nebo čísla objednávky */}
            <Attribute label="ID">
                {/* Vykresluje odkaz zobrazující přednostně order, následně id, nebo chybovou hlášku */}
                <ItemLink item={item}>
                    {item?.order || item?.id || "Data Error"}
                </ItemLink>
            </Attribute>

            {/* Blok pro zobrazení vazby na nadřazenou finanční entitu */}
            <Attribute label="Nadřazená finance">
                {/* Podmínka: Pokud existuje ID nadřazené finance, vykreslí odkaz, jinak pomlčku */}
                {item?.masterfinanceId ? (
                    <ItemLink item={item?.masterfinance}>
                        {item?.masterfinance?.name} ({item?.masterfinanceId})
                    </ItemLink>
                ) : (
                    "-"
                )}
            </Attribute>

            {/* Vykresluje horizontální oddělovací čáru mezi skupinami systémových a finančních informací */}
            <hr />

            {/* Blok zobrazující informaci o poslední modifikaci položky */}
            <Attribute label="Poslední změna">
                {/* Formátuje timestamp poslední změny do čitelného formátu data a času */}
                {formatDateTime(item?.lastchange)}
                {/* Zobrazuje celé jméno uživatele, který změnu provedl */}
                {item?.changeby?.fullname}
            </Attribute>

            {/* Blok zobrazující datum a čas vytvoření záznamu */}
            <Attribute label="Vytvořeno">
                {/* Formátuje timestamp vytvoření do čitelného formátu data a času */}
                {formatDateTime(item?.created)}
            </Attribute>

            {/* Blok pro zobrazení detailnějšího textového popisu položky */}
            <Attribute label="Popis">
                {/* Vykresluje text popisu uložený v entitě */}
                {item?.description}
            </Attribute>

            {/* Blok pro zobrazení finanční částky */}
            <Attribute label="Částka">
                {/* Podmínka: Pokud je hodnota číslo, naformátuje ji podle českých standardů, jinak vypíše původní hodnotu */}
                {typeof item?.value === "number"
                    ? item.value.toLocaleString("cs-CZ")
                    : item?.value}
            </Attribute>

            {/* Blok pro zobrazení autora záznamu (Uživatel) */}
            <Attribute label="Uživatel">
                {/* Generuje systémový odkaz na uživatele, který záznam vytvořil */}
                <Link item={item?.createdby} />
                {/* Vypisuje celé jméno přiřazeného uživatele */}
                {item?.user?.fullname}
            </Attribute>

            {/* Blok kombinující informaci o autorovi změny a času změny v jednom řádku */}
            <Attribute label="Změnil">
                <>
                    {/* Generuje odkaz na stvořitele záznamu */}
                    <Link item={item?.createdby} />
                    {/* Vypisuje celé jméno uživatele */}
                    {item?.user?.fullname}
                    {/* Vkládá textové lomítko s mezerami jako vizuální oddělovač */}
                    {' / '}
                    {/* Formátuje čas poslední úpravy */}
                    {formatDateTime(item?.lastchange)}
                </>
            </Attribute>

            {/* Blok pro zobrazení navázaného projektu */}
            <Attribute label="Projekt">
                {/* Podmínka: Pokud je k dispozici název projektu, vykreslí speciální ProjectLink s pevnou URL, jinak pomlčku */}
                {item?.project?.name ? (
                    <ProjectLink to={`/projekt/ProjectGQLModel/view/${item?.project?.id}`}>
                        {item?.project?.name}
                    </ProjectLink>
                ) : (
                    "-"
                )}
            </Attribute>
        </>
    ); // Konec návratové hodnoty JSX fragmentu
}; // Konec definice komponenty MediumContent