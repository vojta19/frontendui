// Importuje základní aktualizační komponenty ze sdílené šablony a dává jim aliasy s prefixem Base
import {
    UpdateBody as BaseUpdateBody,
    UpdateButton as BaseUpdateButton,
    UpdateDialog as BaseUpdateDialog,
    UpdateLink as BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update";

// Importuje editační formulář (MediumEditableContent) a cílovou URI pro update konkrétní položky z adresáře Components
import { MediumEditableContent, UpdateItemURI } from "../Components";

// Importuje asynchronní síťovou akci (thunk) pro provedení úpravy ze souboru Queries
import { UpdateAsyncAction } from "../Queries";

// Definuje pomocnou komponentu DefaultContent, která zapouzdřuje formulář a předává mu všechny props
const DefaultContent = (props) => <MediumEditableContent {...props} />;

// Přiřazuje asynchronní akci úpravy (UpdateAsyncAction) do lokální proměnné mutationAsyncAction
const mutationAsyncAction = UpdateAsyncAction;

// Nastavuje výchozí objekt přístupových práv (RBAC) vyžadující roli administrátora v absolutním režimu kontroly
const permissions = {
    oneOfRoles: ["administrátor"], // Pole povolených rolí uživatelů
    mode: "absolute", // Striktní/absolutní režim ověřování na PermissionGate
}; // Konec definice oprávnění

// ALTERNATIVNÍ, ZAKOMENTOVANÝ BLOK OPRÁVNĚNÍ: Kontrola vůči GQLENDPOINT
// const permissions = {
//     oneOfRoles: ["administrátor", "personalista"],
//     mode: "item",
// }

/**
 * Link na update stránku / update route pro konkrétní entitu.
 *
 * Wrapper nad `BaseUpdateLink`. Nastavuje výchozí `uriPattern` a aplikuje RBAC
 * přes `permissions`. Vše ostatní přeposílá do Base komponenty.
 *
 * @param {Object} params
 * @param {string} [params.uriPattern=UpdateItemURI]
 * URI pattern pro update route (typicky obsahuje `:id` nebo je již konkrétní URL dle routování).
 * @param {Object} params.props
 * Další props přeposílané do `BaseUpdateLink` (např. `children`, `className`,
 * `preserveSearch`, `preserveHash`, atd.).
 * @returns {JSX.Element}
 */
// Definuje a exportuje komponentu UpdateLink pro celostránkový přechod na úpravu záznamu
export const UpdateLink = ({
    uriPattern = UpdateItemURI, // Výchozí URL adresa/vzor pro editaci s parametrem ID
    ...props // Zachytává ostatní přebírané vlastnosti prvku (např. text odkazu, CSS třídy)
}) => {
    
    // Vrací základní komponentu odkazu rozšířenou o zadanou URI a globální administrativní práva
    return <BaseUpdateLink
        {...props} // Rozbaluje zbylé klientské vlastnosti
        uriPattern={uriPattern} // Dosazuje koncovou adresu pro přesměrování
        {...permissions} // Aplikuje kontrolu role
    />; // Konec návratové hodnoty komponenty UpdateLink
}; // Konec definice komponenty UpdateLink

/**
 * Dialog pro editaci entity.
 *
 * Wrapper nad `BaseUpdateDialog`. Dodává výchozí editovatelný obsah (`DefaultContent`)
 * a výchozí mutační akci (`mutationAsyncAction`) pro uložení změn. Aplikuje RBAC
 * přes `permissions`.
 *
 * @param {Object} params
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta, která vykreslí editovatelný obsah dialogu (typicky MediumEditableContent).
 * @param {Function} [params.mutationAsyncAction=mutationAsyncAction]
 * Async action (thunk) pro uložení změn (např. UpdateAsyncAction). Použije se podle Base/General implementace.
 * @param {Object} params.props
 * Další props přeposílané do `BaseUpdateDialog` (např. `title`, `oklabel`, `cancellabel`,
 * `item`, `onOk`, `onCancel`, atd.).
 * @returns {JSX.Element}
 */
// Definuje a exportuje komponentu UpdateDialog reprezentující vyskakovací okno s editačním formulářem
export const UpdateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent, // Výchozí editační formulářové vstupy
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction, // Výchozí thunk akce pro odeslání dat
    ...props // Ostatní konfigurační props (callbacky onOk, onCancel, titulky, atd.)
}) => {
    
    // Vrací vnitřní modální okno ze šablony nakonfigurované pro daný finanční model a práva
    return (
        <BaseUpdateDialog
            {...props} // Předává obecné parametry modalu ze šablony
            DefaultContent={DefaultContent_} // Vkládá editační formulář jako obsah okna
            mutationAsyncAction={mutationAsyncAction_} // Registruje síťovou akci pro uložení změn
            {...permissions} // Omezuje přístup k zobrazení dialogu na administrátora
        />
    ); // Konec návratové hodnoty komponenty UpdateDialog
}; // Konec definice komponenty UpdateDialog

