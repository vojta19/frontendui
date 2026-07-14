// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";

// Importuje komponentu DeleteBody (celostránkový workflow pro smazání entity) z lokálního adresáře Mutations
import { DeleteBody } from "../Mutations/Delete";

/**
 * Displays the full-page workflow for deleting a finance entity.
 *
 * The component wraps `PageItemBase` and injects the finance-specific
 * delete workflow (`DeleteBody`) as the page content. `PageItemBase`
 * is responsible for loading the entity identified by the route
 * parameter and providing it to the delete page.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ComponentType<Object>} [props.SubPage=DeleteBody]
 * Component responsible for rendering the delete workflow.
 *
 * @param {*} [props]
 * Additional properties forwarded directly to `PageItemBase`.
 *
 * @returns {JSX.Element}
 * Full-page interface for deleting a finance entity.
 *
 * @example
 * <PageDeleteItem />
 */
// Definuje a exportuje komponentu PageDeleteItem reprezentující celou stránku pro odstranění záznamu
export const PageDeleteItem = ({ 
    SubPage = DeleteBody, // Nastavuje celostránkové mazání (DeleteBody) jako výchozí podstránku layoutu
    ...props // Zachytává všechny ostatní vlastnosti (např. thunky, item, rbac) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku (PageItemBase), které předává nakonfigurovanou SubPage a zbylé parametry
    return (
        <PageItemBase
            SubPage={SubPage} // Registruje celostránkové mazání do základní stránky
            {...props} // Rozbaluje všechny ostatní parametry přímo na komponentu
        />
    ); // Konec návratové hodnoty komponenty PageDeleteItem
}; // Konec definice komponenty PageDeleteItem