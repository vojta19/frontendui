import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormDeleteAsyncAction, DigitalFormInsertAsyncAction, DigitalFormUpdateAsyncAction } from "../Queries";
import { DigitalFormMediumEditableContent } from "./DigitalFormMediumEditableContent";

/**
 * DigitalFormCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertDigitalFormButton` for creating a new item (operation "C")
 * - `UpdateDigitalFormButton` for updating an existing item (operation "U")
 * - `DeleteDigitalFormButton` for deleting an existing item (operation "D")
 *
 * This component validates the `digitalform` prop:
 * - For "C" (create), `digitalform` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `digitalform` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `digitalform` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.digitalform - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.digitalform.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.digitalform.name] - The name of the item (optional).
 * @param {string} [props.digitalform.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(digitalform) => {}] - Callback executed after the operation completes. Receives the `digitalform` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <DigitalFormCUDButton
 *         operation="C"
 *         digitalform={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </DigitalFormCUDButton>
 *
 *       <DigitalFormCUDButton
 *         operation="U"
 *         digitalform={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </DigitalFormCUDButton>
 *
 *       <DigitalFormCUDButton
 *         operation="D"
 *         digitalform={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </DigitalFormCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const DigitalFormButton = ({ operation, children, digitalform, onDone = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: DigitalFormInsertAsyncAction,
            dialogTitle: "Vložit novou digitalform",
            loadingMsg: "Vkládám novou digitalform",
            renderContent: () => <DigitalFormMediumEditableContent digitalform={digitalform} />,
        },
        U: {
            asyncAction: DigitalFormUpdateAsyncAction,
            dialogTitle: "Upravit digitalform",
            loadingMsg: "Ukládám digitalform",
            renderContent: () => <DigitalFormMediumEditableContent digitalform={digitalform} />,
        },
        D: {
            asyncAction: DigitalFormDeleteAsyncAction,
            dialogTitle: "Chcete odebrat digitalform?",
            loadingMsg: "Odstraňuji digitalform",
            renderContent: () => (
                <h2>
                    {digitalform?.name} ({digitalform?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, digitalform, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...digitalform, ...params };
        const freshDigitalForm = await fetch(fetchParams);
        onDone(freshDigitalForm); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !digitalform?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'digitalform' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={digitalform}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// DigitalFormCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     digitalform: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `digitalform` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// DigitalFormCUDButton.defaultProps = {
//     onDone: () => {},
// };