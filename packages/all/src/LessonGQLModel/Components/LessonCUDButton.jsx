import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { LessonDeleteAsyncAction, LessonInsertAsyncAction, LessonUpdateAsyncAction } from "../Queries";
import { LessonMediumEditableContent } from "./LessonMediumEditableContent";

/**
 * LessonCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertLessonButton` for creating a new item (operation "C")
 * - `UpdateLessonButton` for updating an existing item (operation "U")
 * - `DeleteLessonButton` for deleting an existing item (operation "D")
 *
 * This component validates the `lesson` prop:
 * - For "C" (create), `lesson` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `lesson` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `lesson` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the LessonCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.lesson - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.lesson.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.lesson.name] - The name of the item (optional).
 * @param {string} [props.lesson.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(lesson) => {}] - Callback executed after the operation completes. Receives the `lesson` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <LessonCUDButton
 *         operation="C"
 *         lesson={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </LessonCUDButton>
 *
 *       <LessonCUDButton
 *         operation="U"
 *         lesson={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </LessonCUDButton>
 *
 *       <LessonCUDButton
 *         operation="D"
 *         lesson={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </LessonCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const LessonButton = ({ operation, children, lesson, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: LessonInsertAsyncAction,
            dialogTitle: "Vložit novou lesson",
            loadingMsg: "Vkládám novou lesson",
            renderContent: () => <LessonMediumEditableContent lesson={lesson} />,
        },
        U: {
            asyncAction: LessonUpdateAsyncAction,
            dialogTitle: "Upravit lesson",
            loadingMsg: "Ukládám lesson",
            renderContent: () => <LessonMediumEditableContent lesson={lesson} />,
        },
        D: {
            asyncAction: LessonDeleteAsyncAction,
            dialogTitle: "Chcete odebrat lesson?",
            loadingMsg: "Odstraňuji lesson",
            renderContent: () => (
                <h2>
                    {lesson?.name} ({lesson?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, lesson, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...lesson, ...params };
        onOptimistic(fetchParams);
        const freshLesson = await fetch(fetchParams);
        onDone(freshLesson); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !lesson?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'lesson' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={lesson}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// LessonCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     lesson: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `lesson` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// LessonCUDButton.defaultProps = {
//     onDone: () => {},
// };