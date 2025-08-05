import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { StateMachineDeleteAsyncAction, StateMachineInsertAsyncAction, StateMachineUpdateAsyncAction } from "../Queries";
import { StateMachineMediumEditableContent } from "./StateMachineMediumEditableContent";

/**
 * StateMachineCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertStateMachineButton` for creating a new item (operation "C")
 * - `UpdateStateMachineButton` for updating an existing item (operation "U")
 * - `DeleteStateMachineButton` for deleting an existing item (operation "D")
 *
 * This component validates the `statemachine` prop:
 * - For "C" (create), `statemachine` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `statemachine` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `statemachine` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the StateMachineCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.statemachine - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.statemachine.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.statemachine.name] - The name of the item (optional).
 * @param {string} [props.statemachine.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(statemachine) => {}] - Callback executed after the operation completes. Receives the `statemachine` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <StateMachineCUDButton
 *         operation="C"
 *         statemachine={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </StateMachineCUDButton>
 *
 *       <StateMachineCUDButton
 *         operation="U"
 *         statemachine={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </StateMachineCUDButton>
 *
 *       <StateMachineCUDButton
 *         operation="D"
 *         statemachine={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </StateMachineCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const StateMachineButton = ({ operation, children, statemachine, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: StateMachineInsertAsyncAction,
            dialogTitle: "Vložit novou statemachine",
            loadingMsg: "Vkládám novou statemachine",
            renderContent: () => <StateMachineMediumEditableContent statemachine={statemachine} />,
        },
        U: {
            asyncAction: StateMachineUpdateAsyncAction,
            dialogTitle: "Upravit statemachine",
            loadingMsg: "Ukládám statemachine",
            renderContent: () => <StateMachineMediumEditableContent statemachine={statemachine} />,
        },
        D: {
            asyncAction: StateMachineDeleteAsyncAction,
            dialogTitle: "Chcete odebrat statemachine?",
            loadingMsg: "Odstraňuji statemachine",
            renderContent: () => (
                <h2>
                    {statemachine?.name} ({statemachine?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, statemachine, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...statemachine, ...params };
        onOptimistic(fetchParams);
        const freshStateMachine = await fetch(fetchParams);
        onDone(freshStateMachine); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !statemachine?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'statemachine' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={statemachine}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// StateMachineCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     statemachine: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `statemachine` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// StateMachineCUDButton.defaultProps = {
//     onDone: () => {},
// };