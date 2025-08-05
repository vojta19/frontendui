import { AsyncClickHandler, ButtonWithDialog, ErrorHandler } from "@hrbolek/uoisfrontend-shared";
import { RoleTypeListAddRoleAsyncAction } from "./Queries/RoleTypeListAddRoleAsyncAction";
import { RoleTypeListRemoveRoleAsyncAction } from "./Queries/RoleTypeListRemoveRoleAsyncAction";
import { RoleTypeListMediumEditableContent } from "./RoleTypeListMediumEditableContent";

/**
 * RoleTypeListCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertRoleTypeListButton` for creating a new item (operation "C")
 * - `UpdateRoleTypeListButton` for updating an existing item (operation "U")
 * - `DeleteRoleTypeListButton` for deleting an existing item (operation "D")
 *
 * This component validates the `roletypelist` prop:
 * - For "C" (create), `roletypelist` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `roletypelist` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `roletypelist` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the RoleTypeListCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.roletypelist - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.roletypelist.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.roletypelist.name] - The name of the item (optional).
 * @param {string} [props.roletypelist.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(roletypelist) => {}] - Callback executed after the operation completes. Receives the `roletypelist` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <RoleTypeListCUDButton
 *         operation="C"
 *         roletypelist={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </RoleTypeListCUDButton>
 *
 *       <RoleTypeListCUDButton
 *         operation="U"
 *         roletypelist={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </RoleTypeListCUDButton>
 *
 *       <RoleTypeListCUDButton
 *         operation="D"
 *         roletypelist={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </RoleTypeListCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const RoleTypeListTypeCDButton = ({ operation, children, roletypelist, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: RoleTypeListAddRoleAsyncAction,
            dialogTitle: "Vložit novou roletypelist",
            loadingMsg: "Vkládám novou roletypelist",
            renderContent: () => <RoleTypeListMediumEditableContent roletypelist={roletypelist} />,
        },
        // U: {
        //     asyncAction: RoleTypeListUpdateAsyncAction,
        //     dialogTitle: "Upravit roletypelist",
        //     loadingMsg: "Ukládám roletypelist",
        //     renderContent: () => <RoleTypeListMediumEditableContent roletypelist={roletypelist} />,
        // },
        D: {
            asyncAction: RoleTypeListRemoveRoleAsyncAction,
            dialogTitle: "Chcete odebrat roletypelist?",
            loadingMsg: "Odstraňuji roletypelist",
            renderContent: () => (
                <h2>
                    {roletypelist?.name} ({roletypelist?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    // Validate required fields for "U" and "D"
    if (!roletypelist?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'roletypelist' must include an 'id' key.`} />;
    }

    return (
        <AsyncClickHandler
            asyncAction={asyncAction}
            defaultParams={roletypelist}
            loadingMsg={loadingMsg}
            onClick={onDone}
        >
            <ButtonWithDialog
                buttonLabel={children}
                dialogTitle={dialogTitle}
                {...props}
                params={roletypelist}
            >
                {renderContent()}
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};

// // Prop validation using PropTypes
// RoleTypeListCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     roletypelist: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `roletypelist` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// RoleTypeListCUDButton.defaultProps = {
//     onDone: () => {},
// };