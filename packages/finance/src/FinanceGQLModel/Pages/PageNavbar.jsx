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
 * Displays a context navigation menu for the current finance entity.
 *
 * The component renders a dropdown menu containing the most common actions
 * related to the currently selected finance entity. Depending on the entity
 * type, the menu provides navigation to related pages, editing, creation of
 * new entities and access to the GraphQL definition page.
 *
 * Entity-specific actions are automatically disabled when the supplied entity
 * is not of the expected GraphQL type.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity associated with the navigation menu.
 *
 * @param {string} [props.item.id]
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.__typename]
 * GraphQL type of the supplied entity.
 *
 * @param {string} [props.item.groupId]
 * Identifier of the parent group used when creating related entities.
 *
 * @returns {JSX.Element}
 * Dropdown navigation menu containing actions for the current finance entity.
 *
 * @example
 * <MyNavDropdown item={finance} />
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
                as={UpdateLink}
                item={item}
                disabled={!hasProperType}
            >
                Upravit<br /><Link item={item} />
            </NavDropdown.Item>
            
            {/* Položka menu: vyrenderovaná jako asynchronní CreateButton pro rychlé vytvoření nového navázaného prvku */}
            <NavDropdown.Item
                as={CreateButton}
                disabled={!hasProperType}
                item={{
                    group: item,
                    groupId: item?.groupId
                }}
            >
                Nové<br /><Link item={item} />
            </NavDropdown.Item>
            
            {/* Vykresluje druhou vodorovnou dělící čáru (separátor) v menu před systémovou sekcí */}
            <NavDropdown.Divider />
            
            {/* Položka menu: odkazující na vývojářské zobrazení GraphQL definice entity */}
            <NavDropdown.Item
                as={ProxyLink}
                to={`/generic/${item?.__typename}/__def/${item?.id}`}
                reloadDocument={false}
            >
                Definice
            </NavDropdown.Item>
        </NavDropdown>
    );
};