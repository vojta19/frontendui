import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"


/**
 * Inserts a SubmittedsectionsallGQLModel item into a digitalsubmission’s submittedsectionsalls array and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `submittedsectionsalls` array.
 * @param {Object} submittedsectionsallItem - The item to insert; must have `__typename === "SubmittedsectionsallGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionSubmittedsectionsallItemInsert = (digitalsubmission, submittedsectionsallItem, dispatch) => {
    const { __typename } = submittedsectionsallItem;
    if (__typename === "SubmittedsectionsallGQLModel") {
        const { submittedsectionsalls, ...others } = digitalsubmission;
        const newDigitalSubmissionSubmittedsectionsallItems = [...submittedsectionsalls, submittedsectionsallItem];
        const newDigitalSubmission = { ...others, submittedsectionsalls: newDigitalSubmissionSubmittedsectionsallItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

/**
 * Replaces an existing SubmittedsectionsallGQLModel item in a digitalsubmission’s submittedsectionsalls array and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `submittedsectionsalls` array.
 * @param {Object} submittedsectionsallItem - The updated item; must have `__typename === "SubmittedsectionsallGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionSubmittedsectionsallItemUpdate = (digitalsubmission, submittedsectionsallItem, dispatch) => {
    const { __typename } = submittedsectionsallItem;
    if (__typename === "SubmittedsectionsallGQLModel") {
        const { submittedsectionsalls, ...others } = digitalsubmission;
        const newDigitalSubmissionSubmittedsectionsallItems = submittedsectionsalls.map(item =>
            item.id === submittedsectionsallItem.id ? submittedsectionsallItem : item
        );
        const newDigitalSubmission = { ...others, submittedsectionsalls: newDigitalSubmissionSubmittedsectionsallItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

/**
 * Removes a SubmittedsectionsallGQLModel item from a digitalsubmission’s submittedsectionsalls array by its `id` and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `submittedsectionsalls` array.
 * @param {Object} submittedsectionsallItem - The item to delete; must have `__typename === "SubmittedsectionsallGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionSubmittedsectionsallItemDelete = (digitalsubmission, submittedsectionsallItem, dispatch) => {
    const { __typename } = submittedsectionsallItem;
    if (__typename === "SubmittedsectionsallGQLModel") {
        const { submittedsectionsalls, ...others } = digitalsubmission;
        const newDigitalSubmissionSubmittedsectionsallItems = submittedsectionsalls.filter(
            item => item.id !== submittedsectionsallItem.id
        );
        const newDigitalSubmission = { ...others, submittedsectionsalls: newDigitalSubmissionSubmittedsectionsallItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

const DigitalSubmissionSubmittedsectionsallsAttributeQuery = `
query DigitalSubmissionQueryRead($id: UUID!, $where: SubmittedsectionsallInputFilter, $skip: Int, $limit: Int) {
    result: digitalsubmissionById(id: $id) {
        __typename
        id
        submittedsectionsalls(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...SubmittedsectionsallMedium
        }
    }
}
`

const DigitalSubmissionSubmittedsectionsallsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalSubmissionSubmittedsectionsallsAttributeQuery,
        //SubmittedsectionsallMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("submittedsectionsalls")
)


/**
 * A component for displaying the `submittedsectionsalls` attribute of a digitalsubmission entity.
 *
 * This component checks if the `submittedsectionsalls` attribute exists on the `digitalsubmission` object. If `submittedsectionsalls` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `submittedsectionsalls` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSubmittedsectionsallsAttribute component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {Array<Object>} [props.digitalsubmission.submittedsectionsalls] - An array of submittedsectionsall items associated with the digitalsubmission entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the submittedsectionsalls array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `submittedsectionsalls` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalsubmissionEntity = { 
 *   submittedsectionsalls: [
 *     { id: 1, name: "Submittedsectionsall Item 1" }, 
 *     { id: 2, name: "Submittedsectionsall Item 2" }
 *   ] 
 * };
 * <DigitalSubmissionSubmittedsectionsallsAttribute digitalsubmission={digitalsubmissionEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalSubmissionSubmittedsectionsallsAttribute 
 *   digitalsubmission={digitalsubmissionEntity}
 *   filter={submittedsectionsall => submittedsectionsall.name.includes("1")}
 * />
 */
