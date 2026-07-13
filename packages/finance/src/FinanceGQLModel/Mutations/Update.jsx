import {
    UpdateBody as BaseUpdateBody,
    UpdateButton as BaseUpdateButton,
    UpdateDialog as BaseUpdateDialog,
    UpdateLink as BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update";

import {
    MediumEditableContent,
    UpdateItemURI
} from "../Components";

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
const DefaultContent = (props) => (
    <MediumEditableContent {...props} />
);


/**
 * Default GraphQL async action used to update finance entities.
 *
 * @constant
 * @type {Function}
 */
const mutationAsyncAction = UpdateAsyncAction;


/**
 * Permission configuration applied to all finance update controls.
 *
 * Only users with the `administrátor` role can access the update actions.
 *
 * @constant
 * @type {{oneOfRoles: string[], mode: string}}
 */
const permissions = {
    oneOfRoles: ["administrátor"],
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
    uriPattern = UpdateItemURI,
    ...props
}) => {
    return (
        <BaseUpdateLink
            {...props}
            uriPattern={uriPattern}
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
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ =
        mutationAsyncAction,
    ...props
}) => {
    return (
        <BaseUpdateDialog
            {...props}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
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
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = UpdateDialog,
    mutationAsyncAction: mutationAsyncAction_ =
        mutationAsyncAction,
    ...props
}) => {
    return (
        <BaseUpdateButton
            {...props}
            DefaultContent={DefaultContent_}
            Dialog={Dialog}
            mutationAsyncAction={mutationAsyncAction_}
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
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ =
        mutationAsyncAction,
    ...props
}) => {
    return (
        <BaseUpdateBody
            {...props}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            {...permissions}
        />
    );
};