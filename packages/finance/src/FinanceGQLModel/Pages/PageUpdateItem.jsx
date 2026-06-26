// Importuje komponentu UpdateBody (celostránkový formulář pro úpravu entity) z lokálního adresáře Mutations
import { UpdateBody } from "../Mutations/Update";

// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";

/**
 * Component for rendering the full-page edit/update workflow for a specific entity item.
 *
 * This is a page-level wrapper that relies on `PageItemBase` to handle the URL parameters (:id),
 * fetch the entity via the GraphQL provider, and provide context to inner elements. It passes 
 * `UpdateBody` as the sub-page layout to display the interactive inputs and handle form submission.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ComponentType} [props.SubPage=UpdateBody] - The inner layout or workflow component to render.
 * @param {...any} [props] - Additional properties forwarded directly to `PageItemBase`.
 *
 * @returns {JSX.Element} The rendered page skeleton wrapped around the cell-page update body.
 */
// Definuje a exportuje komponentu PageUpdateItem reprezentující celou stránku pro úpravu a editaci záznamu
export const PageUpdateItem = ({ 
    SubPage = UpdateBody, // Nastavuje celostránkový editační formulář (UpdateBody) jako výchozí podstránku layoutu
    ...props // Zachytává všechny ostatní vlastnosti (např. custom thunky, navigační lišty) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku (PageItemBase), které předává nakonfigurovanou SubPage a zbylé parametry
    return (
        <PageItemBase 
            SubPage={SubPage} // Registruje celostránkovou editaci do základní stránky
            {...props} // Rozbaluje všechny ostatní parametry přímo na komponentu
        />
    ); // Konec návratové hodnoty komponenty PageUpdateItem
}; // Konec definice komponenty PageUpdateItem