export const DigitalSubmissionSubmittedsectionsallsAttribute_old = ({digitalsubmission, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { submittedsectionsalls: unfiltered } = digitalsubmission
    if (typeof unfiltered === 'undefined') return null
    const submittedsectionsalls = unfiltered.filter(filter)
    if (submittedsectionsalls.length === 0) return null
    return (
        <>
            {submittedsectionsalls.map(
                submittedsectionsall => <Visualiser id={submittedsectionsall.id} key={submittedsectionsall.id} submittedsectionsall={submittedsectionsall} />
            )}
        </>
    )
}

/**
 * Visualiser component for displaying a list of submittedsectionsall items using `DigitalSubmissionSubmittedsectionsallsAttribute`.
 *
 * Wraps the `DigitalSubmissionSubmittedsectionsallsAttribute` component, passing the given `items` as the `submittedsectionsalls` attribute
 * on a synthetic `digitalsubmission` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of submittedsectionsall items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalSubmissionSubmittedsectionsallsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of submittedsectionsalls or `null` if none are provided.
 *
 * @example
 * <SubmittedsectionsallsVisualiser
 *   items={[
 *     { id: 1, name: "Submittedsectionsall 1" },
 *     { id: 2, name: "Submittedsectionsall 2" }
 *   ]}
 *   filter={v => v.name.includes("1")}
 * />
 */
const SubmittedsectionsallsVisualiser = ({ items, ...props }) => 
    <DigitalSubmissionSubmittedsectionsallsAttribute_old {...props} digitalsubmission={{ submittedsectionsalls: items }} />

/**
 * Infinite-scrolling component for the `submittedsectionsalls` attribute of a digitalsubmission entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `submittedsectionsalls` array
 * associated with the provided `digitalsubmission` object. It utilizes `SubmittedsectionsallsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalsubmission - The digitalsubmission entity containing the `submittedsectionsalls` array.
 * @param {Array<Object>} [props.digitalsubmission.submittedsectionsalls] - (Optional) Preloaded submittedsectionsall items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `SubmittedsectionsallsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of submittedsectionsalls.
 *
 * @example
 * <DigitalSubmissionSubmittedsectionsallsAttributeInfinite
 *   digitalsubmission={{
 *     submittedsectionsalls: [
 *       { id: 1, name: "Submittedsectionsall 1" },
 *       { id: 2, name: "Submittedsectionsall 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalSubmissionSubmittedsectionsallsAttributeInfinite = ({digitalsubmission, actionParams={}, ...props}) => { 
    const {submittedsectionsalls} = digitalsubmission

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={SubmittedsectionsallsVisualiser} 
            preloadedItems={submittedsectionsalls}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalSubmissionSubmittedsectionsallsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `submittedsectionsalls` from a `digitalsubmission` entity.
 *
 * This component uses the `DigitalSubmissionSubmittedsectionsallsAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmission.submittedsectionsalls` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each submittedsectionsall item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmission - The digitalsubmission entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `submittedsectionsalls` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered submittedsectionsalls or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionSubmittedsectionsallsAttributeLazy digitalsubmission={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionSubmittedsectionsallsAttributeLazy
 *   digitalsubmission={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionSubmittedsectionsallsAttributeLazy = ({digitalsubmission, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionSubmittedsectionsallsAttributeAsyncAction, digitalsubmission, {deferred: true})
    useEffect(() => {
        fetch(digitalsubmission)
    }, [digitalsubmission])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionSubmittedsectionsallsAttribute_old digitalsubmission={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({submittedsectionsall, children}) => <div>
    Probably {'<SubmittedsectionsallMediumCard submittedsectionsall={submittedsectionsall} />'} <br />
    <pre>{JSON.stringify(submittedsectionsall, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `submittedsectionsalls` attribute of a digitalsubmission entity.
 *
 * Applies an optional filter function to the submittedsectionsalls array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.digitalsubmission - The digitalsubmission entity containing the `submittedsectionsalls` array.
 * @param {Array<object>} [props.digitalsubmission.submittedsectionsalls] - Array of submittedsectionsall items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each submittedsectionsall item.
 *   Receives `submittedsectionsall` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 *   This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on submittedsectionsalls before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no submittedsectionsalls.
 *
 * @example
 * <DigitalSubmissionSubmittedsectionsallsAttribute
 *   digitalsubmission={digitalsubmission}
 *   Visualiser={SubmittedsectionsallMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalSubmissionSubmittedsectionsallsAttribute = ({
    digitalsubmission,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { submittedsectionsalls: unfiltered } = digitalsubmission
    if (typeof unfiltered === 'undefined') return null
    const submittedsectionsalls = unfiltered.filter(filter)
    if (submittedsectionsalls.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalSubmissionSubmittedsectionsallsAttribute 
                {...props}    
                digitalsubmission={{submittedsectionsalls: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalsubmission, skip: 0, limit: 10 }}
                asyncAction={DigitalSubmissionSubmittedsectionsallsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={submittedsectionsalls}
            />
        );
    }

    return (
        <>
        {submittedsectionsalls.map((submittedsectionsall) => (
            <Layout key={submittedsectionsall.id}>
                {submittedsectionsall && <Visualiser {...props} submittedsectionsall={submittedsectionsall} />}
            </Layout>
        ))}
        </>
    );
};