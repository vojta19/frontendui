import { registerLink } from "../../Base/Components/Link";
import { TemplateUI } from "../../Template";
import { URIRoot } from "../../uriroot";

export const LinkURI = `${URIRoot}/role/view/`;

/**
 * Link komponenta pro RoleGQLModel entity.
 *
 * Používá TemplateUI.Link jako základní komponentu pro vykreslení odkazu.
 */
export const Link = ({ item, children }) => {
    const typename = item?.roletype?.name || "Chybí data";
    return (
        <TemplateUI.Link LinkURI={LinkURI} item={item}>{children || item?.roletype?.name || "Chybí data"}</TemplateUI.Link>
    );
}
registerLink("RoleGQLModel", Link);