// Importuje kartu používanou pro seskupení ovládacích prvků a základní URI seznamu financí.
import {
    CardCapsule,
    VectorItemsURI
} from "../Components";

// Import tlačítka pro vytvoření nové finance.
import { CreateButton } from "./Create";

// Import komponent pro úpravu finance.
import {
    UpdateButton,
    UpdateLink
} from "./Update";

// Import tlačítka pro odstranění finance.
import { DeleteButton } from "./Delete";

// Import komponenty zajišťující interní navigaci v aplikaci.
import {
    ProxyLink
} from "../../../../_template/src/Base/Components/ProxyLink";


/**
 * Renders a navigation link to the main finance collection page.
 *
 * The link uses the configured `VectorItemsURI` and can optionally preserve
 * the current URL hash and query string.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ReactNode} props.children
 * Content rendered inside the navigation link.
 *
 * @param {boolean} [props.preserveHash=true]
 * Determines whether the current URL hash should be preserved.
 *
 * @param {boolean} [props.preserveSearch=true]
 * Determines whether the current query string should be preserved.
 *
 * @returns {JSX.Element}
 * Navigation link to the finance list page.
 *
 * @example
 * <PageLink className="btn btn-outline-success">
 *     Stránka
 * </PageLink>
 */
export const PageLink = ({
    // Text nebo obsah odkazu.
    children,

    // Zachování části URL za znakem #.
    preserveHash = true,

    // Zachování parametrů URL (?param=value).
    preserveSearch = true,

    // Ostatní vlastnosti komponenty.
    ...props
}) => {
    return (
        // ProxyLink zajistí interní přechod na stránku seznamu financí.
        <ProxyLink
            // Cílová adresa seznamu financí.
            to={VectorItemsURI}

            // Zachová hash původní adresy.
            preserveHash={preserveHash}

            // Zachová query parametry původní adresy.
            preserveSearch={preserveSearch}

            // Přepošle ostatní vlastnosti (např. className).
            {...props}
        >
            {/* Obsah odkazu zadaný při použití komponenty. */}
            {children}
        </ProxyLink>
    );
};


/**
 * Displays the interactive mutation controls for a finance entity.
 *
 * The component groups the primary finance actions into a single tools card.
 * Available operations include:
 *
 * - navigation to the finance list,
 * - opening the full edit page,
 * - opening the inline edit dialog,
 * - opening the create dialog,
 * - deleting the current finance entity.
 *
 * Permission handling for individual actions is delegated to the imported
 * mutation components.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity for which the mutation controls are displayed.
 *
 * @param {string} props.item.id
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Display name of the finance entity.
 *
 * @param {Object} [props.item.rbacobject]
 * RBAC object used by permission-aware mutation controls.
 *
 * @returns {JSX.Element}
 * Tools card containing finance navigation and mutation controls.
 *
 * @example
 * <InteractiveMutations
 *     item={{
 *         id: "30000000-0000-0000-0000-000000000003",
 *         name: "Rozpočet WP2"
 *     }}
 * />
 */
export const InteractiveMutations = ({
    // Aktuální finance, nad kterou budou prováděny jednotlivé operace.
    item
}) => {
    return (
        // Obalová karta seskupující všechny dostupné akce.
        <CardCapsule
            // Předání aktuální finance kartě.
            item={item}

            // Vlastní nadpis karty místo automatického titulku.
            title="Nástroje"
        >
            {/* Odkaz zpět na seznam všech financí. */}
            <PageLink
                className="btn btn-outline-success"
            >
                Stránka
            </PageLink>

            {/* Přechod na samostatnou stránku editace finance. */}
            <UpdateLink
                className="btn btn-outline-success"
                item={item}
            >
                Upravit
            </UpdateLink>

            {/* Otevření modálního dialogu pro editaci finance. */}
            <UpdateButton
                className="btn btn-outline-success"
                item={item}
            >
                Upravit dialog
            </UpdateButton>

            {/* Otevření dialogu pro vytvoření nové finance. */}
            <CreateButton
                className="btn btn-outline-success"

                // Prázdný RBAC objekt sloužící jako výchozí kontext pro vytvoření nové entity.
                rbacitem={{}}
            >
                Vytvořit nový
            </CreateButton>

            {/* Tlačítko pro odstranění aktuální finance. */}
            <DeleteButton
                className="btn btn-outline-danger"
                item={item}
            >
                Odstranit
            </DeleteButton>
        </CardCapsule>
    );
};