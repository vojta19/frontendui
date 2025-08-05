import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { FacilityDeleteAsyncAction, FacilityInsertAsyncAction, FacilityUpdateAsyncAction } from "../Queries";
import { FacilityMediumEditableContent } from "./FacilityMediumEditableContent";

/**
 * FacilityCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertFacilityButton` for creating a new item (operation "C")
 * - `UpdateFacilityButton` for updating an existing item (operation "U")
 * - `DeleteFacilityButton` for deleting an existing item (operation "D")
 *
 * This component validates the `facility` prop:
 * - For "C" (create), `facility` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `facility` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `facility` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the FacilityCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.facility - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.facility.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.facility.name] - The name of the item (optional).
 * @param {string} [props.facility.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(facility) => {}] - Callback executed after the operation completes. Receives the `facility` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <FacilityCUDButton
 *         operation="C"
 *         facility={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </FacilityCUDButton>
 *
 *       <FacilityCUDButton
 *         operation="U"
 *         facility={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </FacilityCUDButton>
 *
 *       <FacilityCUDButton
 *         operation="D"
 *         facility={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </FacilityCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const FacilityButton = ({ operation, children, facility, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: FacilityInsertAsyncAction,
            dialogTitle: "Vložit novou facility",
            loadingMsg: "Vkládám novou facility",
            renderContent: () => <FacilityMediumEditableContent facility={facility} />,
        },
        U: {
            asyncAction: FacilityUpdateAsyncAction,
            dialogTitle: "Upravit facility",
            loadingMsg: "Ukládám facility",
            renderContent: () => <FacilityMediumEditableContent facility={facility} />,
        },
        D: {
            asyncAction: FacilityDeleteAsyncAction,
            dialogTitle: "Chcete odebrat facility?",
            loadingMsg: "Odstraňuji facility",
            renderContent: () => (
                <h2>
                    {facility?.name} ({facility?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, facility, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...facility, ...params };
        onOptimistic(fetchParams);
        const freshFacility = await fetch(fetchParams);
        onDone(freshFacility); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !facility?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'facility' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={facility}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// FacilityCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     facility: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `facility` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// FacilityCUDButton.defaultProps = {
//     onDone: () => {},
// };