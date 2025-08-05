import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramTypeDeleteAsyncAction, ProgramTypeInsertAsyncAction, ProgramTypeUpdateAsyncAction } from "../Queries";
import { ProgramTypeMediumEditableContent } from "./ProgramTypeMediumEditableContent";

/**
 * ProgramTypeCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertProgramTypeButton` for creating a new item (operation "C")
 * - `UpdateProgramTypeButton` for updating an existing item (operation "U")
 * - `DeleteProgramTypeButton` for deleting an existing item (operation "D")
 *
 * This component validates the `programtype` prop:
 * - For "C" (create), `programtype` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `programtype` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `programtype` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the ProgramTypeCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.programtype - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.programtype.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.programtype.name] - The name of the item (optional).
 * @param {string} [props.programtype.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(programtype) => {}] - Callback executed after the operation completes. Receives the `programtype` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <ProgramTypeCUDButton
 *         operation="C"
 *         programtype={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </ProgramTypeCUDButton>
 *
 *       <ProgramTypeCUDButton
 *         operation="U"
 *         programtype={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </ProgramTypeCUDButton>
 *
 *       <ProgramTypeCUDButton
 *         operation="D"
 *         programtype={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </ProgramTypeCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const ProgramTypeButton = ({ operation, children, programtype, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: ProgramTypeInsertAsyncAction,
            dialogTitle: "Vložit novou programtype",
            loadingMsg: "Vkládám novou programtype",
            renderContent: () => <ProgramTypeMediumEditableContent programtype={programtype} />,
        },
        U: {
            asyncAction: ProgramTypeUpdateAsyncAction,
            dialogTitle: "Upravit programtype",
            loadingMsg: "Ukládám programtype",
            renderContent: () => <ProgramTypeMediumEditableContent programtype={programtype} />,
        },
        D: {
            asyncAction: ProgramTypeDeleteAsyncAction,
            dialogTitle: "Chcete odebrat programtype?",
            loadingMsg: "Odstraňuji programtype",
            renderContent: () => (
                <h2>
                    {programtype?.name} ({programtype?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, programtype, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...programtype, ...params };
        onOptimistic(fetchParams);
        const freshProgramType = await fetch(fetchParams);
        onDone(freshProgramType); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !programtype?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'programtype' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={programtype}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// ProgramTypeCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     programtype: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `programtype` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// ProgramTypeCUDButton.defaultProps = {
//     onDone: () => {},
// };