// Importuje výchozí asynchronní akci pro načtení detailu entity.
import { ReadAsyncAction } from "../Queries";

// Importuje základní komponentu detailní stránky ze sdílené šablony
// a přejmenovává ji na PageItemBase_, aby nedošlo ke kolizi názvů.
import { PageItemBase as PageItemBase_ } from "../../../../_template/src/Base/Pages/Page";

// Importuje výchozí rozložení detailní stránky finance.
import { LargeCard } from "../Components";


/**
 * Základní obalová komponenta pro detailní stránky jedné finanční entity.
 *
 * Komponenta rozšiřuje sdílenou implementaci `PageItemBase` a nastavuje
 * výchozí konfiguraci používanou v modulu Finance:
 *
 * - `ReadAsyncAction` pro načtení entity,
 * - `LargeCard` jako hlavní rozložení stránky,
 * - prázdnou navigační komponentu,
 * - volitelnou podstránku.
 *
 * Načtení parametru `id`, vytvoření výchozího objektu entity a práce
 * s `AsyncActionProvider` jsou řešeny uvnitř sdílené komponenty
 * `PageItemBase_`.
 *
 * @component
 *
 * @param {Object} props
 * Vlastnosti komponenty.
 *
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 * Asynchronní akce použitá pro načtení detailu entity.
 *
 * @param {React.ComponentType} [props.PageNavbar]
 * Volitelná komponenta navigační lišty stránky.
 *
 * @param {React.ComponentType} [props.ItemLayout=LargeCard]
 * Komponenta určující hlavní rozložení detailu entity.
 *
 * @param {React.ComponentType|null} [props.SubPage=null]
 * Volitelná komponenta podstránky vykreslená uvnitř hlavního rozložení.
 *
 * @param {React.ReactNode} [props.children]
 * Dodatečný obsah předaný do základní komponenty stránky.
 *
 * @returns {JSX.Element}
 * Detailní stránka finanční entity s nakonfigurovaným načítáním a layoutem.
 *
 * @example
 * <PageItemBase>
 *     <FinanceTransferSunburst />
 * </PageItemBase>
 */
export const PageItemBase = ({
    // Výchozí async akce pro načtení detailu finance.
    queryAsyncAction = ReadAsyncAction,

    // Výchozí navigace nic nevykresluje.
    PageNavbar = () => null,

    // Výchozí layout detailní stránky.
    ItemLayout = LargeCard,

    // Výchozí podstránka není nastavena.
    SubPage = null,

    // Zachytí ostatní vlastnosti, například children.
    ...props
}) => {

    // Vrací sdílenou detailní stránku nakonfigurovanou pro modul Finance.
    return (
        <PageItemBase_
            // Async akce použitá pro načtení entity.
            queryAsyncAction={queryAsyncAction}

            // Navigační komponenta stránky.
            PageNavbar={PageNavbar}

            // Komponenta hlavního rozložení.
            ItemLayout={ItemLayout}

            // Volitelná podstránka.
            SubPage={SubPage}

            // Přeposlání ostatních vlastností.
            {...props}
        />
    );
};


/**
 * Jednoduchý statický obal stránky bez automatického načítání entity.
 *
 * Komponenta vykreslí volitelnou navigační lištu a následně obsah předaný
 * prostřednictvím `children`.
 *
 * @component
 *
 * @param {Object} props
 * Vlastnosti komponenty.
 *
 * @param {React.ReactNode} [props.children]
 * Obsah vykreslený pod navigační lištou.
 *
 * @param {React.ComponentType} [props.PageNavbar]
 * Volitelná komponenta navigační lišty.
 *
 * @returns {JSX.Element}
 * Statická stránka složená z navigace a vloženého obsahu.
 *
 * @example
 * <PageBase>
 *     <p>Obsah stránky</p>
 * </PageBase>
 */
export const PageBase = ({
    // Obsah stránky.
    children,

    // Výchozí navigační komponenta nic nevykresluje.
    PageNavbar = () => null
}) => {

    // Vykreslení navigace a následně obsahu stránky.
    return (
        <>
            {/* Volitelná navigační lišta */}
            <PageNavbar />

            {/* Obsah předaný z nadřazené komponenty */}
            {children}
        </>
    );
};