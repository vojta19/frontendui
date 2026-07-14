// Import lokální komponenty Link přejmenované na ItemLink,
// která vytváří odkazy na detail finanční položky.
import { Link as ItemLink } from "./Link";

// Import sdílených komponent pro vykreslení atributů,
// formátování data a generování odkazů na systémové entity.
import {
    Attribute,
    formatDateTime,
    Link
} from "../../../../_template/src/Base/Components";

// Import komponenty ProxyLink přejmenované na ProjectLink,
// která slouží pro navigaci na detail projektu.
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
 * ...
 */
export const MediumContent = ({
    // Aktuální finanční položka zobrazená na stránce.
    item,

    // Volitelný obsah připojený za standardní výpis atributů.
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

    console.log("FINANCE WP:", financeWpCode);
    console.log("MATCHED PROJECT:", matchedProject);

    console.log("FINANCE WP:", financeWpCode);
    console.log("MATCHED PROJECT:", matchedProject);
    return (
        <>
            {/* Český název finanční položky s odkazem na její detail. */}
            <Attribute label="Název">
                <ItemLink item={item} />
            </Attribute>

            {/* Anglický název finance.
                Pokud není vyplněn, zobrazí se pomlčka. */}
            <Attribute label="EN název">
                <ItemLink item={item}>
                    {item?.nameEn || "-"}
                </ItemLink>
            </Attribute>

            {/* Primární identifikátor finance.
                Pokud existuje pořadové číslo (order), zobrazí se přednostně. */}
            <Attribute label="ID">
                <ItemLink item={item}>
                    {item?.order || item?.id || "Data Error"}
                </ItemLink>
            </Attribute>

            {/* Informace o nadřazené finanční položce. */}
            <Attribute label="Nadřazená finance">
                {item?.masterfinanceId ? (
                    // Pokud nadřazená finance existuje,
                    // zobrazí se jako klikací odkaz.
                    <ItemLink item={item?.masterfinance}>

                        {/* Název nadřazené finance,
                            případně pouze její ID. */}
                        {item?.masterfinance?.name ||
                            item?.masterfinanceId}

                        {" "}

                        {/* V závorce se vždy vypíše ID nadřazené finance. */}
                        ({item?.masterfinanceId})
                    </ItemLink>
                ) : (
                    // Pokud finance nemá rodiče, zobrazí se pomlčka.
                    "-"
                )}
            </Attribute>

            {/* Oddělení základních identifikačních údajů
                od auditních a doplňkových informací. */}
            <hr />

            {/* Datum poslední změny a uživatel,
                který změnu provedl. */}
            <Attribute label="Poslední změna">
                {
                    item?.lastchange
                        ? formatDateTime(item.lastchange)
                        : "-"
                }
            </Attribute>

            {/* Datum vytvoření finanční položky. */}
            <Attribute label="Vytvořeno">
                {
                    item?.created
                        ? formatDateTime(item.created)
                        : "-"
                }
            </Attribute>

            {/* Textový popis finanční položky. */}
            <Attribute label="Popis">
                {item?.description || "-"}
            </Attribute>

            {/* Finanční částka.
                Číselná hodnota se naformátuje podle české lokalizace
                a doplní měnovou jednotkou Kč. */}
            <Attribute label="Částka">
                {
                    typeof item?.value === "number"
                        ? `${item.value.toLocaleString("cs-CZ")} Kč`
                        : item?.value ?? "-"
                }
            </Attribute>

            {/* Uživatel, který finanční položku vytvořil. */}
            <Attribute label="Vytvořil">
                {
                    item?.createdby ? (
                        <Link item={item.createdby}>
                            {item?.createdby?.fullname}
                        </Link>
                    ) : (
                        "-"
                    )
                }
            </Attribute>

            {/* Uživatel, který provedl poslední změnu,
                společně s časem změny. */}
            <Attribute label="Změnil">
                {
                    item?.changedby ? (
                        <>
                            {/* Klikací odkaz na uživatele,
                                který finance naposledy upravil. */}
                            <Link item={item.changedby}>
                                {item?.changedby?.fullname}
                            </Link>

                            {/* Pokud existuje datum změny,
                                vypíše se za lomítkem. */}
                            {item?.lastchange && (
                                <>
                                    {" / "}
                                    {formatDateTime(item.lastchange)}
                                </>
                            )}
                        </>
                    ) : (
                        "-"
                    )
                }
            </Attribute>

            {/* Navázaný projekt,
                pokud je finanční položka přiřazena k projektu. */}
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

            {/* Doplňkový obsah předaný z nadřazené komponenty,
                například další atributy nebo vlastní sekce. */}
            {children}
        </>
    );
};