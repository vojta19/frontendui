import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";
// import { InsertProgramButton } from "./CUDButtons/InsertProgramButton";
// import { UpdateProgramButton } from "./CUDButtons/UpdateProgramButton";
// import { DeleteProgramButton } from "./CUDButtons/DeleteProgramButton";
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";

/**
 * ProgramCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertProgramButton` for creating a new item (operation "C")
 * - `UpdateProgramButton` for updating an existing item (operation "U")
 * - `DeleteProgramButton` for deleting an existing item (operation "D")
 *
 * This component validates the `program` prop:
 * - For "C" (create), `program` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `program` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `program` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the ProgramCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.program - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.program.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.program.name] - The name of the item (optional).
 * @param {string} [props.program.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(program) => {}] - Callback executed after the operation completes. Receives the `program` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <ProgramCUDButton
 *         operation="C"
 *         program={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </ProgramCUDButton>
 *
 *       <ProgramCUDButton
 *         operation="U"
 *         program={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </ProgramCUDButton>
 *
 *       <ProgramCUDButton
 *         operation="D"
 *         program={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </ProgramCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const ProgramButton = ({ operation, children, program, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: ProgramInsertAsyncAction,
            dialogTitle: "Vložit novou program",
            loadingMsg: "Vkládám novou program",
            renderContent: () => <ProgramMediumEditableContent program={program} />,
        },
        U: {
            asyncAction: ProgramUpdateAsyncAction,
            dialogTitle: "Upravit program",
            loadingMsg: "Ukládám program",
            renderContent: () => <ProgramMediumEditableContent program={program} />,
        },
        D: {
            asyncAction: ProgramDeleteAsyncAction,
            dialogTitle: "Chcete odebrat program?",
            loadingMsg: "Odstraňuji program",
            renderContent: () => (
                <h2>
                    {program?.name} ({program?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, program, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...program, ...params };
        onOptimistic(fetchParams);
        const freshProgram = await fetch(fetchParams);
        onDone(freshProgram); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !program?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'program' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={program}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// ProgramCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     program: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `program` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// ProgramCUDButton.defaultProps = {
//     onDone: () => {},
// };