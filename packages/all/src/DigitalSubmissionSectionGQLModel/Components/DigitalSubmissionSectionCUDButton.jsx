import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionSectionDeleteAsyncAction, DigitalSubmissionSectionInsertAsyncAction, DigitalSubmissionSectionUpdateAsyncAction } from "../Queries";
import { DigitalSubmissionSectionMediumEditableContent } from "./DigitalSubmissionSectionMediumEditableContent";

/**
 * DigitalSubmissionSectionCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertDigitalSubmissionSectionButton` for creating a new item (operation "C")
 * - `UpdateDigitalSubmissionSectionButton` for updating an existing item (operation "U")
 * - `DeleteDigitalSubmissionSectionButton` for deleting an existing item (operation "D")
 *
 * This component validates the `digitalsubmissionsection` prop:
 * - For "C" (create), `digitalsubmissionsection` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `digitalsubmissionsection` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `digitalsubmissionsection` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSectionCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.digitalsubmissionsection - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.digitalsubmissionsection.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.digitalsubmissionsection.name] - The name of the item (optional).
 * @param {string} [props.digitalsubmissionsection.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(digitalsubmissionsection) => {}] - Callback executed after the operation completes. Receives the `digitalsubmissionsection` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <DigitalSubmissionSectionCUDButton
 *         operation="C"
 *         digitalsubmissionsection={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </DigitalSubmissionSectionCUDButton>
 *
 *       <DigitalSubmissionSectionCUDButton
 *         operation="U"
 *         digitalsubmissionsection={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </DigitalSubmissionSectionCUDButton>
 *
 *       <DigitalSubmissionSectionCUDButton
 *         operation="D"
 *         digitalsubmissionsection={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </DigitalSubmissionSectionCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const DigitalSubmissionSectionButton = ({ operation, children, digitalsubmissionsection, onDone = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: DigitalSubmissionSectionInsertAsyncAction,
            dialogTitle: "Vložit novou digitalsubmissionsection",
            loadingMsg: "Vkládám novou digitalsubmissionsection",
            renderContent: () => <DigitalSubmissionSectionMediumEditableContent digitalsubmissionsection={digitalsubmissionsection} />,
        },
        U: {
            asyncAction: DigitalSubmissionSectionUpdateAsyncAction,
            dialogTitle: "Upravit digitalsubmissionsection",
            loadingMsg: "Ukládám digitalsubmissionsection",
            renderContent: () => <DigitalSubmissionSectionMediumEditableContent digitalsubmissionsection={digitalsubmissionsection} />,
        },
        D: {
            asyncAction: DigitalSubmissionSectionDeleteAsyncAction,
            dialogTitle: "Chcete odebrat digitalsubmissionsection?",
            loadingMsg: "Odstraňuji digitalsubmissionsection",
            renderContent: () => (
                <h2>
                    {digitalsubmissionsection?.name} ({digitalsubmissionsection?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, digitalsubmissionsection, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...digitalsubmissionsection, ...params };
        const freshDigitalSubmissionSection = await fetch(fetchParams);
        onDone(freshDigitalSubmissionSection); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !digitalsubmissionsection?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'digitalsubmissionsection' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={digitalsubmissionsection}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// DigitalSubmissionSectionCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     digitalsubmissionsection: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `digitalsubmissionsection` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// DigitalSubmissionSectionCUDButton.defaultProps = {
//     onDone: () => {},
// };