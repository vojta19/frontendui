import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { StudyPlanLessonDeleteAsyncAction, StudyPlanLessonInsertAsyncAction, StudyPlanLessonUpdateAsyncAction } from "../Queries";
import { StudyPlanLessonMediumEditableContent } from "./StudyPlanLessonMediumEditableContent";

/**
 * StudyPlanLessonCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertStudyPlanLessonButton` for creating a new item (operation "C")
 * - `UpdateStudyPlanLessonButton` for updating an existing item (operation "U")
 * - `DeleteStudyPlanLessonButton` for deleting an existing item (operation "D")
 *
 * This component validates the `studyplanlesson` prop:
 * - For "C" (create), `studyplanlesson` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `studyplanlesson` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `studyplanlesson` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the StudyPlanLessonCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.studyplanlesson - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.studyplanlesson.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.studyplanlesson.name] - The name of the item (optional).
 * @param {string} [props.studyplanlesson.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(studyplanlesson) => {}] - Callback executed after the operation completes. Receives the `studyplanlesson` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <StudyPlanLessonCUDButton
 *         operation="C"
 *         studyplanlesson={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </StudyPlanLessonCUDButton>
 *
 *       <StudyPlanLessonCUDButton
 *         operation="U"
 *         studyplanlesson={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </StudyPlanLessonCUDButton>
 *
 *       <StudyPlanLessonCUDButton
 *         operation="D"
 *         studyplanlesson={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </StudyPlanLessonCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const StudyPlanLessonButton = ({ operation, children, studyplanlesson, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: StudyPlanLessonInsertAsyncAction,
            dialogTitle: "Vložit novou studyplanlesson",
            loadingMsg: "Vkládám novou studyplanlesson",
            renderContent: () => <StudyPlanLessonMediumEditableContent studyplanlesson={studyplanlesson} />,
        },
        U: {
            asyncAction: StudyPlanLessonUpdateAsyncAction,
            dialogTitle: "Upravit studyplanlesson",
            loadingMsg: "Ukládám studyplanlesson",
            renderContent: () => <StudyPlanLessonMediumEditableContent studyplanlesson={studyplanlesson} />,
        },
        D: {
            asyncAction: StudyPlanLessonDeleteAsyncAction,
            dialogTitle: "Chcete odebrat studyplanlesson?",
            loadingMsg: "Odstraňuji studyplanlesson",
            renderContent: () => (
                <h2>
                    {studyplanlesson?.name} ({studyplanlesson?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, studyplanlesson, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...studyplanlesson, ...params };
        onOptimistic(fetchParams);
        const freshStudyPlanLesson = await fetch(fetchParams);
        onDone(freshStudyPlanLesson); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !studyplanlesson?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'studyplanlesson' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={studyplanlesson}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// StudyPlanLessonCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     studyplanlesson: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `studyplanlesson` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// StudyPlanLessonCUDButton.defaultProps = {
//     onDone: () => {},
// };