import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { SubjectDeleteAsyncAction, SubjectInsertAsyncAction, SubjectUpdateAsyncAction } from "../Queries";
import { SubjectMediumEditableContent } from "./SubjectMediumEditableContent";

/**
 * SubjectCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertSubjectButton` for creating a new item (operation "C")
 * - `UpdateSubjectButton` for updating an existing item (operation "U")
 * - `DeleteSubjectButton` for deleting an existing item (operation "D")
 *
 * This component validates the `subject` prop:
 * - For "C" (create), `subject` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `subject` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `subject` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the SubjectCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.subject - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.subject.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.subject.name] - The name of the item (optional).
 * @param {string} [props.subject.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(subject) => {}] - Callback executed after the operation completes. Receives the `subject` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <SubjectCUDButton
 *         operation="C"
 *         subject={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </SubjectCUDButton>
 *
 *       <SubjectCUDButton
 *         operation="U"
 *         subject={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </SubjectCUDButton>
 *
 *       <SubjectCUDButton
 *         operation="D"
 *         subject={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </SubjectCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const SubjectButton = ({ operation, children, subject, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: SubjectInsertAsyncAction,
            dialogTitle: "Vložit novou subject",
            loadingMsg: "Vkládám novou subject",
            renderContent: () => <SubjectMediumEditableContent subject={subject} />,
        },
        U: {
            asyncAction: SubjectUpdateAsyncAction,
            dialogTitle: "Upravit subject",
            loadingMsg: "Ukládám subject",
            renderContent: () => <SubjectMediumEditableContent subject={subject} />,
        },
        D: {
            asyncAction: SubjectDeleteAsyncAction,
            dialogTitle: "Chcete odebrat subject?",
            loadingMsg: "Odstraňuji subject",
            renderContent: () => (
                <h2>
                    {subject?.name} ({subject?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, subject, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...subject, ...params };
        onOptimistic(fetchParams);
        const freshSubject = await fetch(fetchParams);
        onDone(freshSubject); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !subject?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'subject' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={subject}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// SubjectCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     subject: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `subject` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// SubjectCUDButton.defaultProps = {
//     onDone: () => {},
// };