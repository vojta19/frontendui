// Importuje kořenovou URI adresu celého modulu Finance.
import { URIRoot } from "../../uriroot";

// Importuje registrační funkci pro propojení GraphQL modelu s komponentou odkazu.
import { registerLink } from "../../../../_template/src/Base/Components/Link";

// Importuje univerzální komponentu ProxyLink pro klientskou navigaci.
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";


// Sestaví základní URI adresu modelu FinanceGQLModel.
const modelURI = `${URIRoot}/FinanceGQLModel`;

// Definuje URI adresu seznamu financí.
export const ListURI = `${modelURI}/list/`;

// Definuje URI adresu vytvoření nové finance.
export const CreateURI = `${modelURI}/create/`;

// Definuje URI adresu detailu finance.
export const ReadURI = `${modelURI}/view/`;

// Definuje URI adresu editace finance.
export const UpdateURI = `${modelURI}/edit/`;

// Definuje URI adresu odstranění finance.
export const DeleteURI = `${modelURI}/delete/`;

// Nastaví výchozí URI používanou při vytváření odkazů.
export const LinkURI = ReadURI;

// Nastaví URI seznamu používanou napříč modulem.
export const VectorItemsURI = ListURI;

// Definuje parametr identifikátoru používaný v routách.
const idParam = ":id";

// Sestaví URI detailu konkrétní finance.
export const ReadItemURI = `${LinkURI}${idParam}`;

// Sestaví URI editace konkrétní finance.
export const UpdateItemURI = `${UpdateURI}${idParam}`;

// Sestaví URI odstranění konkrétní finance.
export const DeleteItemURI = `${DeleteURI}${idParam}`;


/**
 * Renders a navigation link to a finance entity.
 *
 * The component automatically constructs the destination URL from the
 * configured route and the entity identifier. By default it navigates to
 * the detail page, but any supported action (such as `edit` or `delete`)
 * can be selected through the `action` property.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity used to build the target URL.
 *
 * @param {string} [props.LinkURI=LinkURI]
 * Base URI used when constructing the navigation path.
 *
 * @param {string} [props.action="view"]
 * Target action appended to the generated route.
 *
 * @param {*} [props.children]
 * Optional custom link content. When omitted, the component displays
 * the finance name, identifier or a fallback text.
 *
 * @returns {JSX.Element}
 * Navigation link pointing to the selected finance entity.
 *
 * @example
 * <Link item={finance} />
 *
 * @example
 * <Link item={finance} action="edit">
 *     Upravit
 * </Link>
 */
export const Link = ({
    // Finance, pro kterou bude odkaz vytvořen.
    item,

    // Výchozí základní URI pro navigaci.
    LinkURI: LinkURI_ = LinkURI,

    // Akce určující cílovou stránku (view, edit, delete...).
    action = "view",

    // Volitelný vlastní obsah odkazu.
    children,

    // Ostatní vlastnosti předané komponentě ProxyLink.
    ...props
}) => {

    // Nahradí segment "view" požadovanou akcí.
    const targetURI = LinkURI_.replace("view", action);

    // Vykreslí odkaz na požadovanou stránku finance.
    return (
        <ProxyLink
            // Připojí ID finance za cílovou adresu.
            to={targetURI + item?.id}

            // Předá ostatní vlastnosti komponentě ProxyLink.
            {...props}
        >
            {/* Pokud není zadán vlastní obsah, zobrazí jméno nebo identifikátor finance. */}
            {children || item?.fullname || item?.name || item?.id || "Nevím"}
        </ProxyLink>
    );
};


// Zaregistruje komponentu Link jako výchozí odkaz pro model FinanceGQLModel.
registerLink("FinanceGQLModel", Link);