import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeDeleteAsyncAction, RequestTypeInsertAsyncAction, RequestTypeUpdateAsyncAction } from "../Queries";
import { RequestTypeMediumEditableContent } from "./RequestTypeMediumEditableContent";

/**
 * RequestTypeCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertRequestTypeButton` for creating a new item (operation "C")
 * - `UpdateRequestTypeButton` for updating an existing item (operation "U")
 * - `DeleteRequestTypeButton` for deleting an existing item (operation "D")
 *
 * This component validates the `requesttype` prop:
 * - For "C" (create), `requesttype` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `requesttype` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `requesttype` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.requesttype - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.requesttype.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.requesttype.name] - The name of the item (optional).
 * @param {string} [props.requesttype.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(requesttype) => {}] - Callback executed after the operation completes. Receives the `requesttype` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <RequestTypeCUDButton
 *         operation="C"
 *         requesttype={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </RequestTypeCUDButton>
 *
 *       <RequestTypeCUDButton
 *         operation="U"
 *         requesttype={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </RequestTypeCUDButton>
 *
 *       <RequestTypeCUDButton
 *         operation="D"
 *         requesttype={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </RequestTypeCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const RequestTypeButton = ({ operation, children, requesttype, onDone = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: RequestTypeInsertAsyncAction,
            dialogTitle: "Vložit novou requesttype",
            loadingMsg: "Vkládám novou requesttype",
            renderContent: () => <RequestTypeMediumEditableContent requesttype={requesttype} />,
        },
        U: {
            asyncAction: RequestTypeUpdateAsyncAction,
            dialogTitle: "Upravit requesttype",
            loadingMsg: "Ukládám requesttype",
            renderContent: () => <RequestTypeMediumEditableContent requesttype={requesttype} />,
        },
        D: {
            asyncAction: RequestTypeDeleteAsyncAction,
            dialogTitle: "Chcete odebrat requesttype?",
            loadingMsg: "Odstraňuji requesttype",
            renderContent: () => (
                <h2>
                    {requesttype?.name} ({requesttype?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, requesttype, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...requesttype, ...params };
        const freshRequestType = await fetch(fetchParams);
        onDone(freshRequestType); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !requesttype?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'requesttype' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={requesttype}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// RequestTypeCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     requesttype: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `requesttype` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// RequestTypeCUDButton.defaultProps = {
//     onDone: () => {},
// };