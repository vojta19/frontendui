// Importuje komponenty pro tvorbu entity, editovatelný obsah a URI pro zobrazení vytvořené položky.
import {
    CreateURI,
    MediumEditableContent,
    ReadItemURI
} from "../Components";

// Importuje asynchronní akci pro vložení nové finance entity.
import { InsertAsyncAction } from "../Queries";

// Importuje základní komponenty pro vytváření entity z templatu.
import {
    CreateBody as BaseCreateBody,
    CreateButton as BaseCreateButton,
    CreateDialog as BaseCreateDialog,
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";


/**
 * Default editable content used by all finance creation workflows.
 *
 * The component forwards all received properties to
 * `MediumEditableContent`.
 *
 * @component
 *
 * @param {Object} props
 * Properties forwarded to `MediumEditableContent`.
 *
 * @returns {JSX.Element}
 * Editable finance form.
 */
// Definuje výchozí obsah pro vytváření financí.
const DefaultContent = (props) => (
    <MediumEditableContent {...props} />
);


/**
 * Default asynchronous GraphQL action used to create finance entities.
 *
 * @constant
 * @type {Function}
 */
// Uchovává výchozí mutační akci pro vytvoření finance entity.
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
// Definuje pravidla oprávnění pro tvorbu financí.
const permissions = {
    oneOfRoles: ["administrátor"],
    mode: "absolute"
};


/**
 * Default finance entity draft used during creation.
 *
 * @constant
 * @type {{name: string}}
 */
// Definuje počáteční data nově vytvářené finance entity.
const defaultitem = {
    name: "Nový"
};


/**
 * Renders a navigation link to the finance creation page.
 *
 * The component wraps `BaseCreateLink`, applies the default create URI
 * and enforces the configured role permissions.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {string} [props.uriPattern=CreateURI]
 * URI pattern used for navigation to the creation page.
 *
 * @param {*} [props.children]
 * Content rendered inside the link.
 *
 * @returns {JSX.Element}
 * Permission-aware navigation link to the finance creation page.
 *
 * @example
 * <CreateLink className="btn btn-success">
 *     Vytvořit nový
 * </CreateLink>
 */
// Exportuje komponentu pro odkaz na stránku tvorby financí.
export const CreateLink = ({
    uriPattern = CreateURI,
    ...props
}) => (
    <BaseCreateLink
        {...props}
        uriPattern={uriPattern}
        {...permissions}
    />
);


/**
 * Displays a modal dialog for creating a finance entity.
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
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {string} [props.readItemURI=ReadItemURI]
 * URI used after successful creation.
 *
 * @param {Object} [props.item=defaultitem]
 * Initial finance entity draft.
 *
 * @param {Function} [props.onOk]
 * Callback executed after successful confirmation.
 *
 * @param {Function} [props.onCancel]
 * Callback executed when the dialog is cancelled.
 *
 * @returns {JSX.Element}
 * Finance creation dialog.
 */
// Exportuje komponentu pro dialog tvorby finance entity.
export const CreateDialog = ({
    title = "Nov(ý/é)",
    DefaultContent: defaultContent = DefaultContent,
    readItemURI = ReadItemURI,
    item = defaultitem,
    ...props
}) => {
    return (
        <BaseCreateDialog
            {...props}
            title={title}
            DefaultContent={defaultContent}
            readItemURI={readItemURI}
            item={item}
        />
    );
};


/**
 * Renders a button that opens the finance creation dialog.
 *
 * The component wraps `BaseCreateButton`, supplies the default finance
 * form, creation dialog, GraphQL mutation and permission configuration.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=InsertAsyncAction]
 * Asynchronous action used to create a finance entity.
 *
 * @param {Function} [props.CreateDialog=CreateDialog]
 * Dialog component used to collect finance data.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
 *
 * @param {string} [props.readItemURI=ReadItemURI]
 * URI used after successful creation.
 *
 * @param {Object} [props.rbacitem]
 * RBAC context passed to permission checking.
 *
 * @param {Object} [props.item=defaultitem]
 * Initial finance entity draft.
 *
 * @param {*} [props.children]
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
// Exportuje komponentu pro tlačítko tvorby finance entity.
export const CreateButton = ({
    mutationAsyncAction = MutationAsyncAction,
    CreateDialog: CreateDialog_ = CreateDialog,
    DefaultContent: defaultContent = DefaultContent,
    readItemURI = ReadItemURI,
    rbacitem,
    item = defaultitem,
    ...props
}) => {
    return (
        <BaseCreateButton
            {...props}
            DefaultContent={defaultContent}
            CreateDialog={CreateDialog_}
            readItemURI={readItemURI}
            rbacitem={rbacitem}
            item={item}
            mutationAsyncAction={mutationAsyncAction}
            {...permissions}
        />
    );
};


/**
 * Renders the full-page workflow for creating a finance entity.
 *
 * The component wraps `BaseCreateBody`, injects the finance creation
 * form, configures the default GraphQL mutation and determines the
 * destination page after successful creation.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Function} [props.mutationAsyncAction=InsertAsyncAction]
 * Asynchronous action used to create a finance entity.
 *
 * @param {Function} [props.DefaultContent=DefaultContent]
 * Component used to render editable finance fields.
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
 * @param {*} [props.children]
 * Optional content rendered inside the creation workflow.
 *
 * @returns {JSX.Element}
 * Full-page finance creation interface.
 *
 * @example
 * <CreateBody />
 */
// Exportuje komponentu pro celou stránku tvorby finance entity.
export const CreateBody = ({
    mutationAsyncAction = MutationAsyncAction,
    DefaultContent: defaultContent = DefaultContent,
    readItemURI = ReadItemURI,
    ...props
}) => {
    return (
        <BaseCreateBody
            {...props}
            DefaultContent={defaultContent}
            readItemURI={readItemURI}
            mutationAsyncAction={mutationAsyncAction}
        />
    );
};