// Importuje základní komponenty pro práci s aktualizací entity z balíčku šablony.
import {
    UpdateBody as BaseUpdateBody, // Importuje tělo editačního formuláře pod aliasem BaseUpdateBody
    UpdateButton as BaseUpdateButton, // Importuje tlačítko pro spuštění editace pod aliasem BaseUpdateButton
    UpdateDialog as BaseUpdateDialog, // Importuje modální dialog pro editaci pod aliasem BaseUpdateDialog
    UpdateLink as BaseUpdateLink // Importuje odkaz pro editaci pod aliasem BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update"; // Cesta k základním editačním komponentám šablony

// Importuje komponenty pro editovatelný obsah a URI cesty pro stránku aktualizace.
import {
    MediumEditableContent, // Importuje komponentu pro středně velký editovatelný formulářový obsah
    UpdateItemURI // Importuje konstantu s URL maskou pro úpravu konkrétní entity
} from "../Components"; // Cesta k lokálním komponentám modulu

// Importuje asynchronní akci, která odesílá mutaci aktualizace finance entity.
import { UpdateAsyncAction } from "../Queries"; // Thunk akce pro komunikaci s API při ukládání změn


/**
 * Výchozí obsah formuláře pro editaci finance entity.
 *
 * Komponenta předává všechny přijaté vlastnosti do obecného editovatelného obsahu.
 *
 * @component
 * @param {Object} props Vlastnosti předávané komponentě MediumEditableContent.
 * @returns {JSX.Element} Výchozí formulář pro úpravu financí.
 */
const DefaultContent = (props) => ( // Definuje funkcionální komponentu DefaultContent pro výchozí editační pole
    <MediumEditableContent {...props} /> // Vykreslí editovatelná pole a předá jim všechny příchozí vlastnosti
); // Konec komponenty DefaultContent


/**
 * Výchozí asynchronní akce používaná pro aktualizaci finance entity.
 *
 * @constant
 * @type {Function}
 */
const mutationAsyncAction = UpdateAsyncAction; // Uloží odkaz na asynchronní akci update do lokální konstanty


/**
 * Nastavení oprávnění aplikované na všechny ovládací prvky aktualizace financí.
 *
 * Přístup mají pouze uživatelé s rolí "administrátor".
 *
 * @constant
 * @type {{oneOfRoles: string[], mode: string}}
 */
const permissions = { // Definuje konfigurační objekt s přístupovými právy
    oneOfRoles: ["administrátor"], // Seznam povolených uživatelských rolí (pouze administrátor)
    mode: "absolute" // Nastavuje striktní (absolutní) režim vyhodnocování práv
}; // Konec objektu permissions


/**
 * Renders a link to the full-page finance update route.
 *
 * Komponenta obaluje základní odkaz pro aktualizaci a přidává výchozí URI
 * spolu s oprávněními definovanými pro finance workflow.
 *
 * @component
 * @param {Object} props Vlastnosti komponenty.
 * @param {string} [props.uriPattern=UpdateItemURI] Vzor URI pro navigaci na stránku úpravy.
 * @param {Object} [props.item] Finance entity, kterou má uživatel upravit.
 * @param {React.ReactNode} [props.children] Obsah vykreslený uvnitř odkazu.
 * @returns {JSX.Element} Odkaz na stránku pro úpravu financí s kontrolou oprávnění.
 */
export const UpdateLink = ({ // Exportuje komponentu UpdateLink pro vygenerování editačního odkazu
    uriPattern = UpdateItemURI, // Nastavuje výchozí hodnotu pro vzor cesty v URL
    ...props // Shromáždí všechny ostatní vlastnosti do objektu props
}) => { // Začátek těla komponenty UpdateLink
    return ( // Vrací JSX strukturu k vykreslení
        <BaseUpdateLink // Vykreslí odkaz ze šablony
            {...props} // Předá všechny doplňkové vlastnosti (např. className, item)
            uriPattern={uriPattern} // Nastaví cílovou URL cestu pro úpravu
            {...permissions} // Aplikuje definované restrikce rolí na odkaz
        /> // Konec BaseUpdateLink
    ); // Konec returnu
}; // Konec komponenty UpdateLink


/**
 * Displays a modal dialog for editing a finance entity.
 *
 * The component wraps `BaseUpdateDialog`, injects the finance-specific
 * editable content and uses `UpdateAsyncAction` as the default mutation.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction]
 * Asynchronous action used to persist finance changes.
 *
 * @param {Object} [props.item]
 * Finance entity being edited.
 *
 * @param {Function} [props.onOk]
 * Callback invoked after successful confirmation.
 *
 * @param {Function} [props.onCancel]
 * Callback invoked when editing is cancelled.
 *
 * @param {string} [props.title]
 * Dialog title.
 *
 * @returns {JSX.Element}
 * Permission-aware finance update dialog.
 *
 * @example
 * <UpdateDialog
 *     item={finance}
 *     title="Upravit finance"
 *     onOk={handleUpdate}
 * />
 */
export const UpdateDialog = ({ // Exportuje komponentu UpdateDialog pro modální editační okno
    DefaultContent: DefaultContent_ = DefaultContent, // Přejmenuje a dosadí výchozí editační formulář
    mutationAsyncAction: mutationAsyncAction_ = // Přejmenuje prop pro asynchronní mutaci
        mutationAsyncAction, // Nastaví jako výchozí hodnotu naši lokální konstantu
    ...props // Shromáždí všechny ostatní parametry
}) => { // Začátek těla komponenty UpdateDialog
    return ( // Vrací JSX k vykreslení
        <BaseUpdateDialog // Vykreslí základní dialogové okno ze šablony
            {...props} // Předá zbylé parametry jako jsou callbacky onOk/onCancel nebo titulek
            DefaultContent={DefaultContent_} // Předá komponentu s editačními poli
            mutationAsyncAction={mutationAsyncAction_} // Předá akci pro uložení změn přes API
            {...permissions} // Zabezpečí zobrazení celého dialogu na základě přístupových práv
        /> // Konec BaseUpdateDialog
    ); // Konec returnu
}; // Konec komponenty UpdateDialog


/**
 * Renders a button that opens the finance update dialog.
 *
 * The component wraps `BaseUpdateButton` and supplies the default editable
 * content, dialog component, update mutation and role permissions.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {Function} [props.Dialog=UpdateDialog]
 * Dialog component opened after clicking the button.
 *
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction]
 * Asynchronous action used to persist finance changes.
 *
 * @param {Object} [props.item]
 * Finance entity being edited.
 *
 * @param {React.ReactNode} [props.children]
 * Content rendered inside the button.
 *
 * @returns {JSX.Element}
 * Permission-aware button for editing a finance entity in a dialog.
 *
 * @example
 * <UpdateButton
 *     item={finance}
 *     className="btn btn-outline-success"
 * >
 *     Upravit dialog
 * </UpdateButton>
 */
export const UpdateButton = ({ // Exportuje komponentu UpdateButton pro otevírání modálu tlačítkem
    DefaultContent: DefaultContent_ = DefaultContent, // Přejmenuje a dosadí výchozí editační pole
    Dialog = UpdateDialog, // Nastaví jako výchozí komponentu dialogu náš UpdateDialog
    mutationAsyncAction: mutationAsyncAction_ = // Přejmenuje prop pro asynchronní thunk
        mutationAsyncAction, // Nastaví výchozí thunk pro mutaci
    ...props // Shromáždí zbylé props
}) => { // Začátek těla komponenty UpdateButton
    return ( // Vrací JSX k vykreslení
        <BaseUpdateButton // Vykreslí otevírací tlačítko ze šablony
            {...props} // Předá zbylé parametry (např. styl, děti, položku)
            DefaultContent={DefaultContent_} // Předá komponentu formuláře
            Dialog={Dialog} // Nastaví, jaký dialog se má po kliknutí na tlačítko otevřít
            mutationAsyncAction={mutationAsyncAction_} // Předá akci pro asynchronní uložení dat
            {...permissions} // Omezí viditelnost samotného spouštěcího tlačítka dle práv
        /> // Konec BaseUpdateButton
    ); // Konec returnu
}; // Konec komponenty UpdateButton


/**
 * Renders the full-page finance update workflow.
 *
 * The component wraps `BaseUpdateBody`, injects the finance-specific editable
 * content, uses the default update mutation and enforces role permissions.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction]
 * Asynchronous action used to persist finance changes.
 *
 * @param {Object} [props.item]
 * Finance entity being edited.
 *
 * @param {Function} [props.onOk]
 * Callback invoked after successful confirmation.
 *
 * @param {Function} [props.onCancel]
 * Callback invoked when editing is cancelled.
 *
 * @param {React.ReactNode} [props.children]
 * Optional content rendered inside the update workflow.
 *
 * @returns {JSX.Element}
 * Permission-aware full-page finance editing interface.
 *
 * @example
 * <UpdateBody
 *     item={finance}
 *     onOk={handleUpdateFinished}
 * />
 */
export const UpdateBody = ({ // Exportuje komponentu UpdateBody pro celostránkový editační proces
    DefaultContent: DefaultContent_ = DefaultContent, // Přejmenuje a dosadí výchozí editační pole
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction, // Přejmenuje a definuje výchozí thunk mutace
    ...props // Shromáždí zbylé props (např. callbacky onOk/onCancel)
}) => { // Začátek těla komponenty UpdateBody
    return ( // Vrací JSX k vykreslení
        <BaseUpdateBody // Vykreslí celostránkovou editační strukturu ze šablony
            {...props} // Předá zbylé parametry
            DefaultContent={DefaultContent_} // Předá komponentu s editačními poli
            mutationAsyncAction={mutationAsyncAction_} // Předá akci pro odeslání dat na server
            {...permissions} // Zabezpečí celou editační stránku na základě práv uživatele
        /> // Konec BaseUpdateBody
    ); // Konec returnu
}; // Konec komponenty UpdateBody