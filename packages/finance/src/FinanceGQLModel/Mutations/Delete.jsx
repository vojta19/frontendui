// Importuje konstanty cest a komponentu obsahu z lokálního adresáře Components
import { DeleteItemURI, ListURI, MediumContent, VectorItemsURI } from "../Components";

// Importuje asynchronní síťovou akci (thunk) pro smazání entity ze souboru Queries
import { DeleteAsyncAction } from "../Queries";

// Importuje základní komponenty pro mazání ze sdílené šablony a dává jim aliasy s prefixem Base
import { 
    DeleteBody as BaseDeleteBody, 
    DeleteButton as BaseDeleteButton, 
    DeleteDialog as BaseDeleteDialog, 
    DeleteLink as BaseDeleteLink
} from "../../../../_template/src/Base/Mutations/Delete";

/**
 * Default read-only content displayed before a finance entity is deleted.
 *
 * The component is used by the delete dialog and the full-page delete
 * workflow to present the entity that is about to be removed.
 *
 * @constant
 * @type {Function}
 */
// Nastavuje komponentu MediumContent jako výchozí read-only zobrazení entity před smazáním
const DefaultContent = MediumContent;

/**
 * Default asynchronous GraphQL action used to delete finance entities.
 *
 * @constant
 * @type {Function}
 */
// Přiřazuje asynchronní smazání (DeleteAsyncAction) do vnitřní konstanty MutationAsyncAction
const MutationAsyncAction = DeleteAsyncAction;

/**
 * Permission configuration applied to all finance delete controls.
 *
 * Only users with the `administrátor` role are allowed to delete
 * finance entities.
 *
 * @constant
 * @type {{oneOfRoles: string[], mode: string}}
 */
// Konfiguruje objekt přístupových práv (RBAC) vyžadující roli administrátora v absolutním režimu kontroly
const permissions = {
    oneOfRoles: ["administrátor"], // Pole povolených uživatelských rolí
    mode: "absolute", // Striktní režim vyhodnocování oprávnění na PermissionGate
}; // Konec definice oprávnění

/**
 * Renders a navigation link to the finance delete page.
 *
 * The component wraps `BaseDeleteLink`, applies the default delete URI
 * and enforces the configured role permissions.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} [props.uriPattern=DeleteItemURI]
 * URI pattern used for navigation to the delete page.
 *
 * @param {Object} [props.item]
 * Finance entity to be deleted.
 *
 * @param {*} [props.children]
 * Content rendered inside the link.
 *
 * @returns {JSX.Element}
 * Permission-aware navigation link to the finance delete page.
 */
// Definuje a exportuje komponentu DeleteLink přijímající uriPattern s defaultní hodnotou a zbytek parametrů
export const DeleteLink = ({ 
    uriPattern = DeleteItemURI, // Cesta pro smazání konkrétní položky s ID
    ...props // Zbylé HTML a klientské vlastnosti (např. className, title)
}) => {
    
    // Vrací základní komponentu odkazu obohacenou o parametry cesty a práva administrátora
    return (
        <BaseDeleteLink 
            {...props} // Rozbaluje obecné vlastnosti přímo na komponentu
            uriPattern={uriPattern} // Předává cílovou URL adresu pro smazání
            {...permissions} // Aplikuje kontrolu role "administrátor"
        />
    ); // Konec návratové hodnoty komponenty DeleteLink
}; // Konec definice komponenty DeleteLink

/**
 * Renders a button that opens the finance delete confirmation dialog.
 *
 * The component wraps `BaseDeleteButton`, supplies the default preview
 * component, delete mutation and permission configuration.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=MutationAsyncAction]
 * Asynchronous action used to delete the finance entity.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component displaying the entity before deletion.
 *
 * @param {Function} [props.Dialog=DeleteDialog]
 * Dialog component opened after clicking the button.
 *
 * @param {string} [props.vectorItemsURI=ListURI]
 * URI used after successful deletion.
 *
 * @param {Function} [props.onOk]
 * Callback executed after successful deletion.
 *
 * @returns {JSX.Element}
 * Permission-aware delete button.
 */
