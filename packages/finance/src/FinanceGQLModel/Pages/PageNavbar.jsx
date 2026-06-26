// Importuje navigační komponentu Nav z knihovny react-bootstrap
import Nav from 'react-bootstrap/Nav';

// Importuje lokální komponenty Link a LinkURI z adresáře Components pro klientské odkazování
import { Link, LinkURI } from '../Components';

// Importuje komponentu ProxyLink ze sdílené šablony prvků pro optimalizované vnitřní routování
import { ProxyLink } from '../../../../_template/src/Base/Components/ProxyLink';

// Importuje komponentu rozbalovacího menu NavDropdown z knihovny react-bootstrap
import { NavDropdown } from 'react-bootstrap';

// Importuje komponentu odkazující na úpravu záznamu (UpdateLink) z adresáře Mutations
import { UpdateLink } from '../Mutations/Update';

// Importuje tlačítko pro vyvolání vytvoření nového záznamu (CreateButton) z adresáře Mutations
import { CreateButton } from '../Mutations/Create';

/**
 * Allow to use HashContainer for determination which component at page will be rendered.
 * That must be manually inserted at TemplatePageContent, usually this should be done 
 * as children of TemplateLargeCard.
 * <TemplateLargeCard>
 * <HashContainer>
 * <VectorA id="history"/>
 * <VectorB id="roles"/>
 * <VectorC id="graph"/>
 * </HashContainer>
 * </TemplateLargeCard>
 * it is usefull to define globally active "areas" like science, administration, teaching, ...
 */

/**
 * A navigation bar button component that generates a URL based on the template's ID and a specific segment.
 * The button uses a `ProxyLink` to navigate while preserving hash and query parameters.
 *
 * ### Features:
 * - Dynamically constructs the URL with a hash fragment pointing to the specified segment.
 * - Displays a label for the navigation link.
 * - Integrates seamlessly with `ProxyLink` for enhanced navigation.
 *
 * @component
 * @param {Object} props - The properties for the TitleNavButton component.
 * @param {Object} props.template - The template object containing details about the template.
 * @param {string|number} props.template.id - The unique identifier for the template.
 * @param {string} props.segment - The segment to append as a hash fragment in the URL.
 * @param {string} props.label - The text to display as the label for the navigation button.
 *
 * @returns {JSX.Element} A styled navigation button linking to the constructed URL.
 *
 * @example
 * // Example 1: Basic usage with a template and segment
 * const template = { id: 123 };
 * const segment = "details";
 * const label = "View Details";
 *
 * <TitleNavButton template={template} segment={segment} label={label} />
 * // Resulting URL: `/ug/template/view/123#details`
 *
 * @example
 * // Example 2: Different segment and label
 * <TitleNavButton template={{ id: 456 }} segment="settings" label="Template Settings" />
 * // Resulting URL: `/ug/template/view/456#settings`
 */

/**
 * Renders the navigation bar for an Template page.
 *
 * This component uses a custom hook, `useHash()`, to determine the current hash
 * and highlights the active segment. It displays a navigation bar (using MyNavbar)
 * with several segments (e.g. "history", "roles", "graph"), each rendered as a 
 * TitleNavButton. The segments are hardcoded in this component and only rendered 
 * if an `template` object is provided.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} props.template - The template entity object that provides context for the page.
 * @param {string|number} props.template.id - The unique identifier for the template.
 * @param {Function} props.onSearchChange - Callback function to handle changes in the search input.
 *
 * @returns {JSX.Element} The rendered TemplatePageNavbar component.
 *
 * @example
 * // Example usage:
 * const template = { id: 123, ... };
 * <TemplatePageNavbar template={template} onSearchChange={handleSearchChange} />
 */

// Definuje a exportuje komponentu rozbalovacího navigačního menu MyNavDropdown
export const MyNavDropdown = ({ item }) => {
    
    // Destrukturalizací vytáhne GraphQL typ __typename z objektu item, v případě null/undefined dosadí prázdný objekt
    const { __typename } = item || {};
    
    // Kontroluje, zda má aktuální položka požadovaný systémový datový typ "TemplateGQLModel"
    const hasProperType = __typename === "TemplateGQLModel";

    // Vrací JSX strukturu rozbalovacího menu s titulkem "Skupiny"
    return (
        <NavDropdown title="Skupiny">
            
            {/* Položka menu: odkazující na celkový seznam entit s využitím komponenty ProxyLink ze šablony */}
            <NavDropdown.Item as={ProxyLink} to={VectorItemsURI}>
                Seznam všech 
            </NavDropdown.Item>
            
            {/* Položka menu: směřující na sekci "roles" s ověřením platnosti datového typu položky */}
            <NavDropdown.Item as={Link} item={item} action="roles" disabled={!hasProperType}>
                Role<br /><Link item={item} />
            </NavDropdown.Item>
            
            {/* Položka menu: směřující na sekci "subgroups" s ověřením platnosti datového typu položky */}
            <NavDropdown.Item as={Link} item={item} action="subgroups" disabled={!hasProperType}>
                Podskupiny<br /><Link item={item} />
            </NavDropdown.Item>
            
            {/* Položka menu: směřující na sekci "memberships" s ověřením platnosti datového typu položky */}
            <NavDropdown.Item as={Link} item={item} action="memberships" disabled={!hasProperType}>
                Členové<br /><Link item={item} />
            </NavDropdown.Item>
        
            {/* Vykresluje vodorovnou dělící čáru (separátor) mezi skupinami odkazů v menu */}
            <NavDropdown.Divider />
            
            {/* Položka menu: vykreslená jako UpdateLink pro inline přesměrování na formulář úpravy záznamu */}
            <NavDropdown.Item 
                as={UpdateLink} // Přepisuje vnitřní element na komponentu UpdateLink
                item={item} // Předává upravovaný objekt
                disabled={!hasProperType} // Deaktivuje odkaz, pokud typ neodpovídá schématu
            >
                Upravit<br /><Link item={item} />
            </NavDropdown.Item>
            
            {/* Položka menu: vyrenderovaná jako asynchronní CreateButton pro rychlé vytvoření nového navázaného prvku */}
            <NavDropdown.Item 
                as={CreateButton} // Přepisuje vnitřní element na komponentu CreateButton (vyvolá modal formulář)
                disabled={!hasProperType} // Podmínka zablokování akce
                item={{
                    group: item, // Předdefinuje rodinnou vazbu na aktuální skupinu (group) v novém draftu
                    groupId: item?.groupId // Předdefinuje identifikační klíč nadřazené skupiny v novém draftu
                }} // Konec vnitřního inicializačního objektu item pro CreateButton
            >
                Nové<br /><Link item={item} />
            </NavDropdown.Item>
            
            {/* Vykresluje druhou vodorovnou dělící čáru (separátor) v menu před systémovou sekcí */}
            <NavDropdown.Divider />
            
            {/* Položka menu: odkazující na vývojářské zobrazení systémové definice GraphQL dotazu a odpovědi (action "__def") bez vynucení reloadu dokumentu browserem */}
            <NavDropdown.Item as={ProxyLink} to={`/generic/${item?.__typename}/__def/${item?.id}`} reloadDocument={false}>
                Definice
            </NavDropdown.Item >
        </NavDropdown> // Konec komponenty NavDropdown
    ); // Konec návratové hodnoty komponenty MyNavDropdown
}; // Konec definice komponenty MyNavDropdown