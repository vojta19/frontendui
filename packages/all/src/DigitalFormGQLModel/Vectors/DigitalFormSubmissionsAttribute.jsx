import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"


/**
 * Inserts a SubmissionGQLModel item into a digitalform’s submissions array and dispatches an update.
 *
 * @param {Object} digitalform - The current digitalform object containing a `submissions` array.
 * @param {Object} submissionItem - The item to insert; must have `__typename === "SubmissionGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSubmissionItemInsert = (digitalform, submissionItem, dispatch) => {
    const { __typename } = submissionItem;
    if (__typename === "SubmissionGQLModel") {
        const { submissions, ...others } = digitalform;
        const newDigitalFormSubmissionItems = [...submissions, submissionItem];
        const newDigitalForm = { ...others, submissions: newDigitalFormSubmissionItems };
        dispatch(ItemActions.item_update(newDigitalForm));
    }
};

/**
 * Replaces an existing SubmissionGQLModel item in a digitalform’s submissions array and dispatches an update.
 *
 * @param {Object} digitalform - The current digitalform object containing a `submissions` array.
 * @param {Object} submissionItem - The updated item; must have `__typename === "SubmissionGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSubmissionItemUpdate = (digitalform, submissionItem, dispatch) => {
    const { __typename } = submissionItem;
    if (__typename === "SubmissionGQLModel") {
        const { submissions, ...others } = digitalform;
        const newDigitalFormSubmissionItems = submissions.map(item =>
            item.id === submissionItem.id ? submissionItem : item
        );
        const newDigitalForm = { ...others, submissions: newDigitalFormSubmissionItems };
        dispatch(ItemActions.item_update(newDigitalForm));
    }
};

/**
 * Removes a SubmissionGQLModel item from a digitalform’s submissions array by its `id` and dispatches an update.
 *
 * @param {Object} digitalform - The current digitalform object containing a `submissions` array.
 * @param {Object} submissionItem - The item to delete; must have `__typename === "SubmissionGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSubmissionItemDelete = (digitalform, submissionItem, dispatch) => {
    const { __typename } = submissionItem;
    if (__typename === "SubmissionGQLModel") {
        const { submissions, ...others } = digitalform;
        const newDigitalFormSubmissionItems = submissions.filter(
            item => item.id !== submissionItem.id
        );
        const newDigitalForm = { ...others, submissions: newDigitalFormSubmissionItems };
        dispatch(ItemActions.item_update(newDigitalForm));
    }
};

const DigitalFormSubmissionsAttributeQuery = `
query DigitalFormQueryRead($id: UUID!, $where: SubmissionInputFilter, $skip: Int, $limit: Int) {
    result: digitalformById(id: $id) {
        __typename
        id
        submissions(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...SubmissionMedium
        }
    }
}
`

const DigitalFormSubmissionsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalFormSubmissionsAttributeQuery,
        //SubmissionMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("submissions")
)


/**
 * A component for displaying the `submissions` attribute of a digitalform entity.
 *
 * This component checks if the `submissions` attribute exists on the `digitalform` object. If `submissions` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `submissions` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSubmissionsAttribute component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {Array<Object>} [props.digitalform.submissions] - An array of submission items associated with the digitalform entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the submissions array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `submissions` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalformEntity = { 
 *   submissions: [
 *     { id: 1, name: "Submission Item 1" }, 
 *     { id: 2, name: "Submission Item 2" }
 *   ] 
 * };
 * <DigitalFormSubmissionsAttribute digitalform={digitalformEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalFormSubmissionsAttribute 
 *   digitalform={digitalformEntity}
 *   filter={submission => submission.name.includes("1")}
 * />
 */
export const DigitalFormSubmissionsAttribute_old = ({digitalform, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { submissions: unfiltered } = digitalform
    if (typeof unfiltered === 'undefined') return null
    const submissions = unfiltered.filter(filter)
    if (submissions.length === 0) return null
    return (
        <>
            {submissions.map(
                submission => <Visualiser id={submission.id} key={submission.id} submission={submission} />
            )}
        </>
    )
}

/**
 * Visualiser component for displaying a list of submission items using `DigitalFormSubmissionsAttribute`.
 *
 * Wraps the `DigitalFormSubmissionsAttribute` component, passing the given `items` as the `submissions` attribute
 * on a synthetic `digitalform` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of submission items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalFormSubmissionsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of submissions or `null` if none are provided.
 *
 * @example
 * <SubmissionsVisualiser
 *   items={[
 *     { id: 1, name: "Submission 1" },
 *     { id: 2, name: "Submission 2" }
 *   ]}
 *   filter={v => v.name.includes("1")}
 * />
 */
const SubmissionsVisualiser = ({ items, ...props }) => 
    <DigitalFormSubmissionsAttribute_old {...props} digitalform={{ submissions: items }} />

/**
 * Infinite-scrolling component for the `submissions` attribute of a digitalform entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `submissions` array
 * associated with the provided `digitalform` object. It utilizes `SubmissionsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalform - The digitalform entity containing the `submissions` array.
 * @param {Array<Object>} [props.digitalform.submissions] - (Optional) Preloaded submission items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `SubmissionsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of submissions.
 *
 * @example
 * <DigitalFormSubmissionsAttributeInfinite
 *   digitalform={{
 *     submissions: [
 *       { id: 1, name: "Submission 1" },
 *       { id: 2, name: "Submission 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalFormSubmissionsAttributeInfinite = ({digitalform, actionParams={}, ...props}) => { 
    const {submissions} = digitalform

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={SubmissionsVisualiser} 
            preloadedItems={submissions}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalFormSubmissionsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `submissions` from a `digitalform` entity.
 *
 * This component uses the `DigitalFormSubmissionsAttributeAsyncAction` to asynchronously fetch
 * the `digitalform.submissions` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each submission item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalform - The digitalform entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `submissions` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered submissions or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSubmissionsAttributeLazy digitalform={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSubmissionsAttributeLazy
 *   digitalform={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSubmissionsAttributeLazy = ({digitalform, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSubmissionsAttributeAsyncAction, digitalform, {deferred: true})
    useEffect(() => {
        fetch(digitalform)
    }, [digitalform])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSubmissionsAttribute_old digitalform={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({submission, children}) => <div>
    Probably {'<SubmissionMediumCard submission={submission} />'} <br />
    <pre>{JSON.stringify(submission, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `submissions` attribute of a digitalform entity.
 *
 * Applies an optional filter function to the submissions array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.digitalform - The digitalform entity containing the `submissions` array.
 * @param {Array<object>} [props.digitalform.submissions] - Array of submission items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each submission item.
 *   Receives `submission` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 *   This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on submissions before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no submissions.
 *
 * @example
 * <DigitalFormSubmissionsAttribute
 *   digitalform={digitalform}
 *   Visualiser={SubmissionMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalFormSubmissionsAttribute = ({
    digitalform,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { submissions: unfiltered } = digitalform
    if (typeof unfiltered === 'undefined') return null
    const submissions = unfiltered.filter(filter)
    if (submissions.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalFormSubmissionsAttribute 
                {...props}    
                digitalform={{submissions: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalform, skip: 0, limit: 10 }}
                asyncAction={DigitalFormSubmissionsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={submissions}
            />
        );
    }

    return (
        <>
        {submissions.map((submission) => (
            <Layout key={submission.id}>
                {submission && <Visualiser {...props} submission={submission} />}
            </Layout>
        ))}
        </>
    );
};