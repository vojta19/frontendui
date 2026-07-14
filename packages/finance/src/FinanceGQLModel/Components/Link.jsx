// Importuje kořenovou URI adresu celého modulu financí,
// od které se následně skládají všechny ostatní routy.
import { URIRoot } from "../../uriroot";

// Importuje registr odkazů, díky kterému lze komponentu Link
// automaticky používat napříč celou aplikací.
import { registerLink } from "../../../../_template/src/Base/Components/Link";

// Importuje ProxyLink, který zajišťuje interní navigaci v React Routeru
// bez znovunačtení celé stránky.
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";


// Sestaví základní adresu všech rout pro model FinanceGQLModel.
const modelURI = `${URIRoot}/FinanceGQLModel`;

// URI pro zobrazení seznamu všech finančních položek.
export const ListURI = `${modelURI}/list/`;

// URI pro stránku vytvoření nové finance.
export const CreateURI = `${modelURI}/create/`;

// URI pro zobrazení detailu finance.
export const ReadURI = `${modelURI}/view/`;

// URI pro editaci finance.
export const UpdateURI = `${modelURI}/edit/`;

// URI pro odstranění finance.
export const DeleteURI = `${modelURI}/delete/`;

// Výchozí URI používané komponentou Link.
export const LinkURI = ReadURI;

// URI používané komponentami zobrazujícími kolekci financí.
export const VectorItemsURI = ListURI;

// Zástupný parametr reprezentující ID položky v routě.
const idParam = ":id";

// Kompletní routa detailu jedné finance.
export const ReadItemURI = `${LinkURI}${idParam}`;

// Kompletní routa editace jedné finance.
export const UpdateItemURI = `${UpdateURI}${idParam}`;

// Kompletní routa odstranění jedné finance.
export const DeleteItemURI = `${DeleteURI}${idParam}`;


/**
 * Renders a navigation link to a Finance entity.
 *
 * The component automatically constructs the destination URL from the
 * configured route and the entity identifier. By default it navigates to
 * the detail page, but any supported action (such as edit or delete) can
 * be selected through the `action` property.
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
 * Target action appended to the generated route
 * (e.g. `view`, `edit`, `delete`).
 *
 * @param {React.ReactNode} [props.children]
 * Optional custom link content. When omitted, the component displays
 * `fullname`, `name`, `id` or a fallback text.
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
    // Objekt aktuální finanční položky.
    item,

    // Výchozí URI lze v případě potřeby přepsat zvenčí.
    LinkURI: LinkURI_ = LinkURI,

    // Akce určující cílovou stránku (view, edit, delete...).
    action = "view",

    // Vlastní obsah odkazu předaný rodičovskou komponentou.
    children,

    // Zachytí všechny ostatní props (className, style, title...).
    ...props
}) => {

    // Nahrazení části "view" požadovanou akcí.
    // Díky tomu lze stejnou komponentu použít pro více typů navigace.
    const targetURI = LinkURI_.replace("view", action);

    // Vykreslí interní odkaz do aplikace.
    return (
        <ProxyLink
            // K výsledné routě připojí ID aktuální finance.
            to={targetURI + item?.id}

            // Přepošle všechny ostatní vlastnosti komponentě ProxyLink.
            {...props}
        >
            {
                // Priorita zobrazeného textu odkazu:
                // 1) vlastní children,
                // 2) fullname,
                // 3) name,
                // 4) id,
                // 5) záložní text.
                children ||
                item?.fullname ||
                item?.name ||
                item?.id ||
                "Nevím"
            }
        </ProxyLink>
    );
};


// Registruje komponentu Link jako výchozí odkaz
// pro všechny entity typu FinanceGQLModel.
// Díky tomu ji mohou automaticky využívat ostatní části frameworku.
registerLink("FinanceGQLModel", Link);