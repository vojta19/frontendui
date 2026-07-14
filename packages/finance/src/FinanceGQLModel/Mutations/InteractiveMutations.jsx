// Importuje komponenty pro zobrazení karty a URI seznamu financí.
import {
    CardCapsule, // Importuje komponentu pro vizuální obalení prvků do karty s titulkem
    VectorItemsURI // Importuje konstantu s URI cestou pro kolekci finančních entit
} from "../Components"; // Relativní import ze složky komponent

// Importuje tlačítko pro vytvoření nové finance entity.
import { CreateButton } from "./Create"; // Importuje tlačítko pro vyvolání akce vytvoření nového záznamu

// Importuje tlačítka a odkazy pro úpravu finance entity.
import {
    UpdateButton, // Importuje komponentu tlačítka pro úpravu (např. přes modální dialog)
    UpdateLink // Importuje komponentu odkazu pro přechod na stránku úprav
} from "./Update"; // Relativní import ze složky Update mutací

// Importuje tlačítko pro odstranění finance entity.
import { DeleteButton } from "./Delete"; // Importuje komponentu tlačítka pro smazání záznamu

// Importuje obecný komponent pro navigační odkaz s podporou proxy routování.
import {
    ProxyLink // Importuje komponentu pro bezpečné odkazování v rámci frontendové architektury
} from "../../../../_template/src/Base/Components/ProxyLink"; // Relativní cesta k základním sdíleným komponentám


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
 * @param {*} props.children
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
export const PageLink = ({ // Exportuje komponentu PageLink pro navigaci na hlavní seznam
    children, // Destrukturalizuje dceřiné elementy (text nebo ikona) z vlastností (props)
    preserveHash = true, // Nastavuje výchozí hodnotu pro zachování hashe v URL na true
    preserveSearch = true, // Nastavuje výchozí hodnotu pro zachování query parametrů na true
    ...props // Shromažďuje všechny ostatní předané vlastnosti (např. className, style) do objektu props
}) => { // Začátek těla komponenty PageLink
    return ( // Vrací JSX element k vykreslení
        <ProxyLink // Vykreslí obalový navigační odkaz ProxyLink
            to={VectorItemsURI} // Nastavuje cílovou adresu odkazu na seznam financí
            preserveHash={preserveHash} // Předává nastavení zachování hashe v URL
            preserveSearch={preserveSearch} // Předává nastavení zachování vyhledávacího řetězce
            {...props} // Rozbaluje a předává všechny doplňující vlastnosti na element ProxyLink
        > {/* Konec úvodního tagu ProxyLink */}
            {children} {/* Vykreslí vnitřní text nebo elementy uvnitř odkazu */}
        </ProxyLink> // Konec komponenty ProxyLink
    ); // Konec return bloku
}; // Konec komponenty PageLink


/**
 * Displays the interactive mutation controls for a finance entity.
 *
 * The component groups the available finance operations into a single
 * tools card. Depending on the user's permissions, it provides access
 * to navigation, editing, creation and deletion actions.
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
 * RBAC object used by the permission-aware mutation controls.
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
export const InteractiveMutations = ({ // Exportuje komponentu InteractiveMutations pro akční panel entity
    item // Destrukturalizuje objekt aktuální finanční entity (item) z vlastností
}) => { // Začátek těla komponenty InteractiveMutations
    return ( // Vrací JSX strukturu k vykreslení
        <CardCapsule // Vykreslí kartu s akčními nástroji
            item={item} // Předává aktuální entitu pro vnitřní logiku karty
            title="Nástroje" // Nastavuje nadpis karty na "Nástroje"
        > {/* Konec úvodního tagu CardCapsule */}
            <PageLink // Vykreslí dříve definovaný odkaz na hlavní seznam
                className="btn btn-outline-success" // Nastavuje zelený obrysový vzhled tlačítka pomocí Bootstrapu
            > {/* Konec úvodního tagu PageLink */}
                Stránka {/* Text zobrazený na tlačítku */}
            </PageLink> {/* Konec komponenty PageLink */}

            <UpdateLink // Vykreslí odkaz pro přechod na formulář úpravy entity
                className="btn btn-outline-success" // Nastavuje zelený obrysový vzhled tlačítka
                item={item} // Předává objekt upravované entity
            > {/* Konec úvodního tagu UpdateLink */}
                Upravit {/* Text zobrazený na tlačítku */}
            </UpdateLink> {/* Konec komponenty UpdateLink */}

            <UpdateButton // Vykreslí tlačítko, které typicky otevírá modální okno pro úpravu
                className="btn btn-outline-success" // Nastavuje zelený obrysový vzhled tlačítka
                item={item} // Předává objekt upravované entity
            > {/* Konec úvodního tagu UpdateButton */}
                Upravit dialog {/* Text zobrazený na tlačítku */}
            </UpdateButton> {/* Konec komponenty UpdateButton */}

            <CreateButton // Vykreslí tlačítko pro vytvoření nového záznamu
                className="btn btn-outline-success" // Nastavuje zelený obrysový vzhled tlačítka
                rbacitem={{}} // Předává prázdný objekt práv (povolí vytvoření nezávisle na kontextu)
            > {/* Konec úvodního tagu CreateButton */}
                Vytvořit nový {/* Text zobrazený na tlačítku */}
            </CreateButton> {/* Konec komponenty CreateButton */}

            <DeleteButton // Vykreslí tlačítko pro smazání vybrané finanční entity
                className="btn btn-outline-danger" // Nastavuje červené obrysový varovné tlačítko
                item={item} // Předává objekt mazané entity
            > {/* Konec úvodního tagu DeleteButton */}
                Odstranit {/* Text zobrazený na tlačítku */}
            </DeleteButton> {/* Konec komponenty DeleteButton */}
        </CardCapsule> // Konec karty CardCapsule
    ); // Konec return bloku
}; // Konec komponenty InteractiveMutations