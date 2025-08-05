import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { SemesterDeleteAsyncAction, SemesterInsertAsyncAction, SemesterUpdateAsyncAction } from "../Queries";
import { SemesterMediumEditableContent } from "./SemesterMediumEditableContent";

/**
 * SemesterCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertSemesterButton` for creating a new item (operation "C")
 * - `UpdateSemesterButton` for updating an existing item (operation "U")
 * - `DeleteSemesterButton` for deleting an existing item (operation "D")
 *
 * This component validates the `semester` prop:
 * - For "C" (create), `semester` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `semester` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `semester` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the SemesterCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.semester - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.semester.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.semester.name] - The name of the item (optional).
 * @param {string} [props.semester.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(semester) => {}] - Callback executed after the operation completes. Receives the `semester` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <SemesterCUDButton
 *         operation="C"
 *         semester={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </SemesterCUDButton>
 *
 *       <SemesterCUDButton
 *         operation="U"
 *         semester={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </SemesterCUDButton>
 *
 *       <SemesterCUDButton
 *         operation="D"
 *         semester={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </SemesterCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const SemesterButton = ({ operation, children, semester, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: SemesterInsertAsyncAction,
            dialogTitle: "Vložit novou semester",
            loadingMsg: "Vkládám novou semester",
            renderContent: () => <SemesterMediumEditableContent semester={semester} />,
        },
        U: {
            asyncAction: SemesterUpdateAsyncAction,
            dialogTitle: "Upravit semester",
            loadingMsg: "Ukládám semester",
            renderContent: () => <SemesterMediumEditableContent semester={semester} />,
        },
        D: {
            asyncAction: SemesterDeleteAsyncAction,
            dialogTitle: "Chcete odebrat semester?",
            loadingMsg: "Odstraňuji semester",
            renderContent: () => (
                <h2>
                    {semester?.name} ({semester?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, semester, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...semester, ...params };
        onOptimistic(fetchParams);
        const freshSemester = await fetch(fetchParams);
        onDone(freshSemester); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !semester?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'semester' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={semester}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// SemesterCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     semester: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `semester` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// SemesterCUDButton.defaultProps = {
//     onDone: () => {},
// };