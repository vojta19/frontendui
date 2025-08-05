import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { StudentDeleteAsyncAction, StudentInsertAsyncAction, StudentUpdateAsyncAction } from "../Queries";
import { StudentMediumEditableContent } from "./StudentMediumEditableContent";

/**
 * StudentCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertStudentButton` for creating a new item (operation "C")
 * - `UpdateStudentButton` for updating an existing item (operation "U")
 * - `DeleteStudentButton` for deleting an existing item (operation "D")
 *
 * This component validates the `student` prop:
 * - For "C" (create), `student` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `student` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `student` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the StudentCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.student - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.student.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.student.name] - The name of the item (optional).
 * @param {string} [props.student.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(student) => {}] - Callback executed after the operation completes. Receives the `student` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <StudentCUDButton
 *         operation="C"
 *         student={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </StudentCUDButton>
 *
 *       <StudentCUDButton
 *         operation="U"
 *         student={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </StudentCUDButton>
 *
 *       <StudentCUDButton
 *         operation="D"
 *         student={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </StudentCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const StudentButton = ({ operation, children, student, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: StudentInsertAsyncAction,
            dialogTitle: "Vložit novou student",
            loadingMsg: "Vkládám novou student",
            renderContent: () => <StudentMediumEditableContent student={student} />,
        },
        U: {
            asyncAction: StudentUpdateAsyncAction,
            dialogTitle: "Upravit student",
            loadingMsg: "Ukládám student",
            renderContent: () => <StudentMediumEditableContent student={student} />,
        },
        D: {
            asyncAction: StudentDeleteAsyncAction,
            dialogTitle: "Chcete odebrat student?",
            loadingMsg: "Odstraňuji student",
            renderContent: () => (
                <h2>
                    {student?.name} ({student?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, student, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...student, ...params };
        onOptimistic(fetchParams);
        const freshStudent = await fetch(fetchParams);
        onDone(freshStudent); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !student?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'student' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={student}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// StudentCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     student: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `student` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// StudentCUDButton.defaultProps = {
//     onDone: () => {},
// };