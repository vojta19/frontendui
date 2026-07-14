import { Link as ItemLink } from "./Link";

import {
    Attribute,
    formatDateTime,
    Link
} from "../../../../_template/src/Base/Components";

import {
    ProxyLink as ProjectLink
} from "../../../../_template/src/Base/Components/ProxyLink";


/**
 * Displays detailed information about a finance entity.
 *
 * The component presents the main scalar and relational attributes of a
 * finance record, including its names, identifier, parent finance, amount,
 * description, audit information and associated project.
 *
 * Links are provided for the current finance, its parent finance, related
 * users and associated project where the required relation data is available.
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
 * Project associated with the finance entity.
 *
 * @param {string} [props.item.project.id]
 * Unique identifier of the associated project.
 *
 * @param {string} [props.item.project.name]
 * Display name of the associated project.
 *
 * @param {React.ReactNode} [props.children]
 * Optional additional content rendered after the finance attributes.
 *
 * @returns {JSX.Element}
 * Structured presentation of the finance entity.
 *
 * @example
 * const finance = {
 *     id: "30000000-0000-0000-0000-000000000003",
 *     name: "Rozpočet WP2",
 *     nameEn: "WP2 Budget",
 *     description: "Rozpočet pracovního balíčku WP2",
 *     value: 900000,
 *     masterfinanceId: "30000000-0000-0000-0000-000000000001",
 *     masterfinance: {
 *         id: "30000000-0000-0000-0000-000000000001",
 *         name: "Celkový rozpočet programu"
 *     },
 *     project: {
 *         id: "project-id",
 *         name: "Projekt modernizace"
 *     }
 * };
 *
 * <MediumContent item={finance} />
 */
export const MediumContent = ({
    item,
    children
}) => {
    const getWpCode = (name = "") => {
        return name
            .match(/\bWP\s*\d+\b/i)?.[0]
            ?.replace(/\s+/g, "")
            .toUpperCase();
    };

    const financeWpCode = getWpCode(item?.name);

    const matchedProject = item?.masterfinance?.project?.subprojects?.find(
        (project) => getWpCode(project?.name) === financeWpCode
    );

    const displayedProject = item?.project ?? matchedProject;

    
    return (
        <>
            <Attribute label="Název">
                <ItemLink item={item} />
            </Attribute>

            <Attribute label="EN název">
                <ItemLink item={item}>
                    {item?.nameEn || "-"}
                </ItemLink>
            </Attribute>

            <Attribute label="ID">
                <ItemLink item={item}>
                    {item?.order || item?.id || "Data Error"}
                </ItemLink>
            </Attribute>

            <Attribute label="Nadřazená finance">
                {item?.masterfinanceId ? (
                    <ItemLink item={item?.masterfinance}>
                        {item?.masterfinance?.name ||
                            item?.masterfinanceId}
                        {" "}
                        ({item?.masterfinanceId})
                    </ItemLink>
                ) : (
                    "-"
                )}
            </Attribute>

            <hr />

            <Attribute label="Poslední změna">
                {item?.lastchange
                    ? formatDateTime(item.lastchange)
                    : "-"}
                {item?.changedby?.fullname
                    ? ` – ${item.changedby.fullname}`
                    : ""}
            </Attribute>

            <Attribute label="Vytvořeno">
                {item?.created
                    ? formatDateTime(item.created)
                    : "-"}
            </Attribute>

            <Attribute label="Popis">
                {item?.description || "-"}
            </Attribute>

            <Attribute label="Částka">
                {typeof item?.value === "number"
                    ? `${item.value.toLocaleString("cs-CZ")} Kč`
                    : item?.value ?? "-"}
            </Attribute>

            <Attribute label="Vytvořil">
                {item?.createdby ? (
                    <Link item={item.createdby}>
                        {item?.createdby?.fullname}
                    </Link>
                ) : (
                    "-"
                )}
            </Attribute>

            <Attribute label="Změnil">
                {item?.changedby ? (
                    <>
                        <Link item={item.changedby}>
                            {item?.changedby?.fullname}
                        </Link>

                        {item?.lastchange && (
                            <>
                                {" / "}
                                {formatDateTime(item.lastchange)}
                            </>
                        )}
                    </>
                ) : (
                    "-"
                )}
            </Attribute>

            <Attribute label="Projekt">
                {displayedProject?.id && displayedProject?.name ? (
                    <ProjectLink
                        to={
                            `/projekt/ProjectGQLModel/view/` +
                            `${displayedProject.id}`
                        }
                    >
                        {displayedProject.name}
                    </ProjectLink>
                ) : (
                    "-"
                )}
            </Attribute>

            {children}
        </>
    );
};