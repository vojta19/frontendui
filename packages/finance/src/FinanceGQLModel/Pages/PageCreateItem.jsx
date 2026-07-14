// Importuje výchozí asynchronní síťovou akci (thunk) pro načítání dat záznamu ze souboru Queries
import { ReadAsyncAction } from "../Queries";

// Importuje layout komponentu Row pro definici řádků flexibilní mřížky ze šablony
import { Row } from "../../../../_template/src/Base/Components/Row";

// Importuje komponentu CreateBody (celostránkový formulář pro vytvoření entity) z lokálního adresáře Mutations
import { CreateBody } from "../Mutations/Create";

// Importuje předdefinované layoutové sloupce (LeftColumn, MiddleColumn) ze sdíleného balíčku frontend utilit
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared";

// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";

/**
 * Internal page layout used for the finance creation page.
 *
 * The component arranges the page into a two-column layout using the
 * shared layout components. The main content area hosts the
 * `CreateBody` component, which provides the finance creation workflow.
 *
 * @component
 *
 * @param {Object} props
 * Properties forwarded directly to `CreateBody`.
 *
 * @returns {JSX.Element}
 * Two-column layout containing the finance creation form.
 */
// Definuje vnitřní layout komponentu PageBody, která rozřazuje obsah formuláře do dvousloupcové mřížky
const PageBody = ({ ...props }) => (
    // Obaluje sloupce do jednoho řádku mřížky
    <Row>
        {/* Vykresluje levý postranní sloupec (např. pro navigaci nebo boční panely) */}
        <LeftColumn />
        
        {/* Vykresluje hlavní středový sloupec, do kterého vkládá celostránkový formulář CreateBody a předává mu všechny props */}
        <MiddleColumn>
            <CreateBody {...props} />
        </MiddleColumn>
    </Row>
); // Konec definice komponenty PageBody

/**
 * Displays the full-page workflow for creating a new finance entity.
 *
 * The component wraps `PageItemBase` and injects the finance creation
 * layout (`PageBody`) as the page content. The layout provides a
 * two-column page with the finance creation form rendered in the
 * main content area.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ComponentType<Object>} [props.SubPage=PageBody]
 * Component responsible for rendering the page content.
 *
 * @param {*} [props]
 * Additional properties forwarded directly to `PageItemBase`.
 *
 * @returns {JSX.Element}
 * Full-page interface for creating a finance entity.
 *
 * @example
 * <PageCreateItem />
 */
// Definuje a exportuje hlavní komponentu PageCreateItem reprezentující celou stránku pro vytvoření nového záznamu
export const PageCreateItem = ({ 
    SubPage = PageBody, // Nastavuje dříve definovanou komponentu PageBody jako výchozí podstránku layoutu
    ...props // Zachytává všechny ostatní vlastnosti (jako jsou thunky, rbac nastavení nebo children) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku (PageItemBase), které předává nakonfigurovanou SubPage a zbylé parametry
    return (
        <PageItemBase 
            SubPage={SubPage} // Registruje dvousloupcový layout s formulářem do základní stránky
            {...props} // Rozbaluje všechny ostatní parametry přímo na komponentu
        />
    ); // Konec návratové hodnoty komponenty PageCreateItem
}; // Konec definice komponenty PageCreateItem