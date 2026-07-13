import { useCallback } from "react";

import { UpdateAsyncAction } from "../Queries";
import { MediumEditableContent } from "./MediumEditableContent";

import {
    useEditAction
} from "../../../../dynamic/src/Hooks/useEditAction";

import {
    useGQLEntityContext
} from "../../../../_template/src/Base/Helpers/GQLEntityProvider";


/**
 * Displays a confirmation-based editing interface for a finance entity.
 *
 * The component manages a local editable draft through `useEditAction`.
 * Unlike live editing, changes are not persisted immediately. The user must
 * explicitly confirm or cancel the modifications using the provided action
 * buttons.
 *
 * After a successful update, the returned entity is propagated to the
 * surrounding GraphQL entity context so that other components can use the
 * current data.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Original finance entity used to initialize the editable draft.
 *
 * @param {string} [props.item.id]
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Czech name of the finance entity.
 *
 * @param {string} [props.item.nameEn]
 * English name of the finance entity.
 *
 * @param {string} [props.item.description]
 * Description of the finance entity.
 *
 * @param {React.ReactNode} [props.children]
 * Optional additional form fields or content rendered below the standard
 * editable finance fields.
 *
 * @returns {JSX.Element}
 * Confirmation-based finance editing form.
 *
 * @example
 * <ConfirmEdit item={finance}>
 *     <p>Změny se uloží až po potvrzení.</p>
 * </ConfirmEdit>
 */
export const ConfirmEdit = ({
    item,
    children
}) => {
    const {
        onChange: contextOnChange
    } = useGQLEntityContext();

    const {
        draft,
        dirty,
        loading: saving,
        onChange,
        onBlur,
        onCancel,
        onConfirm
    } = useEditAction(
        UpdateAsyncAction,
        item,
        {
            mode: "confirm"
        }
    );


    /**
     * Persists the current finance draft and synchronizes the returned entity
     * with the surrounding GraphQL context.
     *
     * @async
     *
     * @returns {Promise<Object|undefined>}
     * Updated finance entity returned by the mutation, or `undefined` when
     * the update was not completed.
     */
    const handleConfirm = useCallback(async () => {
        const result = await onConfirm();

        if (
            result &&
            typeof contextOnChange === "function"
        ) {
            await contextOnChange({
                target: {
                    value: result
                }
            });
        }

        return result;
    }, [
        contextOnChange,
        onConfirm
    ]);


    return (
        <MediumEditableContent
            item={draft ?? item}
            onChange={onChange}
            onBlur={onBlur}
        >
            {children}

            <hr />

            <button
                type="button"
                className="btn btn-warning form-control"
                onClick={onCancel}
                disabled={!dirty || saving}
            >
                Zrušit změny
            </button>

            <button
                type="button"
                className="btn btn-primary form-control"
                onClick={handleConfirm}
                disabled={!dirty || saving}
            >
                {saving
                    ? "Ukládám změny..."
                    : "Uložit změny"}
            </button>
        </MediumEditableContent>
    );
};