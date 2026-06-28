// Importuje komponentu GeneratedContentBase ze souboru Page.
// GeneratedContentBase je výchozí obsah stránky,
// který řeší načítání transferů, přepočet hodnot a vykreslení Sunburst grafu.
// Importuje komponentu PageItemBase ze souboru PageItemBase.
// PageItemBase tvoří základní obal detailové stránky.
// Stará se hlavně o načtení konkrétní entity podle ID z URL.

import { GeneratedContentBase } from "./Page"
// PAVLE NAUČ SE ČÍST S POROZUMĚNÍM PROSÍM PAGEBASE A PAGE NEJSOU STEJNÉ SOUBORY :)
import { PageItemBase } from "./PageBase"

/**
 * Komponenta PageReadItem slouží pro zobrazení detailu entity v režimu čtení.
 *
 * Sama o sobě neřeší výpočty ani render grafu.
 * Pouze nastavuje, jaká vnitřní komponenta se má použít jako obsah stránky,
 * a vše předává do PageItemBase.
 *
 * Výchozí SubPage je GeneratedContentBase,
 * takže pokud nepředáme jinou komponentu,
 * stránka automaticky použije Sunburst graf a logiku finančních transferů.
 *
 * @component
 * @param {Object} props - Vlastnosti předané komponentě.
 * @param {React.ComponentType} [props.SubPage=GeneratedContentBase]
 * Komponenta, která se vykreslí jako vnitřní obsah stránky.
 * @param {...any} props
 * Další vlastnosti, které se beze změny předají do PageItemBase.
 *
 * @returns {JSX.Element}
 * Vrací detailovou stránku obalenou přes PageItemBase.
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