import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { PaymentDeleteAsyncAction, PaymentInsertAsyncAction, PaymentUpdateAsyncAction } from "../Queries";
import { PaymentMediumEditableContent } from "./PaymentMediumEditableContent";

/**
 * PaymentCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertPaymentButton` for creating a new item (operation "C")
 * - `UpdatePaymentButton` for updating an existing item (operation "U")
 * - `DeletePaymentButton` for deleting an existing item (operation "D")
 *
 * This component validates the `payment` prop:
 * - For "C" (create), `payment` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `payment` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `payment` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the PaymentCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.payment - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.payment.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.payment.name] - The name of the item (optional).
 * @param {string} [props.payment.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(payment) => {}] - Callback executed after the operation completes. Receives the `payment` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <PaymentCUDButton
 *         operation="C"
 *         payment={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </PaymentCUDButton>
 *
 *       <PaymentCUDButton
 *         operation="U"
 *         payment={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </PaymentCUDButton>
 *
 *       <PaymentCUDButton
 *         operation="D"
 *         payment={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </PaymentCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const PaymentButton = ({ operation, children, payment, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: PaymentInsertAsyncAction,
            dialogTitle: "Vložit novou payment",
            loadingMsg: "Vkládám novou payment",
            renderContent: () => <PaymentMediumEditableContent payment={payment} />,
        },
        U: {
            asyncAction: PaymentUpdateAsyncAction,
            dialogTitle: "Upravit payment",
            loadingMsg: "Ukládám payment",
            renderContent: () => <PaymentMediumEditableContent payment={payment} />,
        },
        D: {
            asyncAction: PaymentDeleteAsyncAction,
            dialogTitle: "Chcete odebrat payment?",
            loadingMsg: "Odstraňuji payment",
            renderContent: () => (
                <h2>
                    {payment?.name} ({payment?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, payment, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...payment, ...params };
        onOptimistic(fetchParams);
        const freshPayment = await fetch(fetchParams);
        onDone(freshPayment); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !payment?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'payment' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={payment}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// PaymentCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     payment: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `payment` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// PaymentCUDButton.defaultProps = {
//     onDone: () => {},
// };