import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestDeleteAsyncAction, RequestInsertAsyncAction, RequestUpdateAsyncAction } from "../Queries";
import { RequestMediumEditableContent } from "./RequestMediumEditableContent";

/**
 * RequestCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertRequestButton` for creating a new item (operation "C")
 * - `UpdateRequestButton` for updating an existing item (operation "U")
 * - `DeleteRequestButton` for deleting an existing item (operation "D")
 *
 * This component validates the `request` prop:
 * - For "C" (create), `request` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `request` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `request` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the RequestCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.request - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.request.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.request.name] - The name of the item (optional).
 * @param {string} [props.request.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(request) => {}] - Callback executed after the operation completes. Receives the `request` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <RequestCUDButton
 *         operation="C"
 *         request={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </RequestCUDButton>
 *
 *       <RequestCUDButton
 *         operation="U"
 *         request={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </RequestCUDButton>
 *
 *       <RequestCUDButton
 *         operation="D"
 *         request={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </RequestCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const RequestButton = ({ operation, children, request, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: RequestInsertAsyncAction,
            dialogTitle: "Vložit novou request",
            loadingMsg: "Vkládám novou request",
            renderContent: () => <RequestMediumEditableContent request={request} />,
        },
        U: {
            asyncAction: RequestUpdateAsyncAction,
            dialogTitle: "Upravit request",
            loadingMsg: "Ukládám request",
            renderContent: () => <RequestMediumEditableContent request={request} />,
        },
        D: {
            asyncAction: RequestDeleteAsyncAction,
            dialogTitle: "Chcete odebrat request?",
            loadingMsg: "Odstraňuji request",
            renderContent: () => (
                <h2>
                    {request?.name} ({request?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, request, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...request, ...params };
        onOptimistic(fetchParams);
        const freshRequest = await fetch(fetchParams);
        onDone(freshRequest); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !request?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'request' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={request}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// RequestCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     request: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `request` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// RequestCUDButton.defaultProps = {
//     onDone: () => {},
// };