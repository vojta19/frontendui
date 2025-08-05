import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramLevelTypeDeleteAsyncAction, ProgramLevelTypeInsertAsyncAction, ProgramLevelTypeUpdateAsyncAction } from "../Queries";
import { ProgramLevelTypeMediumEditableContent } from "./ProgramLevelTypeMediumEditableContent";

/**
 * ProgramLevelTypeCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertProgramLevelTypeButton` for creating a new item (operation "C")
 * - `UpdateProgramLevelTypeButton` for updating an existing item (operation "U")
 * - `DeleteProgramLevelTypeButton` for deleting an existing item (operation "D")
 *
 * This component validates the `programleveltype` prop:
 * - For "C" (create), `programleveltype` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `programleveltype` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `programleveltype` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the ProgramLevelTypeCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.programleveltype - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.programleveltype.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.programleveltype.name] - The name of the item (optional).
 * @param {string} [props.programleveltype.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(programleveltype) => {}] - Callback executed after the operation completes. Receives the `programleveltype` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <ProgramLevelTypeCUDButton
 *         operation="C"
 *         programleveltype={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </ProgramLevelTypeCUDButton>
 *
 *       <ProgramLevelTypeCUDButton
 *         operation="U"
 *         programleveltype={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </ProgramLevelTypeCUDButton>
 *
 *       <ProgramLevelTypeCUDButton
 *         operation="D"
 *         programleveltype={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </ProgramLevelTypeCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const ProgramLevelTypeButton = ({ operation, children, programleveltype, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: ProgramLevelTypeInsertAsyncAction,
            dialogTitle: "Vložit novou programleveltype",
            loadingMsg: "Vkládám novou programleveltype",
            renderContent: () => <ProgramLevelTypeMediumEditableContent programleveltype={programleveltype} />,
        },
        U: {
            asyncAction: ProgramLevelTypeUpdateAsyncAction,
            dialogTitle: "Upravit programleveltype",
            loadingMsg: "Ukládám programleveltype",
            renderContent: () => <ProgramLevelTypeMediumEditableContent programleveltype={programleveltype} />,
        },
        D: {
            asyncAction: ProgramLevelTypeDeleteAsyncAction,
            dialogTitle: "Chcete odebrat programleveltype?",
            loadingMsg: "Odstraňuji programleveltype",
            renderContent: () => (
                <h2>
                    {programleveltype?.name} ({programleveltype?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, programleveltype, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...programleveltype, ...params };
        onOptimistic(fetchParams);
        const freshProgramLevelType = await fetch(fetchParams);
        onDone(freshProgramLevelType); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !programleveltype?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'programleveltype' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={programleveltype}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// ProgramLevelTypeCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     programleveltype: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `programleveltype` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// ProgramLevelTypeCUDButton.defaultProps = {
//     onDone: () => {},
// };