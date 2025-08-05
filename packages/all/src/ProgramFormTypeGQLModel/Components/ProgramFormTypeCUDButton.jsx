import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramFormTypeDeleteAsyncAction, ProgramFormTypeInsertAsyncAction, ProgramFormTypeUpdateAsyncAction } from "../Queries";
import { ProgramFormTypeMediumEditableContent } from "./ProgramFormTypeMediumEditableContent";

/**
 * ProgramFormTypeCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertProgramFormTypeButton` for creating a new item (operation "C")
 * - `UpdateProgramFormTypeButton` for updating an existing item (operation "U")
 * - `DeleteProgramFormTypeButton` for deleting an existing item (operation "D")
 *
 * This component validates the `programformtype` prop:
 * - For "C" (create), `programformtype` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `programformtype` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `programformtype` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the ProgramFormTypeCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.programformtype - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.programformtype.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.programformtype.name] - The name of the item (optional).
 * @param {string} [props.programformtype.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(programformtype) => {}] - Callback executed after the operation completes. Receives the `programformtype` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <ProgramFormTypeCUDButton
 *         operation="C"
 *         programformtype={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </ProgramFormTypeCUDButton>
 *
 *       <ProgramFormTypeCUDButton
 *         operation="U"
 *         programformtype={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </ProgramFormTypeCUDButton>
 *
 *       <ProgramFormTypeCUDButton
 *         operation="D"
 *         programformtype={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </ProgramFormTypeCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const ProgramFormTypeButton = ({ operation, children, programformtype, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: ProgramFormTypeInsertAsyncAction,
            dialogTitle: "Vložit novou programformtype",
            loadingMsg: "Vkládám novou programformtype",
            renderContent: () => <ProgramFormTypeMediumEditableContent programformtype={programformtype} />,
        },
        U: {
            asyncAction: ProgramFormTypeUpdateAsyncAction,
            dialogTitle: "Upravit programformtype",
            loadingMsg: "Ukládám programformtype",
            renderContent: () => <ProgramFormTypeMediumEditableContent programformtype={programformtype} />,
        },
        D: {
            asyncAction: ProgramFormTypeDeleteAsyncAction,
            dialogTitle: "Chcete odebrat programformtype?",
            loadingMsg: "Odstraňuji programformtype",
            renderContent: () => (
                <h2>
                    {programformtype?.name} ({programformtype?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, programformtype, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...programformtype, ...params };
        onOptimistic(fetchParams);
        const freshProgramFormType = await fetch(fetchParams);
        onDone(freshProgramFormType); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !programformtype?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'programformtype' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={programformtype}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// ProgramFormTypeCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     programformtype: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `programformtype` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// ProgramFormTypeCUDButton.defaultProps = {
//     onDone: () => {},
// };