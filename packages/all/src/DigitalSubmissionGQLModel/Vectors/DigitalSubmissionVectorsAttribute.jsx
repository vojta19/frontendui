import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"


/**
 * Inserts a VectorGQLModel item into a digitalsubmission’s vectors array and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `vectors` array.
 * @param {Object} vectorItem - The item to insert; must have `__typename === "VectorGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionVectorItemInsert = (digitalsubmission, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = digitalsubmission;
        const newDigitalSubmissionVectorItems = [...vectors, vectorItem];
        const newDigitalSubmission = { ...others, vectors: newDigitalSubmissionVectorItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

/**
 * Replaces an existing VectorGQLModel item in a digitalsubmission’s vectors array and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `vectors` array.
 * @param {Object} vectorItem - The updated item; must have `__typename === "VectorGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionVectorItemUpdate = (digitalsubmission, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = digitalsubmission;
        const newDigitalSubmissionVectorItems = vectors.map(item =>
            item.id === vectorItem.id ? vectorItem : item
        );
        const newDigitalSubmission = { ...others, vectors: newDigitalSubmissionVectorItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

/**
 * Removes a VectorGQLModel item from a digitalsubmission’s vectors array by its `id` and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `vectors` array.
 * @param {Object} vectorItem - The item to delete; must have `__typename === "VectorGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionVectorItemDelete = (digitalsubmission, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = digitalsubmission;
        const newDigitalSubmissionVectorItems = vectors.filter(
            item => item.id !== vectorItem.id
        );
        const newDigitalSubmission = { ...others, vectors: newDigitalSubmissionVectorItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

const DigitalSubmissionVectorsAttributeQuery = `
query DigitalSubmissionQueryRead($id: UUID!, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: digitalsubmissionById(id: $id) {
        __typename
        id
        vectors(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...VectorMedium
        }
    }
}
`

const DigitalSubmissionVectorsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalSubmissionVectorsAttributeQuery,
        //VectorMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("vectors")
)


/**
 * A component for displaying the `vectors` attribute of a digitalsubmission entity.
 *
 * This component checks if the `vectors` attribute exists on the `digitalsubmission` object. If `vectors` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `vectors` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionVectorsAttribute component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {Array<Object>} [props.digitalsubmission.vectors] - An array of vector items associated with the digitalsubmission entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the vectors array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `vectors` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalsubmissionEntity = { 
 *   vectors: [
 *     { id: 1, name: "Vector Item 1" }, 
 *     { id: 2, name: "Vector Item 2" }
 *   ] 
 * };
 * <DigitalSubmissionVectorsAttribute digitalsubmission={digitalsubmissionEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalSubmissionVectorsAttribute 
 *   digitalsubmission={digitalsubmissionEntity}
 *   filter={vector => vector.name.includes("1")}
 * />
 */
export const DigitalSubmissionVectorsAttribute_old = ({digitalsubmission, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { vectors: unfiltered } = digitalsubmission
    if (typeof unfiltered === 'undefined') return null
    const vectors = unfiltered.filter(filter)
    if (vectors.length === 0) return null
    return (
        <>
            {vectors.map(
                vector => <Visualiser id={vector.id} key={vector.id} vector={vector} />
            )}
        </>
    )
}

/**
 * Visualiser component for displaying a list of vector items using `DigitalSubmissionVectorsAttribute`.
 *
 * Wraps the `DigitalSubmissionVectorsAttribute` component, passing the given `items` as the `vectors` attribute
 * on a synthetic `digitalsubmission` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of vector items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalSubmissionVectorsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of vectors or `null` if none are provided.
 *
 * @example
 * <VectorsVisualiser
 *   items={[
 *     { id: 1, name: "Vector 1" },
 *     { id: 2, name: "Vector 2" }
 *   ]}
 *   filter={v => v.name.includes("1")}
 * />
 */
const VectorsVisualiser = ({ items, ...props }) => 
    <DigitalSubmissionVectorsAttribute_old {...props} digitalsubmission={{ vectors: items }} />

/**
 * Infinite-scrolling component for the `vectors` attribute of a digitalsubmission entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `vectors` array
 * associated with the provided `digitalsubmission` object. It utilizes `VectorsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalsubmission - The digitalsubmission entity containing the `vectors` array.
 * @param {Array<Object>} [props.digitalsubmission.vectors] - (Optional) Preloaded vector items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `VectorsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of vectors.
 *
 * @example
 * <DigitalSubmissionVectorsAttributeInfinite
 *   digitalsubmission={{
 *     vectors: [
 *       { id: 1, name: "Vector 1" },
 *       { id: 2, name: "Vector 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalSubmissionVectorsAttributeInfinite = ({digitalsubmission, actionParams={}, ...props}) => { 
    const {vectors} = digitalsubmission

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={VectorsVisualiser} 
            preloadedItems={vectors}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalSubmissionVectorsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `vectors` from a `digitalsubmission` entity.
 *
 * This component uses the `DigitalSubmissionVectorsAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmission.vectors` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmission - The digitalsubmission entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `vectors` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered vectors or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionVectorsAttributeLazy digitalsubmission={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionVectorsAttributeLazy
 *   digitalsubmission={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionVectorsAttributeLazy = ({digitalsubmission, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionVectorsAttributeAsyncAction, digitalsubmission, {deferred: true})
    useEffect(() => {
        fetch(digitalsubmission)
    }, [digitalsubmission])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionVectorsAttribute_old digitalsubmission={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({vector, children}) => <div>
    Probably {'<VectorMediumCard vector={vector} />'} <br />
    <pre>{JSON.stringify(vector, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `vectors` attribute of a digitalsubmission entity.
 *
 * Applies an optional filter function to the vectors array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.digitalsubmission - The digitalsubmission entity containing the `vectors` array.
 * @param {Array<object>} [props.digitalsubmission.vectors] - Array of vector items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each vector item.
 *   Receives `vector` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 *   This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on vectors before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no vectors.
 *
 * @example
 * <DigitalSubmissionVectorsAttribute
 *   digitalsubmission={digitalsubmission}
 *   Visualiser={VectorMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalSubmissionVectorsAttribute = ({
    digitalsubmission,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { vectors: unfiltered } = digitalsubmission
    if (typeof unfiltered === 'undefined') return null
    const vectors = unfiltered.filter(filter)
    if (vectors.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalSubmissionVectorsAttribute 
                {...props}    
                digitalsubmission={{vectors: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalsubmission, skip: 0, limit: 10 }}
                asyncAction={DigitalSubmissionVectorsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={vectors}
            />
        );
    }

    return (
        <>
        {vectors.map((vector) => (
            <Layout key={vector.id}>
                {vector && <Visualiser {...props} vector={vector} />}
            </Layout>
        ))}
        </>
    );
};