import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { EventDeleteAsyncAction, EventInsertAsyncAction, EventUpdateAsyncAction } from "../Queries";
import { EventMediumEditableContent } from "./EventMediumEditableContent";

/**
 * EventCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertEventButton` for creating a new item (operation "C")
 * - `UpdateEventButton` for updating an existing item (operation "U")
 * - `DeleteEventButton` for deleting an existing item (operation "D")
 *
 * This component validates the `event` prop:
 * - For "C" (create), `event` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `event` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `event` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the EventCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.event - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.event.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.event.name] - The name of the item (optional).
 * @param {string} [props.event.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(event) => {}] - Callback executed after the operation completes. Receives the `event` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <EventCUDButton
 *         operation="C"
 *         event={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </EventCUDButton>
 *
 *       <EventCUDButton
 *         operation="U"
 *         event={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </EventCUDButton>
 *
 *       <EventCUDButton
 *         operation="D"
 *         event={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </EventCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const EventButton = ({ operation, children, event, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: EventInsertAsyncAction,
            dialogTitle: "Vložit novou event",
            loadingMsg: "Vkládám novou event",
            renderContent: () => <EventMediumEditableContent event={event} />,
        },
        U: {
            asyncAction: EventUpdateAsyncAction,
            dialogTitle: "Upravit event",
            loadingMsg: "Ukládám event",
            renderContent: () => <EventMediumEditableContent event={event} />,
        },
        D: {
            asyncAction: EventDeleteAsyncAction,
            dialogTitle: "Chcete odebrat event?",
            loadingMsg: "Odstraňuji event",
            renderContent: () => (
                <h2>
                    {event?.name} ({event?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, event, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...event, ...params };
        onOptimistic(fetchParams);
        const freshEvent = await fetch(fetchParams);
        onDone(freshEvent); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !event?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'event' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={event}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// EventCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     event: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `event` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// EventCUDButton.defaultProps = {
//     onDone: () => {},
// };