// Definuje a exportuje tlačítko DeleteButton s kompletní destrukturalizací vlastností, dialogu a callbacků
export const DeleteButton = ({
    mutationAsyncAction = MutationAsyncAction, // Výchozí síťová akce pro smazání z databáze
    DefaultContent: DefaultContent_ = DefaultContent, // Výchozí komponenta pro náhled mazaných dat
    Dialog = DeleteDialog, // Komponenta potvrzovacího dialogového okna (confirm modal)
    vectorItemsURI = ListURI, // URL adresa pro přesměrování zpět na seznam po úspěšném smazání
    onOk, // Volitelný callback spouštěný po úspěšném odstranění položky
    ...props // Zbylé props jako styl tlačítka, ikona nebo zakázaný stav (disabled)
}) => {
    
    // Vrací základní tlačítko ze šablony nakonfigurované pro bezpečné mazání s dialogem a právy
    return (
        <BaseDeleteButton 
            {...props} // Předává standardní vlastnosti HTML elementu tlačítka
            DefaultContent={DefaultContent_} // Registruje komponentu pro zobrazení obsahu v dialogu
            Dialog={Dialog} // Vkládá modální okno, které se má po stisku tlačítka zobrazit
            mutationAsyncAction={mutationAsyncAction} // Předává asynchronní thunk pro vyvolání smazání
            vectorItemsURI={vectorItemsURI} // Nastavuje záložní URL adresu pro redirect po úspěchu
            onOk={onOk} // Předává klientský callback
            {...permissions} // Rozbaluje administrátorská práva pro vnitřní PermissionGate tlačítka
        />
    ); // Konec návratové hodnoty komponenty DeleteButton
}; // Konec definice komponenty DeleteButton

/**
 * Displays a confirmation dialog for deleting a finance entity.
 *
 * The component wraps `BaseDeleteDialog`, injects the default entity
 * preview, delete mutation and navigation target after successful
 * deletion.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=MutationAsyncAction]
 * Asynchronous action used to delete the finance entity.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component displaying the entity before deletion.
 *
 * @param {string} [props.vectorItemsURI=ListURI]
 * URI used after successful deletion.
 *
 * @returns {JSX.Element}
 * Permission-aware finance delete dialog.
 */
// Definuje a exportuje komponentu DeleteDialog, která vykresluje potvrzovací vyskakovací okno
export const DeleteDialog = ({
    mutationAsyncAction = MutationAsyncAction, // Výchozí asynchronní akce pro smazání
    DefaultContent: DefaultContent_ = DefaultContent, // Výchozí read-only náhled na mazanou entitu
    vectorItemsURI = ListURI, // Výchozí URL adresa pro návrat na seznam
    ...props // Zbylé props (např. titulky oken, popisky tlačítek Ano/Ne a jejich interní event handlery)
}) => {
    
    // Vrací základní dialogové okno ze šablony naplněné výchozími akcemi a omezené právy
    return (
        <BaseDeleteDialog 
            {...props} // Předává všechny klientské parametry z nadřazené komponenty
            DefaultContent={DefaultContent_} // Vkládá náhled entity jako hlavní tělo dialogu
            mutationAsyncAction={mutationAsyncAction} // Registruje thunk mutace, pokud ho dialog přímo volá
            vectorItemsURI={vectorItemsURI} // Poskytuje adresu pro návrat
            {...permissions} // Zajišťuje, že dialog se zobrazí pouze oprávněným uživatelům
        />
    ); // Konec návratové hodnoty komponenty DeleteDialog
}; // Konec definice komponenty DeleteDialog

/**
 * Renders the full-page workflow for deleting a finance entity.
 *
 * The component wraps `BaseDeleteBody`, injects the default preview
 * component, delete mutation and permission configuration.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=MutationAsyncAction]
 * Asynchronous action used to delete the finance entity.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component displaying the entity before deletion.
 *
 * @param {string} [props.vectorItemsURI=ListURI]
 * URI used after successful deletion.
 *
 * @returns {JSX.Element}
 * Permission-aware full-page finance delete interface.
 */
// Definuje a exportuje celostránkový mazací layout DeleteBody
export const DeleteBody = ({ 
    mutationAsyncAction = MutationAsyncAction, // Výchozí asynchronní thunk akce pro odstranění dat
    DefaultContent: DefaultContent_ = DefaultContent, // Výchozí komponenta pro vykreslení mazané položky inline
    vectorItemsURI = ListURI, // Výchozí návratová URL adresa pro redirect po smazání z detailu stránky
    ...props // Ostatní parametry (titulky stránky, potvrzovací texty a lokální handlery)
}) => {
    
    // Vrací základní page-level mazací kontejner nakonfigurovaný pro daný finanční model a práva
    return (
        <BaseDeleteBody 
            {...props} // Předává zbylé vlastnosti komponentě ze šablony
            DefaultContent={DefaultContent_} // Vykresluje read-only formulář položky přímo do těla stránky
            mutationAsyncAction={mutationAsyncAction} // Předává síťovou akci smazání pro její submit button
            vectorItemsURI={vectorItemsURI} // Nastavuje redirect na list
            {...permissions} // Omezuje celostránkový přístup k akci pouze administrátorovi
        />
    ); // Konec návratové hodnoty komponenty DeleteBody
}; // Konec definice komponenty DeleteBody