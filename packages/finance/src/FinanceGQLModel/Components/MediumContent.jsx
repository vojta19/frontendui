// Importuje finance-specifickou komponentu odkazu a přejmenovává ji na ItemLink.
import { Link as ItemLink } from "./Link";

// Importuje komponentu pro zobrazení atributu, formátování data a obecný odkaz.
import {
    Attribute,
    formatDateTime,
    Link
} from "../../../../_template/src/Base/Components";

// Importuje univerzální interní odkaz a přejmenovává ho na ProjectLink.
import {
    ProxyLink as ProjectLink
} from "../../../../_template/src/Base/Components/ProxyLink";


/**
 * Displays detailed information about a finance entity.
 *
 * The component presents the main scalar, relational and audit attributes
 * of a finance record, including its names, identifier, parent finance,
 * amount, description, timestamps, users and associated project.
 *
 * If the finance entity does not contain a direct project relation, the
 * component attempts to determine the corresponding project from the
 * subprojects of the parent finance. The matching is based on the work
 * package code contained in the finance and project names, for example
 * `WP1`, `WP2` or `WP3`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity to display.
 *
 * @param {string} props.item.id
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Czech name of the finance entity.
 *
 * @param {string} [props.item.nameEn]
 * English name of the finance entity.
 *
 * @param {string|number} [props.item.order]
 * Optional order or alternative display identifier.
 *
 * @param {string} [props.item.description]
 * Textual description of the finance entity.
 *
 * @param {number} [props.item.value]
 * Current financial amount assigned to the entity.
 *
 * @param {string} [props.item.lastchange]
 * Date and time of the most recent modification.
 *
 * @param {string} [props.item.created]
 * Date and time when the finance entity was created.
 *
 * @param {string} [props.item.masterfinanceId]
 * Identifier of the parent finance entity.
 *
 * @param {Object} [props.item.masterfinance]
 * Parent finance entity.
 *
 * @param {string} [props.item.masterfinance.id]
 * Identifier of the parent finance.
 *
 * @param {string} [props.item.masterfinance.name]
 * Display name of the parent finance.
 *
 * @param {Object} [props.item.masterfinance.project]
 * Project associated with the parent finance.
 *
 * @param {Array<Object>} [props.item.masterfinance.project.subprojects]
 * Subprojects used for fallback project matching.
 *
 * @param {Object} [props.item.createdby]
 * User who created the finance record.
 *
 * @param {string} [props.item.createdby.id]
 * Identifier of the creating user.
 *
 * @param {string} [props.item.createdby.fullname]
 * Full name of the creating user.
 *
 * @param {Object} [props.item.changedby]
 * User who last modified the finance record.
 *
 * @param {string} [props.item.changedby.id]
 * Identifier of the modifying user.
 *
 * @param {string} [props.item.changedby.fullname]
 * Full name of the modifying user.
 *
 * @param {Object} [props.item.project]
 * Project directly associated with the finance entity.
 *
 * @param {string} [props.item.project.id]
 * Unique identifier of the associated project.
 *
 * @param {string} [props.item.project.name]
 * Display name of the associated project.
 *
 * @param {*} [props.children]
 * Optional additional content rendered after the finance attributes.
 *
 * @returns {JSX.Element}
 * Structured presentation of the finance entity.
 *
 * @example
 * <MediumContent item={finance} />
 */
