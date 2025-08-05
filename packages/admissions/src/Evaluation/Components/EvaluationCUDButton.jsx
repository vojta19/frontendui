import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";
// import { InsertEvaluationButton } from "./CUDButtons/InsertEvaluationButton";
// import { UpdateEvaluationButton } from "./CUDButtons/UpdateEvaluationButton";
// import { DeleteEvaluationButton } from "./CUDButtons/DeleteEvaluationButton";
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";

/**
 * EvaluationCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertEvaluationButton` for creating a new item (operation "C")
 * - `UpdateEvaluationButton` for updating an existing item (operation "U")
 * - `DeleteEvaluationButton` for deleting an existing item (operation "D")
 *
 * This component validates the `evaluation` prop:
 * - For "C" (create), `evaluation` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `evaluation` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `evaluation` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the EvaluationCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.evaluation - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.evaluation.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.evaluation.name] - The name of the item (optional).
 * @param {string} [props.evaluation.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(evaluation) => {}] - Callback executed after the operation completes. Receives the `evaluation` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <EvaluationCUDButton
 *         operation="C"
 *         evaluation={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </EvaluationCUDButton>
 *
 *       <EvaluationCUDButton
 *         operation="U"
 *         evaluation={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </EvaluationCUDButton>
 *
 *       <EvaluationCUDButton
 *         operation="D"
 *         evaluation={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </EvaluationCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const EvaluationButton = ({ operation, children, evaluation, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: EvaluationInsertAsyncAction,
            dialogTitle: "Vložit novou evaluation",
            loadingMsg: "Vkládám novou evaluation",
            renderContent: () => <EvaluationMediumEditableContent evaluation={evaluation} />,
        },
        U: {
            asyncAction: EvaluationUpdateAsyncAction,
            dialogTitle: "Upravit evaluation",
            loadingMsg: "Ukládám evaluation",
            renderContent: () => <EvaluationMediumEditableContent evaluation={evaluation} />,
        },
        D: {
            asyncAction: EvaluationDeleteAsyncAction,
            dialogTitle: "Chcete odebrat evaluation?",
            loadingMsg: "Odstraňuji evaluation",
            renderContent: () => (
                <h2>
                    {evaluation?.name} ({evaluation?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, evaluation, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...evaluation, ...params };
        onOptimistic(fetchParams);
        const freshEvaluation = await fetch(fetchParams);
        onDone(freshEvaluation); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !evaluation?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'evaluation' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={evaluation}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// EvaluationCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     evaluation: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `evaluation` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// EvaluationCUDButton.defaultProps = {
//     onDone: () => {},
// };