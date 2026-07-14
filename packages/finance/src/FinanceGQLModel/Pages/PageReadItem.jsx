// Importuje komponentu GeneratedContentBase ze souboru Page.
// GeneratedContentBase představuje výchozí obsah stránky a zajišťuje
// načtení transferů, přepočet finančních hodnot a vykreslení Sunburst diagramu.
import { GeneratedContentBase } from "./Page"

// Importuje základní obal detailové stránky.
// PageItemBase se stará o načtení entity podle ID a vytvoření základního
// rozložení stránky.
import { PageItemBase } from "./PageBase"


/**
 * Displays the read-only detail page of a finance entity.
 *
 * The component acts as a lightweight wrapper around `PageItemBase`.
 * It selects which component will be rendered as the page content and
 * forwards all remaining properties to the underlying page implementation.
 *
 * By default, the page uses `GeneratedContentBase`, which provides
 * the finance detail, transfer visualization and Sunburst diagram.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ComponentType} [props.SubPage=GeneratedContentBase]
 * Component rendered inside the detail page.
 *
 * @param {React.ReactNode} [props.children]
 * Optional child components forwarded to `PageItemBase`.
 *
 * @returns {JSX.Element}
 * Read-only finance detail page.
 *
 * @example
 * <PageReadItem />
 *
 * @example
 * <PageReadItem
 *     SubPage={MyCustomContent}
 * />
 */
export const PageReadItem = ({
    // Pokud není SubPage předána zvenku,
    // použije se GeneratedContentBase jako výchozí obsah stránky.
    SubPage = GeneratedContentBase,

    // Do props se uloží všechny ostatní předané vlastnosti.
    // Například queryAsyncAction, PageNavbar nebo jiné konfigurační hodnoty.
    ...props
}) => {

    // PageReadItem pouze předává konfiguraci dál do PageItemBase.
    // SubPage určuje, co se vykreslí uvnitř stránky.
    // props předává všechny ostatní hodnoty beze změny.
    return (
        <PageItemBase SubPage={SubPage} {...props} />
    );
};