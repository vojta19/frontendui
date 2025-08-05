import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { PaymentInfoDeleteAsyncAction, PaymentInfoInsertAsyncAction, PaymentInfoUpdateAsyncAction } from "../Queries";
import { PaymentInfoMediumEditableContent } from "./PaymentInfoMediumEditableContent";

/**
 * PaymentInfoCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertPaymentInfoButton` for creating a new item (operation "C")
 * - `UpdatePaymentInfoButton` for updating an existing item (operation "U")
 * - `DeletePaymentInfoButton` for deleting an existing item (operation "D")
 *
 * This component validates the `paymentinfo` prop:
 * - For "C" (create), `paymentinfo` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `paymentinfo` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `paymentinfo` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the PaymentInfoCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.paymentinfo - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.paymentinfo.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.paymentinfo.name] - The name of the item (optional).
 * @param {string} [props.paymentinfo.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(paymentinfo) => {}] - Callback executed after the operation completes. Receives the `paymentinfo` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <PaymentInfoCUDButton
 *         operation="C"
 *         paymentinfo={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </PaymentInfoCUDButton>
 *
 *       <PaymentInfoCUDButton
 *         operation="U"
 *         paymentinfo={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </PaymentInfoCUDButton>
 *
 *       <PaymentInfoCUDButton
 *         operation="D"
 *         paymentinfo={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </PaymentInfoCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const PaymentInfoButton = ({ operation, children, paymentinfo, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: PaymentInfoInsertAsyncAction,
            dialogTitle: "Vložit novou paymentinfo",
            loadingMsg: "Vkládám novou paymentinfo",
            renderContent: () => <PaymentInfoMediumEditableContent paymentinfo={paymentinfo} />,
        },
        U: {
            asyncAction: PaymentInfoUpdateAsyncAction,
            dialogTitle: "Upravit paymentinfo",
            loadingMsg: "Ukládám paymentinfo",
            renderContent: () => <PaymentInfoMediumEditableContent paymentinfo={paymentinfo} />,
        },
        D: {
            asyncAction: PaymentInfoDeleteAsyncAction,
            dialogTitle: "Chcete odebrat paymentinfo?",
            loadingMsg: "Odstraňuji paymentinfo",
            renderContent: () => (
                <h2>
                    {paymentinfo?.name} ({paymentinfo?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, paymentinfo, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...paymentinfo, ...params };
        onOptimistic(fetchParams);
        const freshPaymentInfo = await fetch(fetchParams);
        onDone(freshPaymentInfo); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !paymentinfo?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'paymentinfo' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={paymentinfo}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// PaymentInfoCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     paymentinfo: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `paymentinfo` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// PaymentInfoCUDButton.defaultProps = {
//     onDone: () => {},
// };