/**
 * Tlačítko, které otevře update dialog a provede uložení.
 *
 * Wrapper nad `BaseUpdateButton`. Dodává výchozí `DefaultContent`, výchozí `Dialog`,
 * a výchozí `mutationAsyncAction`. Aplikuje RBAC přes `permissions`.
 *
 * @param {Object} params
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta editovatelného obsahu (typicky MediumEditableContent).
 * @param {React.ComponentType<Object>} [params.Dialog=UpdateDialog]
 * Dialog komponenta použitá pro editaci (volá `onOk(draft)` / `onCancel()`).
 * @param {Function} [params.mutationAsyncAction=mutationAsyncAction]
 * Async action (thunk) pro uložení změn (např. UpdateAsyncAction).
 * @param {Object} params.props
 * Další props přeposílané do `BaseUpdateButton` (např. `children`, `className`, `title`,
 * `item`, `uriPattern`, `onOk`, `onCancel`, atd.).
 * @returns {JSX.Element}
 */
// Definuje a exportuje komponentu UpdateButton, která slouží jako spouštěč editačního modalu
export const UpdateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent, // Výchozí formulářová komponenta
    Dialog = UpdateDialog, // Komponenta dialogu, která se po stisku tlačítka vyvolá
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction, // Výchozí asynchronní akce uložení
    ...props // Ostatní props tlačítka (vzhled, ikony, text)
}) => {
    
    // Vrací základní tlačítko ze šablony s navázaným formulářem, oknem a zabezpečením
    return (
        <BaseUpdateButton
            {...props} // Propisuje standardní vlastnosti HTML elementu tlačítka
            DefaultContent={DefaultContent_} // Posílá formulář do vnitřního workflow tlačítka
            Dialog={Dialog} // Definuje modal k zobrazení
            mutationAsyncAction={mutationAsyncAction_} // Předává uložení na backend
            {...permissions} // Obaluje prvek tlačítka vnitřní kontrolou PermissionGate
        />
    ); // Konec návratové hodnoty komponenty UpdateButton
}; // Konec definice komponenty UpdateButton

/**
 * “Page-level” update workflow (inline edit / celá stránka editace).
 *
 * Wrapper nad `BaseUpdateBody`. Typicky vykreslí editovatelný obsah (`DefaultContent`)
 * a zajistí uložení přes `mutationAsyncAction` (dle Base/General implementace).
 * Aplikuje RBAC přes `permissions`.
 *
 * @param {Object} params
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta editovatelného obsahu (typicky MediumEditableContent).
 * @param {Function} [params.mutationAsyncAction=mutationAsyncAction]
 * Async action (thunk) pro uložení změn (např. UpdateAsyncAction).
 * @param {Object} params.props
 * Další props přeposílané do `BaseUpdateBody` (např. `title`, `oklabel`, `cancellabel`,
 * `item`, `onOk`, `onCancel`, `className`, atd.).
 * @returns {JSX.Element}
 */
// Definuje a exportuje komponentu UpdateBody pro celostránkový editační kontext
export const UpdateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent, // Výchozí editační komponenta (inputy)
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction, // Výchozí thunk akce aktualizace dat
    ...props // Ostatní parametry (nadpisy na stránce, tlačítka pro uložení/zrušení změn)
}) => {
    
    // Vrací celostránkový kontejner se zabudovaným odesíláním formuláře a právy administrátora
    return (
        <BaseUpdateBody
            {...props} // Předává zbylé klientské parametry z nadřazeného view
            DefaultContent={DefaultContent_} // Vykresluje editační pole přímo do těla stránky
            mutationAsyncAction={mutationAsyncAction_} // Připojuje akci mutace ke strákovému submit tlačítku
            {...permissions} // Omezuje celostránkovou editaci pouze pro uživatele s rolí administrátor
        />
    ); // Konec návratové hodnoty komponenty UpdateBody
}; // Konec definice komponenty UpdateBody