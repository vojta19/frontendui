import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";
// import { InsertUserButton } from "./CUDButtons/InsertUserButton";
// import { UpdateUserButton } from "./CUDButtons/UpdateUserButton";
// import { DeleteUserButton } from "./CUDButtons/DeleteUserButton";
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { UserDeleteAsyncAction, UserInsertAsyncAction, UserUpdateAsyncAction } from "../Queries";
import { UserMediumEditableContent } from "./UserMediumEditableContent";

/**
 * UserCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertUserButton` for creating a new item (operation "C")
 * - `UpdateUserButton` for updating an existing item (operation "U")
 * - `DeleteUserButton` for deleting an existing item (operation "D")
 *
 * This component validates the `user` prop:
 * - For "C" (create), `user` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `user` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `user` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the UserCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.user - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.user.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.user.name] - The name of the item (optional).
 * @param {string} [props.user.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(user) => {}] - Callback executed after the operation completes. Receives the `user` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <UserCUDButton
 *         operation="C"
 *         user={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </UserCUDButton>
 *
 *       <UserCUDButton
 *         operation="U"
 *         user={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </UserCUDButton>
 *
 *       <UserCUDButton
 *         operation="D"
 *         user={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </UserCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const UserButton = ({ operation, children, user, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: UserInsertAsyncAction,
            dialogTitle: "Vložit novou user",
            loadingMsg: "Vkládám novou user",
            renderContent: () => <UserMediumEditableContent user={user} />,
        },
        U: {
            asyncAction: UserUpdateAsyncAction,
            dialogTitle: "Upravit user",
            loadingMsg: "Ukládám user",
            renderContent: () => <UserMediumEditableContent user={user} />,
        },
        D: {
            asyncAction: UserDeleteAsyncAction,
            dialogTitle: "Chcete odebrat user?",
            loadingMsg: "Odstraňuji user",
            renderContent: () => (
                <h2>
                    {user?.name} ({user?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, user, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...user, ...params };
        onOptimistic(fetchParams);
        const freshUser = await fetch(fetchParams);
        onDone(freshUser); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !user?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'user' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={user}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// UserCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     user: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `user` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// UserCUDButton.defaultProps = {
//     onDone: () => {},
// };