export const MediumContent = ({
    // Finance entita, jejíž data se mají zobrazit.
    item,

    // Volitelný obsah vykreslený za standardními atributy.
    children
}) => {
    /**
    * Extracts a normalized work package code from a name.
    *
    * The helper searches for values such as `WP1`, `WP 2` or `wp3`
    * and returns the normalized uppercase form without spaces.
    *
    * @param {string} [name=""]
    * Finance or project name.
    *
    * @returns {string|undefined}
    * Normalized work package code or `undefined` when no code is found.
    */
    const getWpCode = (name = "") => {
        // Vyhledá označení pracovního balíčku ve formátu WP a číslo.
        return name
            .match(/\bWP\s*\d+\b/i)?.[0]

            // Odstraní případné mezery mezi WP a číslem.
            ?.replace(/\s+/g, "")

            // Převede výsledek na jednotný zápis velkými písmeny.
            .toUpperCase();
    };

    // Z názvu finance získá kód pracovního balíčku, například WP1 nebo WP2.
    const financeWpCode = getWpCode(item?.name);

    // V podprojektech nadřazené finance hledá projekt se stejným WP kódem.
    const matchedProject = item?.masterfinance?.project?.subprojects?.find(
        (project) => getWpCode(project?.name) === financeWpCode
    );

    // Přednostně použije projekt přímo uložený u finance.
    // Pokud chybí, použije projekt nalezený podle WP kódu.
    const displayedProject = item?.project ?? matchedProject;

    
    return (
        <>
            {/* Zobrazuje český název finance jako odkaz na její detail. */}
            <Attribute label="Název">
                <ItemLink item={item} />
            </Attribute>

            {/* Zobrazuje anglický název finance nebo pomlčku při chybějící hodnotě. */}
            <Attribute label="EN název">
                <ItemLink item={item}>
                    {item?.nameEn || "-"}
                </ItemLink>
            </Attribute>

            {/* Zobrazuje pořadí nebo unikátní identifikátor finance. */}
            <Attribute label="ID">
                <ItemLink item={item}>
                    {item?.order || item?.id || "Data Error"}
                </ItemLink>
            </Attribute>

            {/* Zobrazuje nadřazenou finance včetně jejího názvu a ID. */}
            <Attribute label="Nadřazená finance">
                {item?.masterfinanceId ? (
                    <ItemLink item={item?.masterfinance}>
                        {item?.masterfinance?.name ||
                            item?.masterfinanceId}
                        {" "}
                        ({item?.masterfinanceId})
                    </ItemLink>
                ) : (
                    // Kořenová finance nemá žádnou nadřazenou položku.
                    "-"
                )}
            </Attribute>

            {/* Vizuálně odděluje základní údaje od auditních a doplňkových informací. */}
            <hr />

            {/* Zobrazuje datum a čas poslední změny finance. */}
            <Attribute label="Poslední změna">
                {item?.lastchange
                    ? formatDateTime(item.lastchange)
                    : "-"}
            </Attribute>

            {/* Zobrazuje datum a čas vytvoření finančního záznamu. */}
            <Attribute label="Vytvořeno">
                {item?.created
                    ? formatDateTime(item.created)
                    : "-"}
            </Attribute>

            {/* Zobrazuje textový popis finance nebo pomlčku. */}
            <Attribute label="Popis">
                {item?.description || "-"}
            </Attribute>

            {/* Zobrazuje finanční částku v českém formátu s měnou Kč. */}
            <Attribute label="Částka">
                {typeof item?.value === "number"
                    ? `${item.value.toLocaleString("cs-CZ")} Kč`
                    : item?.value ?? "-"}
            </Attribute>

            {/* Zobrazuje uživatele, který finanční záznam vytvořil. */}
            <Attribute label="Vytvořil">
                {item?.createdby ? (
                    <Link item={item.createdby}>
                        {item?.createdby?.fullname}
                    </Link>
                ) : (
                    "-"
                )}
            </Attribute>


            {/* Zobrazuje přímo přiřazený nebo automaticky nalezený projekt. */}
            <Attribute label="Projekt">
                {displayedProject?.id && displayedProject?.name ? (
                    <ProjectLink
                        // Sestavuje odkaz na detail nalezeného projektu.
                        to={
                            `/projekt/ProjectGQLModel/view/` +
                            `${displayedProject.id}`
                        }
                    >
                        {displayedProject.name}
                    </ProjectLink>
                ) : (
                    // Pokud není projekt nalezen, zobrazí se pomlčka.
                    "-"
                )}
            </Attribute>

            {/* Vykreslí případný další obsah předaný rodičovskou komponentou. */}
            {children}
        </>
    );
};