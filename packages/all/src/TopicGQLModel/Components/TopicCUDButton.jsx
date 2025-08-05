import { ButtonWithDialog, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { TopicDeleteAsyncAction, TopicInsertAsyncAction, TopicUpdateAsyncAction } from "../Queries";
import { TopicMediumEditableContent } from "./TopicMediumEditableContent";

/**
 * TopicCUDButton Component
 *
 * A higher-order component that dynamically renders one of the following components
 * based on the `operation` prop:
 * - `InsertTopicButton` for creating a new item (operation "C")
 * - `UpdateTopicButton` for updating an existing item (operation "U")
 * - `DeleteTopicButton` for deleting an existing item (operation "D")
 *
 * This component validates the `topic` prop:
 * - For "C" (create), `topic` can be any object (no restrictions).
 * - For "U" (update) and "D" (delete), `topic` must include an `id` key.
 *
 * If the `operation` prop is invalid or required conditions for `topic` are not met,
 * an `ErrorHandler` component is rendered with an appropriate error message.
 *
 * @component
 * @param {Object} props - The props for the TopicCUDButton component.
 * @param {string} props.operation - The operation type ("C" for create, "U" for update, "D" for delete).
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} props.topic - The parameters for the operation. For "U" and "D", it must include an `id` key.
 * @param {string} [props.topic.id] - The unique identifier for the item (required for "U" and "D").
 * @param {string} [props.topic.name] - The name of the item (optional).
 * @param {string} [props.topic.name_en] - The English name of the item (optional).
 * @param {Function} [props.onDone=(topic) => {}] - Callback executed after the operation completes. Receives the `topic` object.
 * @param {...Object} props - Additional props passed to the underlying button components.
 *
 * @example
 * // Example Usage
 * const Example = () => {
 *   const handleDone = (data) => console.log("Operation completed:", data);
 *
 *   return (
 *     <>
 *       <TopicCUDButton
 *         operation="C"
 *         topic={{ name: "New Item", name_en: "New Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Insert
 *       </TopicCUDButton>
 *
 *       <TopicCUDButton
 *         operation="U"
 *         topic={{ id: "123", name: "Updated Item", name_en: "Updated Item EN" }}
 *         onDone={handleDone}
 *       >
 *         Update
 *       </TopicCUDButton>
 *
 *       <TopicCUDButton
 *         operation="D"
 *         topic={{ id: "123" }}
 *         onDone={handleDone}
 *       >
 *         Delete
 *       </TopicCUDButton>
 *     </>
 *   );
 * };
 *
 * @returns {JSX.Element} The dynamically selected button component for the specified operation.
 */
export const TopicButton = ({ operation, children, topic, onDone = () => {}, onOptimistic = () => {}, ...props }) => {
    const operationConfig = {
        C: {
            asyncAction: TopicInsertAsyncAction,
            dialogTitle: "Vložit novou topic",
            loadingMsg: "Vkládám novou topic",
            renderContent: () => <TopicMediumEditableContent topic={topic} />,
        },
        U: {
            asyncAction: TopicUpdateAsyncAction,
            dialogTitle: "Upravit topic",
            loadingMsg: "Ukládám topic",
            renderContent: () => <TopicMediumEditableContent topic={topic} />,
        },
        D: {
            asyncAction: TopicDeleteAsyncAction,
            dialogTitle: "Chcete odebrat topic?",
            loadingMsg: "Odstraňuji topic",
            renderContent: () => (
                <h2>
                    {topic?.name} ({topic?.name_en})
                </h2>
            ),
        },
    };

    if (!operationConfig[operation]) {
        return <ErrorHandler errors={`Invalid operation value: '${operation}'. Must be one of 'C', 'U', or 'D'.`} />;
    }

    const { asyncAction, dialogTitle, loadingMsg, renderContent } = operationConfig[operation];

    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, topic, { deferred: true });
    const handleClick = async (params = {}) => {
        const fetchParams = { ...topic, ...params };
        onOptimistic(fetchParams);
        const freshTopic = await fetch(fetchParams);
        onDone(freshTopic); // Pass the result to the external callback
    };

    // Validate required fields for "U" and "D"
    if ((operation === 'U' || operation === 'D') && !topic?.id) {
        return <ErrorHandler errors={`For '${operation}' operation, 'topic' must include an 'id' key.`} />;
    }

    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={loadingMsg} />}
        <ButtonWithDialog
            buttonLabel={children}
            dialogTitle={dialogTitle}
            {...props}
            params={topic}
            onClick={handleClick}
        >
            {renderContent()}
        </ButtonWithDialog>
    </>);
};

// // Prop validation using PropTypes
// TopicCUDButton.propTypes = {
//     /** The operation to perform: "C" for create, "U" for update, "D" for delete. */
//     operation: PropTypes.oneOf(['C', 'U', 'D']).isRequired,
//     /** The label or content for the button. */
//     children: PropTypes.node,
//     /** The parameters for the operation. */
//     topic: PropTypes.shape({
//         id: PropTypes.string, // Required for "U" and "D" operations
//         name: PropTypes.string,
//         name_en: PropTypes.string,
//     }).isRequired,
//     /** Callback executed after the operation completes. Receives the `topic` object. */
//     onDone: PropTypes.func,
// };

// // Default props
// TopicCUDButton.defaultProps = {
//     onDone: () => {},
// };