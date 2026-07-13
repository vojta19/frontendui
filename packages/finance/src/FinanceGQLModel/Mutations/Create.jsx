import {
    CreateURI,
    MediumEditableContent,
    ReadItemURI
} from "../Components";

import { InsertAsyncAction } from "../Queries";

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
const DefaultContent = (props) => (
    <MediumEditableContent {...props} />
);


/**
 * Default GraphQL mutation used to create finance entities.
 *
 * @constant
 * @type {Function}
 */
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
const permissions = {
    oneOfRoles: ["administrátor"],
    mode: "absolute"
};


/**
 * Default draft used when creating a new finance entity.
 *
 * @constant
 * @type {{name: string}}
 */
const defaultitem = {
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