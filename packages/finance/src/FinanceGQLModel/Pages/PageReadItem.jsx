// Importuje komponentu GeneratedContentBase (která zajišťuje načítání přesunů a výpočet grafu) z lokálního souboru Page
import { GeneratedContentBase } from "./Page";

// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";

/**
 * Component for rendering a read-only view page of a specific entity item.
 *
 * This is a page-level component that utilizes `PageItemBase` as its core layout wrapper.
 * By default, it registers `GeneratedContentBase` as its sub-page content, which handles 
 * the data patching, transaction tracking, and the rendering of the interactive Sunburst diagram.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ComponentType} [props.SubPage=GeneratedContentBase] - The inner content/layout component to render.
 * @param {...any} [props] - Additional properties forwarded directly to `PageItemBase` (e.g., queryAsyncAction, PageNavbar).
 *
 * @returns {JSX.Element} The rendered page skeleton wrapped around the data visualization sub-page.
 */
// Definuje a exportuje komponentu PageReadItem reprezentující celou stránku pro čtení detailu záznamu
export const PageReadItem = ({ 
    SubPage = GeneratedContentBase, // Nastavuje kalkulační a vizualizační podstránku jako výchozí layout těla
    ...props // Zachytává všechny ostatní vlastnosti (např. custom thunky, navbary) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku (PageItemBase), které předává nakonfigurovanou SubPage a zbylé parametry
    return (
        <PageItemBase SubPage={SubPage} {...props} />
    ); // Konec návratové hodnoty komponenty PageReadItem
}; // Konec definice komponenty PageReadItem