import {
    useCallback,
    useMemo
} from "react";

import {
    LoadingSpinner
} from "@hrbolek/uoisfrontend-shared";

import { UpdateAsyncAction } from "../Queries";
import { MediumEditableContent } from "./MediumEditableContent";

import {
    AsyncActionProvider,
    useGQLEntityContext
} from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

import {
    useEditAction
} from "../../../../dynamic/src/Hooks/useEditAction";


/**
 * Provides the context-based live-edit workflow for a finance entity.
 *
 * The component reads the current finance entity and its event handlers from
 * the surrounding GraphQL entity context. It then creates a nested asynchronous
 * action provider configured to execute the supplied update action.
 *
 * This variant is intended for pages that already use
 * `GQLEntityProvider` or `AsyncActionProvider`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ReactNode} [props.children]
 * Optional content rendered below the editable finance fields.
 *
 * @param {Function} [props.asyncAction=UpdateAsyncAction]
 * Asynchronous GraphQL action used to persist finance changes.
 *
 * @returns {JSX.Element}
 * Context-based live-edit interface.
 *
 * @example
 * <LiveEdit_>
 *     <p>Změny se ukládají po opuštění pole.</p>
 * </LiveEdit_>
 */
export const LiveEdit_ = ({
    children,
    asyncAction = UpdateAsyncAction
}) => {
    const {
        onChange,
        onBlur,
        item
    } = useGQLEntityContext();

    return (
        <AsyncActionProvider
            item={item}
            queryAsyncAction={asyncAction}
            options={{
                deferred: true,
                network: true
            }}
            onChange={onChange}
            onBlur={onBlur}
        >
            <LiveEditWrapper item={item}>
                {children}
            </LiveEditWrapper>
        </AsyncActionProvider>
    );
};


/**
 * Adapts field-level input events to the object-level events expected by the
 * asynchronous entity context.
 *
 * `MediumEditableContent` emits events containing a field identifier and its
 * new value. The wrapper creates an updated copy of the complete finance
 * entity and passes it to the context handler.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity currently being edited.
 *
 * @param {React.ReactNode} [props.children]
 * Optional content rendered inside the editable form.
 *
 * @returns {JSX.Element}
 * Editable finance form connected to the asynchronous entity context.
 */
const LiveEditWrapper = ({
    item,
    children
}) => {
    const {
        onChange,
        onBlur
    } = useGQLEntityContext();


    /**
     * Creates an event handler that converts a field-level event into an
     * object-level finance update event.
     *
     * @param {Function} handler
     * Context handler that receives the updated finance entity.
     *
     * @returns {Function}
     * Asynchronous input event handler.
     */
    const handleEvent = useCallback(
        (handler) => async (event) => {
            const {
                id,
                value
            } = event?.target ?? {};

            if (
                id === undefined ||
                value === undefined ||
                typeof handler !== "function"
            ) {
                return undefined;
            }

            if (item?.[id] === value) {
                return undefined;
            }

            const updatedItem = {
                ...item,
                [id]: value
            };

            const updatedEvent = {
                target: {
                    id,
                    value: updatedItem
                }
            };

            return handler(updatedEvent);
        },
        [item]
    );


    const boundOnChange = useMemo(
        () => handleEvent(onChange),
        [handleEvent, onChange]
    );

    const boundOnBlur = useMemo(
        () => handleEvent(onBlur),
        [handleEvent, onBlur]
    );


    return (
        <MediumEditableContent
            item={item}
            onChange={boundOnChange}
            onBlur={boundOnBlur}
        >
            {children}
        </MediumEditableContent>
    );
};


/**
 * Displays a standalone live-edit form for a finance entity.
 *
 * The component uses `useEditAction` in live mode. Input changes are stored in
 * a local draft and persisted through the configured update mutation when the
 * corresponding field loses focus.
 *
 * A loading indicator is displayed while an update request is being processed.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Original finance entity used to initialize the editable draft.
 *
 * @param {React.ReactNode} [props.children]
 * Optional content rendered below the editable fields.
 *
 * @param {Function} [props.asyncMutationAction=UpdateAsyncAction]
 * Asynchronous GraphQL mutation used to persist changes.
 *
 * @returns {JSX.Element}
 * Standalone live-edit form for a finance entity.
 *
 * @example
 * <LiveEdit
 *     item={finance}
 *     asyncMutationAction={UpdateAsyncAction}
 * >
 *     <small>Změny se ukládají automaticky.</small>
 * </LiveEdit>
 */
export const LiveEdit = ({
    item,
    children,
    asyncMutationAction = UpdateAsyncAction
}) => {
    const {
        draft,
        loading: saving,
        onChange,
        onBlur
    } = useEditAction(
        asyncMutationAction,
        item,
        {
            mode: "live"
        }
    );

    return (
        <MediumEditableContent
            item={draft ?? item}
            onChange={onChange}
            onBlur={onBlur}
        >
            {saving && <LoadingSpinner />}

            {children}
        </MediumEditableContent>
    );
};