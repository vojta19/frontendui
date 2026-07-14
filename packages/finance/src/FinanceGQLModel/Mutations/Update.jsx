// Import základních komponent pro aktualizaci entity ze sdílené šablony.
// Každá komponenta je přejmenována pomocí aliasu Base,
// aby bylo zřejmé, že v tomto souboru vzniká finance varianta.
import {
    UpdateBody as BaseUpdateBody,
    UpdateButton as BaseUpdateButton,
    UpdateDialog as BaseUpdateDialog,
    UpdateLink as BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update";

// Import formuláře pro editaci finance a URI adresy stránky úprav.
import {
    MediumEditableContent,
    UpdateItemURI
} from "../Components";

// Import GraphQL async akce, která ukládá změny finanční entity.
import { UpdateAsyncAction } from "../Queries";


/**
 * Default editable content used by all update workflows.
 *
 * @param {Object} props
 * Properties forwarded to `MediumEditableContent`.
 *
 * @returns {JSX.Element}
 * Editable finance form.
 */
// Výchozí formulářový obsah používaný všemi variantami aktualizace.
// Všechny přijaté vlastnosti se bez změny předají do MediumEditableContent.
const DefaultContent = (props) => (
    <MediumEditableContent {...props} />
);


/**
 * Default GraphQL async action used to update finance entities.
 *
 * @constant
 * @type {Function}
 */
// Výchozí async GraphQL akce pro uložení změn finance.
const mutationAsyncAction = UpdateAsyncAction;


/**
 * Permission configuration applied to all finance update controls.
 *
 * Only users with the `administrátor` role can access the update actions.
 *
 * @constant
 * @type {{oneOfRoles: string[], mode: string}}
 */
// Společná konfigurace oprávnění pro všechny aktualizační komponenty.
const permissions = {
    // Aktualizaci může provést pouze uživatel s rolí administrátor.
    oneOfRoles: ["administrátor"],

    // Režim absolute znamená globální kontrolu oprávnění,
    // nikoli kontrolu vůči konkrétní položce.
    mode: "absolute"
};


/**
 * Renders a link to the full-page finance update route.
 *
 * The component wraps `BaseUpdateLink`, applies the default finance update URI
 * and enforces the configured role permissions.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} [props.uriPattern=UpdateItemURI]
 * URI pattern used for navigation to the update page.
 *
 * @param {Object} [props.item]
 * Finance entity whose detail should be edited.
 *
 * @param {React.ReactNode} [props.children]
 * Content rendered inside the link.
 *
 * @returns {JSX.Element}
 * Permission-aware link to the finance update page.
 *
 * @example
 * <UpdateLink
 *     item={finance}
 *     className="btn btn-outline-success"
 * >
 *     Upravit
 * </UpdateLink>
 */
export const UpdateLink = ({
    // URI vzor stránky pro úpravu konkrétní finance.
    uriPattern = UpdateItemURI,

    // Ostatní vlastnosti odkazu, například item, children nebo className.
    ...props
}) => {
    return (
        // Základní odkaz ze šablony zajišťuje navigaci na editační stránku.
        <BaseUpdateLink
            // Přeposlání všech ostatních vlastností.
            {...props}

            // Nastavení cílové URI úprav.
            uriPattern={uriPattern}

            // Aplikace společné kontroly oprávnění.
            {...permissions}
        />
    );
};


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
 * @param {React.ComponentType<Object>} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction]
 * Async action used to persist finance changes.
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
export const UpdateDialog = ({
    // Formulářová komponenta použitá uvnitř dialogu.
    // Alias DefaultContent_ zabraňuje kolizi s lokální konstantou.
    DefaultContent: DefaultContent_ = DefaultContent,

    // Async akce provádějící GraphQL mutaci.
    mutationAsyncAction: mutationAsyncAction_ =
        mutationAsyncAction,

    // Ostatní vlastnosti dialogu, například item, title, onOk nebo onCancel.
    ...props
}) => {
    return (
        // Základní modální dialog ze sdílené šablony.
        <BaseUpdateDialog
            // Přeposlání ostatních parametrů dialogu.
            {...props}

            // Vložení formuláře pro editaci finanční položky.
            DefaultContent={DefaultContent_}

            // Nastavení async akce použité při potvrzení změn.
            mutationAsyncAction={mutationAsyncAction_}

            // Omezení přístupu na uživatele s požadovanou rolí.
            {...permissions}
        />
    );
};


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
 * @param {React.ComponentType<Object>} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {React.ComponentType<Object>} [props.Dialog=UpdateDialog]
 * Dialog component opened after clicking the button.
 *
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction]
 * Async action used to persist finance changes.
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
export const UpdateButton = ({
    // Výchozí formulářová komponenta uvnitř dialogu.
    DefaultContent: DefaultContent_ = DefaultContent,

    // Dialog otevřený po kliknutí na tlačítko.
    Dialog = UpdateDialog,

    // Async GraphQL akce použitá při uložení.
    mutationAsyncAction: mutationAsyncAction_ =
        mutationAsyncAction,

    // Ostatní vlastnosti tlačítka, například item, children nebo className.
    ...props
}) => {
    return (
        // Základní tlačítko ze šablony spravuje otevření dialogu
        // a následné spuštění aktualizační akce.
        <BaseUpdateButton
            // Přeposlání standardních vlastností tlačítka.
            {...props}

            // Formulář zobrazený uvnitř dialogu.
            DefaultContent={DefaultContent_}

            // Komponenta dialogu otevřená po kliknutí.
            Dialog={Dialog}

            // Async akce odesílající změny na backend.
            mutationAsyncAction={mutationAsyncAction_}

            // Kontrola oprávnění uživatele.
            {...permissions}
        />
    );
};


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
 * @param {React.ComponentType<Object>} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {Function} [props.mutationAsyncAction=UpdateAsyncAction]
 * Async action used to persist finance changes.
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
export const UpdateBody = ({
    // Komponenta obsahující editovatelná pole finance.
    DefaultContent: DefaultContent_ = DefaultContent,

    // Async akce použitá pro uložení změn.
    mutationAsyncAction: mutationAsyncAction_ =
        mutationAsyncAction,

    // Ostatní vlastnosti celostránkového workflow.
    ...props
}) => {
    return (
        // BaseUpdateBody zajišťuje kompletní aktualizační proces
        // přímo na samostatné stránce.
        <BaseUpdateBody
            // Přeposlání ostatních parametrů.
            {...props}

            // Vložení finance formuláře.
            DefaultContent={DefaultContent_}

            // Nastavení GraphQL async akce pro uložení změn.
            mutationAsyncAction={mutationAsyncAction_}

            // Aplikace společného nastavení oprávnění.
            {...permissions}
        />
    );
};