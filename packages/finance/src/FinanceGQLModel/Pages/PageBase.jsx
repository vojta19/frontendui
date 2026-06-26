// Importuje výchozí asynchronní síťovou akci (thunk) pro načítání dat záznamu ze souboru Queries
import { ReadAsyncAction } from "../Queries";

// Importuje základní komponentu stránky ze šablony a dává jí alias PageItemBase_ kvůli zamezení kolizí jmen
import { PageItemBase as PageItemBase_ } from "../../../../_template/src/Base/Pages/Page";

// Importuje vizuální komponentu velké karty (LargeCard) z lokálního adresáře Components
import { LargeCard } from "../Components";

/**
 * Base wrapper pro stránky pracující s jedním entity itemem podle `:id` z routy.
 *
 * Komponenta:
 * - načte `id` z URL přes `useParams()`
 * - sestaví minimální `item` objekt `{ id }`
 * - poskytne jej přes `AsyncActionProvider`, který zajistí načtení entity pomocí `queryAsyncAction`
 * - vloží do stránky navbar přes `PlaceChild Component={PageNavbar}`
 * - vyrenderuje `children` uvnitř provideru (tj. až v kontextu načtené entity)
 *
 * Typické použití je jako obálka routy typu `/.../:id`, kde vnořené komponenty
 * (detail, editace, akce) používají kontext z `AsyncActionProvider`.
 *
 * @component
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * Obsah stránky, který se má vyrenderovat uvnitř `AsyncActionProvider`.
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 * Async action (např. thunk) použitá pro načtení entity z GraphQL endpointu.
 * Dostane `item` s `id` (a případně další parametry podle implementace provideru).
 *
 * @returns {import("react").JSX.Element}
 * Provider s navigací (`PageNavbar`) a obsahem stránky (`children`).
 */
// Definuje a exportuje komponentu PageItemBase s destrukturalizovanými props a jejich výchozími hodnotami ze šablony
export const PageItemBase = ({ 
    queryAsyncAction = ReadAsyncAction, // Výchozí thunk akce pro stažení dat položky
    PageNavbar = () => null, // Výchozí anonymní funkce vracející null jako prázdný navbar
    ItemLayout = LargeCard, // Výchozí layout karta obalující vnitřní komponenty
    SubPage = null, // Výchozí podstránka (přiřazeno null)
    ...props // Zachycuje všechny ostatní props (např. vnořené children) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku ze šablony nakonfigurovanou podle předaných layoutů a thunků
    return (
        <BasePageItem 
            queryAsyncAction={queryAsyncAction} // Předává thunk pro načtení dat
            PageNavbar={PageNavbar} // Registruje komponentu navigační lišty
            ItemLayout={ItemLayout} // Určuje obalový styl (velkou kartu)
            SubPage={SubPage} // Předává podstránku
            {...props} // Rozbaluje zbylé props (např. children) přímo na komponentu
        />  
    ); // Konec návratové hodnoty komponenty PageItemBase
}; // Konec definice komponenty PageItemBase

// Definuje a exportuje statickou komponentu PageBase pro jednoduché stránky bez asynchronního načítání na základě ID
export const PageBase = ({ children, PageNavbar = () => null }) => {
    
    // Vrací JSX fragment skládající navigační lištu a samotný vnořený klientský obsah (children)
    return (
        <>
            {/* Vykresluje komponentu navigační lišty předanou v props */}
            <PageNavbar />
            
            {/* Vykresluje jakýkoliv vnořený klientský obsah pod navigační lištou */}
            {children}
        </>
    ); // Konec návratové hodnoty fragmentu
}; // Konec definice komponenty PageBase