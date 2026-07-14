// Importuje základní layoutovou komponentu podstránky (GeneratedContentBase) ze sdílené šablony stránek
import { GeneratedContentBase } from "../../../../_template/src/Base/Pages/Page";

// Importuje základní URI vzor pro čtení položky (ReadItemURI) z lokálního adresáře Components
import { ReadItemURI } from "../Components";

// Importuje asynchronní thunk akci (ReadAsyncAction) pro vyvolání načtení dat ze souboru Queries
import { ReadAsyncAction } from "../Queries";

// Importuje komponentu PageReadItem (která slouží jako základní čtecí obálka stránky) ze sousedního souboru
import { PageReadItem } from "./PageReadItem";

// Vytváří a exportuje novou konstantu RolesOnURI nahrazením klíčového slova "view" za "roleson" v základním URI vzoru
export const RolesOnURI = ReadItemURI.replace("view", "roleson");

/**
 * Základní obálka pro „read“ stránku entity podle `:id` z routy.
 *
 * Využívá `PageItemBase`, který zajistí:
 * - získání `id` z URL (`useParams`)
 * - načtení entity přes `AsyncActionProvider` pomocí `queryAsyncAction`
 * - vložení navigace (`PageNavbar`)
 *
 * Uvnitř provideru vykreslí `ReadWithComponent`, který si vezme načtený `item`
 * z `useGQLEntityContext()` a zobrazí ho v zadané komponentě (defaultně `LargeCard`).
 *
 * @component
 * @param {object} props
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 * Async action (např. thunk) pro načtení entity z backendu/GraphQL dle `id`.
 * @param {Object<string, any>} [props]
 * Další props předané do `ReadWithComponent` (např. `Component`, layout props).
 *
 * @returns {JSX.Element}
 */
// Definuje a exportuje komponentu PageReadItemRolesOn, která slouží jako dedikovaná stránka pro zobrazení rolí na entitě
export const PageReadItemRolesOn = ({ 
    queryAsyncAction = ReadAsyncAction, // Nastavuje výchozí thunk pro asynchronní stažení dat entity podle ID
    children, // Zachytává případné vnořené klientské elementy
    ...props // Shromažďuje všechny ostatní konfigurační parametry (např. navbary, layouty) pro přeposlání
}) => {
    
    // Vrací komponentu PageReadItem nakonfigurovanou s příslušnou thunk akcí a základním tělem podstránky ze šablony
    return (
        <PageReadItem 
            queryAsyncAction={queryAsyncAction} // Předává definovanou síťovou akci pro načtení
            SubPage={GeneratedContentBase} // Dosazuje výchozí podstránku ze sdílené šablony
            {...props} // Rozbaluje všechny ostatní přebírané vlastnosti přímo na komponentu
        />
    ); // Konec návratové hodnoty komponenty PageReadItemRolesOn
}; // Konec definice komponenty PageReadItemRolesOn