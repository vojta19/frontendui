import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { StateTransitionDeleteAsyncAction, StateTransitionInsertAsyncAction, StateTransitionUpdateAsyncAction } from "../Queries";
import { StateTransitionMediumEditableContent } from "./StateTransitionMediumEditableContent";

/**
 * StateTransitionCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertStateTransitionButton` for creating a new item (operation "C")
 * - `UpdateStateTransitionButton` for updating an existing item (operation "U")
 * - `DeleteStateTransitionButton` for deleting an existing item (operation "D")
 *
 * This component validates the `statetransition` prop:
 * - For "C" (create), `statetransition` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `statetransition` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `statetransition` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the StateTransitionCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.statetransition - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.statetransition.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.statetransition.name] - The name of the item (optional).
 * @param {string} [props.statetransition.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(statetransition) => {}] - Callback executed after the operation completes. Receives the `statetransition` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <StateTransitionCUDButton
 *         operation="C"
 *         statetransition={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </StateTransitionCUDButton>
 *
 *       <StateTransitionCUDButton
 *         operation="U"
 *         statetransition={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </StateTransitionCUDButton>
 *
 *       <StateTransitionCUDButton
 *         operation="D"
 *         statetransition={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </StateTransitionCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const StateTransitionButton = ({ operation, children, statetransition, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: StateTransitionInsertAsyncAction,
            dialogTitle: "Vložit novou statetransition",
            loadingMsg: "Vkládám novou statetransition",
            renderContent: () => <StateTransitionMediumEditableContent statetransition={statetransition} />,
        },
        U: {
            asyncAction: StateTransitionUpdateAsyncAction,
            dialogTitle: "Upravit statetransition",
            loadingMsg: "Ukládám statetransition",
            renderContent: () => <StateTransitionMediumEditableContent statetransition={statetransition} />,
        },
        D: {
            asyncAction: StateTransitionDeleteAsyncAction,
            dialogTitle: "Chcete odebrat statetransition?",
            loadingMsg: "Odstraňuji statetransition",
            renderContent: () => (
                <h2>
                    {statetransition?.name} ({statetransition?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, statetransition, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...statetransition, ...params };
        onOptimistic(fetchParams);
        const freshStateTransition = await fetch(fetchParams);
        onDone(freshStateTransition); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !statetransition?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'statetransition' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={statetransition}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// StateTransitionCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     statetransition: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `statetransition` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// StateTransitionCUDButton.defaultProps = {
//     onDone: () => {},
// };