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
 * Displays the page showing role assignments related to a finance entity.
 *
 * The component is a specialized wrapper around `PageReadItem`.
 * It configures the default asynchronous read action together with
 * the shared page content implementation used for displaying the entity.
 *
 * All remaining properties are forwarded directly to `PageReadItem`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 * Asynchronous action used to load the finance entity.
 *
 * @param {React.ReactNode} [props.children]
 * Optional child components forwarded to the underlying page.
 *
 * @returns {JSX.Element}
 * Page displaying role-related information for the selected finance entity.
 *
 * @example
 * <PageReadItemRolesOn />
 *
 * @example
 * <PageReadItemRolesOn
 *     queryAsyncAction={ReadAsyncAction}
 * />
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