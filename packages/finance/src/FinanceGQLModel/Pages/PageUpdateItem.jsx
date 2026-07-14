// Importuje komponentu UpdateBody (celostránkový formulář pro úpravu entity) z lokálního adresáře Mutations
import { UpdateBody } from "../Mutations/Update";

// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";


/**
 * Displays the full-page editing workflow for a finance entity.
 *
 * The component is a lightweight wrapper around `PageItemBase`.
 * It configures the page to use `UpdateBody` as the default content,
 * providing a complete editing interface for the selected finance entity.
 *
 * All remaining properties are forwarded directly to `PageItemBase`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ComponentType} [props.SubPage=UpdateBody]
 * Component rendered as the page content. By default, the finance update
 * workflow (`UpdateBody`) is used.
 *
 * @param {React.ReactNode} [props.children]
 * Optional child components forwarded to `PageItemBase`.
 *
 * @returns {JSX.Element}
 * Full-page finance editing interface.
 *
 * @example
 * <PageUpdateItem />
 *
 * @example
 * <PageUpdateItem
 *     SubPage={CustomUpdateBody}
 * />
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