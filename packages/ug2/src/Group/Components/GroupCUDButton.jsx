import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";
// import { InsertGroupButton } from "./CUDButtons/InsertGroupButton";
// import { UpdateGroupButton } from "./CUDButtons/UpdateGroupButton";
// import { DeleteGroupButton } from "./CUDButtons/DeleteGroupButton";
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";

/**
 * GroupCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertGroupButton` for creating a new item (operation "C")
 * - `UpdateGroupButton` for updating an existing item (operation "U")
 * - `DeleteGroupButton` for deleting an existing item (operation "D")
 *
 * This component validates the `group` prop:
 * - For "C" (create), `group` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `group` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `group` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the GroupCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.group - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.group.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.group.name] - The name of the item (optional).
 * @param {string} [props.group.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(group) => {}] - Callback executed after the operation completes. Receives the `group` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <GroupCUDButton
 *         operation="C"
 *         group={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </GroupCUDButton>
 *
 *       <GroupCUDButton
 *         operation="U"
 *         group={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </GroupCUDButton>
 *
 *       <GroupCUDButton
 *         operation="D"
 *         group={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </GroupCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const GroupButton = ({ operation, children, group, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: GroupInsertAsyncAction,
            dialogTitle: "Vložit novou group",
            loadingMsg: "Vkládám novou group",
            renderContent: () => <GroupMediumEditableContent group={group} />,
        },
        U: {
            asyncAction: GroupUpdateAsyncAction,
            dialogTitle: "Upravit group",
            loadingMsg: "Ukládám group",
            renderContent: () => <GroupMediumEditableContent group={group} />,
        },
        D: {
            asyncAction: GroupDeleteAsyncAction,
            dialogTitle: "Chcete odebrat group?",
            loadingMsg: "Odstraňuji group",
            renderContent: () => (
                <h2>
                    {group?.name} ({group?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, group, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...group, ...params };
        onOptimistic(fetchParams);
        const freshGroup = await fetch(fetchParams);
        onDone(freshGroup); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !group?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'group' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={group}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// GroupCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     group: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `group` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// GroupCUDButton.defaultProps = {
//     onDone: () => {},
// };