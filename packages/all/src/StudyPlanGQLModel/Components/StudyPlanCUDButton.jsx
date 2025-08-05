import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { StudyPlanDeleteAsyncAction, StudyPlanInsertAsyncAction, StudyPlanUpdateAsyncAction } from "../Queries";
import { StudyPlanMediumEditableContent } from "./StudyPlanMediumEditableContent";

/**
 * StudyPlanCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertStudyPlanButton` for creating a new item (operation "C")
 * - `UpdateStudyPlanButton` for updating an existing item (operation "U")
 * - `DeleteStudyPlanButton` for deleting an existing item (operation "D")
 *
 * This component validates the `studyplan` prop:
 * - For "C" (create), `studyplan` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `studyplan` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `studyplan` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the StudyPlanCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.studyplan - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.studyplan.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.studyplan.name] - The name of the item (optional).
 * @param {string} [props.studyplan.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(studyplan) => {}] - Callback executed after the operation completes. Receives the `studyplan` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <StudyPlanCUDButton
 *         operation="C"
 *         studyplan={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </StudyPlanCUDButton>
 *
 *       <StudyPlanCUDButton
 *         operation="U"
 *         studyplan={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </StudyPlanCUDButton>
 *
 *       <StudyPlanCUDButton
 *         operation="D"
 *         studyplan={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </StudyPlanCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const StudyPlanButton = ({ operation, children, studyplan, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: StudyPlanInsertAsyncAction,
            dialogTitle: "Vložit novou studyplan",
            loadingMsg: "Vkládám novou studyplan",
            renderContent: () => <StudyPlanMediumEditableContent studyplan={studyplan} />,
        },
        U: {
            asyncAction: StudyPlanUpdateAsyncAction,
            dialogTitle: "Upravit studyplan",
            loadingMsg: "Ukládám studyplan",
            renderContent: () => <StudyPlanMediumEditableContent studyplan={studyplan} />,
        },
        D: {
            asyncAction: StudyPlanDeleteAsyncAction,
            dialogTitle: "Chcete odebrat studyplan?",
            loadingMsg: "Odstraňuji studyplan",
            renderContent: () => (
                <h2>
                    {studyplan?.name} ({studyplan?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, studyplan, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...studyplan, ...params };
        onOptimistic(fetchParams);
        const freshStudyPlan = await fetch(fetchParams);
        onDone(freshStudyPlan); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !studyplan?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'studyplan' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={studyplan}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// StudyPlanCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     studyplan: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `studyplan` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// StudyPlanCUDButton.defaultProps = {
//     onDone: () => {},
// };