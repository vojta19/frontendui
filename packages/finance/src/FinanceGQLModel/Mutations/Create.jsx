// Import URI adres a formulářové komponenty používané při vytváření nové finance.
import {
    CreateURI,
    MediumEditableContent,
    ReadItemURI
} from "../Components";

// Import GraphQL async akce, která odesílá požadavek na vytvoření nové finance.
import { InsertAsyncAction } from "../Queries";

// Import základních create komponent ze sdílené šablony.
// Jednotlivé komponenty jsou přejmenovány pomocí aliasu Base,
// aby bylo zřejmé, že v tomto souboru vznikají jejich finance varianty.
import {
    CreateBody as BaseCreateBody,
    CreateButton as BaseCreateButton,
    CreateDialog as BaseCreateDialog,
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";


/**
 * Default editable content used by all finance creation workflows.
 *
 * @param {Object} props
 * Properties forwarded to `MediumEditableContent`.
 *
 * @returns {JSX.Element}
 * Editable finance form.
 */
// Výchozí obsah formuláře pro vytvoření finance.
// Všechny přijaté props se bez změny předají komponentě MediumEditableContent.
const DefaultContent = (props) => (
    <MediumEditableContent {...props} />
);


/**
 * Default GraphQL mutation used to create finance entities.
 *
 * @constant
 * @type {Function}
 */
// Lokální konstanta odkazuje na výchozí async akci pro vložení nové finance.
// Díky tomu ji lze jednotně používat ve všech create komponentách.
const MutationAsyncAction = InsertAsyncAction;


/**
 * Permission configuration applied to all finance creation controls.
 *
 * Only users with the `administrátor` role are allowed to create
 * new finance entities.
 *
 * @constant
 * @type {{oneOfRoles: string[], mode: string}}
 */
// Společná konfigurace oprávnění pro všechny akce vytváření finance.
const permissions = {
    // Operaci může provést pouze uživatel s rolí administrátor.
    oneOfRoles: ["administrátor"],

    // Režim absolute znamená, že se oprávnění kontroluje globálně,
    // nikoli vůči konkrétní entitě.
    mode: "absolute"
};


/**
 * Default draft used when creating a new finance entity.
 *
 * @constant
 * @type {{name: string}}
 */
// Výchozí pracovní objekt použitý při otevření formuláře nové finance.
const defaultitem = {
    // Nová finance dostane dočasný výchozí název.
    name: "Nový"
};


/**
 * Renders a navigation link to the finance creation page.
 *
 * The component wraps `BaseCreateLink`, applies the default create URI
 * and enforces role permissions.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} [props.uriPattern=CreateURI]
 * URI pattern used for navigation to the finance creation page.
 *
 * @param {React.ReactNode} [props.children]
 * Content rendered inside the link.
 *
 * @returns {JSX.Element}
 * Permission-aware navigation link.
 *
 * @example
 * <CreateLink className="btn btn-success">
 *     Vytvořit nový
 * </CreateLink>
 */
export const CreateLink = ({
    // URI cílové stránky pro vytvoření nové finance.
    uriPattern = CreateURI,

    // Ostatní vlastnosti odkazu, například className nebo children.
    ...props
}) => (
    // Finance wrapper nad základní create link komponentou.
    <BaseCreateLink
        // Přeposlání všech ostatních vlastností.
        {...props}

        // Nastavení cílové URI pro vytvoření nové položky.
        uriPattern={uriPattern}

        // Aplikace společné kontroly oprávnění.
        {...permissions}
    />
);


/**
 * Displays a modal dialog used for creating a finance entity.
 *
 * The component wraps `BaseCreateDialog`, injects the finance-specific
 * editable form and initializes the dialog with the default finance draft.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} [props.title="Nov(ý/é)"]
 * Dialog title.
 *
 * @param {React.ComponentType<Object>} [props.DefaultContent=DefaultContent]
 * Component rendering editable finance fields.
 *
 * @param {string} [props.readItemURI=ReadItemURI]
 * URI used after successful creation.
 *
 * @param {Object} [props.item=defaultitem]
 * Initial draft of the finance entity.
 *
 * @param {Function} [props.onOk]
 * Callback executed after confirmation.
 *
 * @param {Function} [props.onCancel]
 * Callback executed when the dialog is cancelled.
 *
 * @returns {JSX.Element}
 * Finance creation dialog.
 */
export const CreateDialog = ({
    // Nadpis zobrazený v modálním dialogu.
    title = "Nov(ý/é)",

    // Komponenta formuláře použitá uvnitř dialogu.
    // Alias defaultContent odlišuje prop od výchozí konstanty.
    DefaultContent: defaultContent = DefaultContent,

    // URI použité po úspěšném vytvoření nové entity.
    readItemURI = ReadItemURI,

    // Počáteční pracovní objekt nové finance.
    item = defaultitem,

    // Ostatní vlastnosti dialogu, například onOk nebo onCancel.
    ...props
}) => {
    return (
        // Využití základního create dialogu ze sdílené šablony.
        <BaseCreateDialog
            // Přeposlání ostatních parametrů.
            {...props}

            // Nastavení nadpisu dialogu.
            title={title}

            // Vložení finance formuláře do dialogu.
            DefaultContent={defaultContent}

            // Cílová URI po úspěšném vytvoření.
            readItemURI={readItemURI}

            // Počáteční data formuláře.
            item={item}
        />
    );
};


/**
 * Renders a button that opens the finance creation dialog.
 *
 * The component wraps `BaseCreateButton`, supplies the default finance form,
 * creation dialog, GraphQL mutation and permission configuration.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=InsertAsyncAction]
 * GraphQL mutation executed when a new finance entity is created.
 *
 * @param {React.ComponentType<Object>} [props.CreateDialog=CreateDialog]
 * Dialog component used to collect finance data.
 *
 * @param {React.ComponentType<Object>} [props.DefaultContent=DefaultContent]
 * Component rendering editable finance fields.
 *
 * @param {string} [props.readItemURI=ReadItemURI]
 * URI used after successful creation.
 *
 * @param {Object} [props.rbacitem]
 * RBAC context passed to permission checking.
 *
 * @param {Object} [props.item=defaultitem]
 * Initial finance draft.
 *
 * @param {React.ReactNode} [props.children]
 * Content rendered inside the button.
 *
 * @returns {JSX.Element}
 * Permission-aware finance creation button.
 *
 * @example
 * <CreateButton className="btn btn-success">
 *     Vytvořit nový
 * </CreateButton>
 */
export const CreateButton = ({
    // Async akce spuštěná po potvrzení formuláře.
    mutationAsyncAction = MutationAsyncAction,

    // Komponenta dialogu použitá tlačítkem.
    // Alias CreateDialog_ zabraňuje kolizi s exportovanou komponentou stejného názvu.
    CreateDialog: CreateDialog_ = CreateDialog,

    // Komponenta obsahující editovatelná pole.
    DefaultContent: defaultContent = DefaultContent,

    // URI detailu nově vytvořené finance.
    readItemURI = ReadItemURI,

    // RBAC objekt použitý při kontrole oprávnění.
    rbacitem,

    // Počáteční data nové finance.
    item = defaultitem,

    // Ostatní vlastnosti tlačítka, například text nebo CSS třídy.
    ...props
}) => {
    return (
        // Základní tlačítko zajišťuje otevření dialogu a odeslání mutace.
        <BaseCreateButton
            // Přeposlání standardních vlastností tlačítka.
            {...props}

            // Formulář zobrazený v dialogu.
            DefaultContent={defaultContent}

            // Dialog otevřený po kliknutí na tlačítko.
            CreateDialog={CreateDialog_}

            // Adresa použitá po vytvoření finance.
            readItemURI={readItemURI}

            // RBAC kontext pro kontrolu přístupu.
            rbacitem={rbacitem}

            // Počáteční pracovní objekt.
            item={item}

            // GraphQL async akce pro vložení záznamu.
            mutationAsyncAction={mutationAsyncAction}

            // Společná konfigurace oprávnění.
            {...permissions}
        />
    );
};


/**
 * Renders the full-page finance creation workflow.
 *
 * The component wraps `BaseCreateBody`, injects the finance creation form,
 * configures the default GraphQL mutation and determines the destination
 * page after successful creation.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=InsertAsyncAction]
 * GraphQL mutation executed during finance creation.
 *
 * @param {React.ComponentType<Object>} [props.DefaultContent=DefaultContent]
 * Component rendering editable finance fields.
 *
 * @param {string} [props.readItemURI=ReadItemURI]
 * URI used after successful creation.
 *
 * @param {Function} [props.onOk]
 * Callback executed after successful creation.
 *
 * @param {Function} [props.onCancel]
 * Callback executed when creation is cancelled.
 *
 * @param {React.ReactNode} [props.children]
 * Additional content rendered inside the workflow.
 *
 * @returns {JSX.Element}
 * Full-page finance creation interface.
 *
 * @example
 * <CreateBody />
 */
export const CreateBody = ({
    // Async akce použitá při odeslání celostránkového formuláře.
    mutationAsyncAction = MutationAsyncAction,

    // Komponenta editovatelných polí.
    DefaultContent: defaultContent = DefaultContent,

    // URI detailu nově vytvořené položky.
    readItemURI = ReadItemURI,

    // Ostatní vlastnosti workflow, například callbacky a children.
    ...props
}) => {
    return (
        // BaseCreateBody zajišťuje kompletní celostránkový create proces.
        <BaseCreateBody
            // Přeposlání ostatních vlastností.
            {...props}

            // Vložení finance formuláře.
            DefaultContent={defaultContent}

            // Cílová URI po úspěšném vytvoření.
            readItemURI={readItemURI}

            // Async GraphQL akce použitá k uložení nové entity.
            mutationAsyncAction={mutationAsyncAction}
        />
    );
};