import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleDeleteAsyncAction, RoleInsertAsyncAction, RoleUpdateAsyncAction } from "../Queries";
import { RoleMediumEditableContent } from "./RoleMediumEditableContent";

/**
 * RoleCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertRoleButton` for creating a new item (operation "C")
 * - `UpdateRoleButton` for updating an existing item (operation "U")
 * - `DeleteRoleButton` for deleting an existing item (operation "D")
 *
 * This component validates the `role` prop:
 * - For "C" (create), `role` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `role` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `role` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the RoleCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.role - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.role.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.role.name] - The name of the item (optional).
 * @param {string} [props.role.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(role) => {}] - Callback executed after the operation completes. Receives the `role` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <RoleCUDButton
 *         operation="C"
 *         role={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </RoleCUDButton>
 *
 *       <RoleCUDButton
 *         operation="U"
 *         role={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </RoleCUDButton>
 *
 *       <RoleCUDButton
 *         operation="D"
 *         role={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </RoleCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const RoleButton = ({ operation, children, role, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: RoleInsertAsyncAction,
            dialogTitle: "Vložit novou role",
            loadingMsg: "Vkládám novou role",
            renderContent: () => <RoleMediumEditableContent role={role} />,
        },
        U: {
            asyncAction: RoleUpdateAsyncAction,
            dialogTitle: "Upravit role",
            loadingMsg: "Ukládám role",
            renderContent: () => <RoleMediumEditableContent role={role} />,
        },
        D: {
            asyncAction: RoleDeleteAsyncAction,
            dialogTitle: "Chcete odebrat role?",
            loadingMsg: "Odstraňuji role",
            renderContent: () => (
                <h2>
                    {role?.name} ({role?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, role, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...role, ...params };
        onOptimistic(fetchParams);
        const freshRole = await fetch(fetchParams);
        onDone(freshRole); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !role?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'role' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={role}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// RoleCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     role: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `role` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// RoleCUDButton.defaultProps = {
//     onDone: () => {},
// };