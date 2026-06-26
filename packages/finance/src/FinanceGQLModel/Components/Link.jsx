// Importuje základní kořenovou URL adresu pro API / URI cesty
import { URIRoot } from "../../uriroot";

// Importuje funkci pro registraci odkazů do globálního registru komponent
import { registerLink } from "../../../../_template/src/Base/Components/Link";

// Importuje komponentu ProxyLink, která zajišťuje bezpečné a optimalizované přesměrování v aplikaci
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";

// Skládá základní URI pro model financí spojením kořenové URI a názvu modelu
const modelURI = `${URIRoot}/FinanceGQLModel`;

// Definuje a exportuje URI pro načtení seznamu (list) položek finančního modelu
export const ListURI = `${modelURI}/list/`;

// Definuje a exportuje URI pro vytvoření (create) nové položky finančního modelu
export const CreateURI = `${modelURI}/create/`;

// Definuje a exportuje URI pro zobrazení/čtení (view) detailu položky finančního modelu
export const ReadURI = `${modelURI}/view/`;

// Definuje a exportuje URI pro úpravu (edit) položky finančního modelu
export const UpdateURI = `${modelURI}/edit/`;

// Definuje a exportuje URI pro smazání (delete) položky finančního modelu
export const DeleteURI = `${modelURI}/delete/`;

// Nastavuje výchozí URI pro odkazy, která v tomto případě odpovídá URI pro čtení (ReadURI)
export const LinkURI = ReadURI;

// Nastavuje URI pro vektorové položky, která odpovídá základnímu seznamu (ListURI)
export const VectorItemsURI = ListURI;

// Definuje řetězec, který reprezentuje zástupný symbol (parametr) pro ID v URL adrese
const idParam = ":id";

// Skládá výslednou URI pro detail konkrétní položky přidáním parametru ID k výchozí LinkURI
export const ReadItemURI = `${LinkURI}${idParam}`;

// Skládá výslednou URI pro úpravu konkrétní položky přidáním parametru ID k UpdateURI
export const UpdateItemURI = `${UpdateURI}${idParam}`;

// Skládá výslednou URI pro smazání konkrétní položky přidáním parametru ID k DeleteURI
export const DeleteItemURI = `${DeleteURI}${idParam}`;

/**
 * A React component that renders a `ProxyLink` to an "template" entity's view page.
 *
 * The target URL is dynamically constructed using the `template` object's `id`, and the link displays
 * the `template` object's `name` as its clickable content.
 *
 * @function TemplateLink
 * @param {Object} props - The properties for the `TemplateLink` component.
 * @param {Object} props.template - The object representing the "template" entity.
 * @param {string|number} props.template.id - The unique identifier for the "template" entity. Used to construct the target URL.
 * @param {string} props.template.name - The display name for the "template" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "template" entity's view page.
 *
 * @example
 * // Example usage with a sample template entity:
 * const templateEntity = { id: 123, name: "Example Template Entity" };
 * * <TemplateLink template={templateEntity} />
 * // Renders: <ProxyLink to="/template/template/view/123">Example Template Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/template/template/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
// Definuje a exportuje React komponentu Link, která generuje dynamické odkazy na základě předaných vlastností (props)
export const Link = ({ item, LinkURI: LinkURI_ = LinkURI, action = "view", children, ...props }) => {
    
    // Dynamicky upravuje cílovou URL nahrazením slova 'view' za požadovanou akci (např. edit, list)
    const targetURI = LinkURI_.replace('view', action);
    
    // Vrací komponentu ProxyLink se složenou URL adresou (cesta + ID položky) a textem odkazu (podle priority: children -> fullname -> name -> id -> "Nevim")
    return (
        <ProxyLink to={targetURI + item?.id} {...props}>
            {children || item?.fullname || item?.name || item?.id || "Nevim"}
        </ProxyLink>
    );
};

// Registruje tuto komponentu Link do systému pod klíčem 'FinanceGQLModel', aby ji aplikace mohla automaticky používat pro tento model
registerLink('FinanceGQLModel', Link);