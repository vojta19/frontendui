import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"


/**
 * Inserts a VectorGQLModel item into a digitalsubmissionfield’s vectors array and dispatches an update.
 *
 * @param {Object} digitalsubmissionfield - The current digitalsubmissionfield object containing a `vectors` array.
 * @param {Object} vectorItem - The item to insert; must have `__typename === "VectorGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionFieldVectorItemInsert = (digitalsubmissionfield, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = digitalsubmissionfield;
        const newDigitalSubmissionFieldVectorItems = [...vectors, vectorItem];
        const newDigitalSubmissionField = { ...others, vectors: newDigitalSubmissionFieldVectorItems };
        dispatch(ItemActions.item_update(newDigitalSubmissionField));
    }
};

/**
 * Replaces an existing VectorGQLModel item in a digitalsubmissionfield’s vectors array and dispatches an update.
 *
 * @param {Object} digitalsubmissionfield - The current digitalsubmissionfield object containing a `vectors` array.
 * @param {Object} vectorItem - The updated item; must have `__typename === "VectorGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionFieldVectorItemUpdate = (digitalsubmissionfield, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = digitalsubmissionfield;
        const newDigitalSubmissionFieldVectorItems = vectors.map(item =>
            item.id === vectorItem.id ? vectorItem : item
        );
        const newDigitalSubmissionField = { ...others, vectors: newDigitalSubmissionFieldVectorItems };
        dispatch(ItemActions.item_update(newDigitalSubmissionField));
    }
};

/**
 * Removes a VectorGQLModel item from a digitalsubmissionfield’s vectors array by its `id` and dispatches an update.
 *
 * @param {Object} digitalsubmissionfield - The current digitalsubmissionfield object containing a `vectors` array.
 * @param {Object} vectorItem - The item to delete; must have `__typename === "VectorGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionFieldVectorItemDelete = (digitalsubmissionfield, vectorItem, dispatch) => {
    const { __typename } = vectorItem;
    if (__typename === "VectorGQLModel") {
        const { vectors, ...others } = digitalsubmissionfield;
        const newDigitalSubmissionFieldVectorItems = vectors.filter(
            item => item.id !== vectorItem.id
        );
        const newDigitalSubmissionField = { ...others, vectors: newDigitalSubmissionFieldVectorItems };
        dispatch(ItemActions.item_update(newDigitalSubmissionField));
    }
};

const DigitalSubmissionFieldVectorsAttributeQuery = `
query DigitalSubmissionFieldQueryRead($id: UUID!, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: digitalsubmissionfieldById(id: $id) {
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

const DigitalSubmissionFieldVectorsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalSubmissionFieldVectorsAttributeQuery,
        //VectorMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("vectors")
)


/**
 * A component for displaying the `vectors` attribute of a digitalsubmissionfield entity.
 *
 * This component checks if the `vectors` attribute exists on the `digitalsubmissionfield` object. If `vectors` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `vectors` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionFieldVectorsAttribute component.
 * @param {Object} props.digitalsubmissionfield - The object representing the digitalsubmissionfield entity.
 * @param {Array<Object>} [props.digitalsubmissionfield.vectors] - An array of vector items associated with the digitalsubmissionfield entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the vectors array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `vectors` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalsubmissionfieldEntity = { 
 *   vectors: [
 *     { id: 1, name: "Vector Item 1" }, 
 *     { id: 2, name: "Vector Item 2" }
 *   ] 
 * };
 * <DigitalSubmissionFieldVectorsAttribute digitalsubmissionfield={digitalsubmissionfieldEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalSubmissionFieldVectorsAttribute 
 *   digitalsubmissionfield={digitalsubmissionfieldEntity}
 *   filter={vector => vector.name.includes("1")}
 * />
 */
export const DigitalSubmissionFieldVectorsAttribute_old = ({digitalsubmissionfield, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { vectors: unfiltered } = digitalsubmissionfield
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
 * Visualiser component for displaying a list of vector items using `DigitalSubmissionFieldVectorsAttribute`.
 *
 * Wraps the `DigitalSubmissionFieldVectorsAttribute` component, passing the given `items` as the `vectors` attribute
 * on a synthetic `digitalsubmissionfield` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of vector items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalSubmissionFieldVectorsAttribute` (e.g., `filter`).
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
    <DigitalSubmissionFieldVectorsAttribute_old {...props} digitalsubmissionfield={{ vectors: items }} />

/**
 * Infinite-scrolling component for the `vectors` attribute of a digitalsubmissionfield entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `vectors` array
 * associated with the provided `digitalsubmissionfield` object. It utilizes `VectorsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalsubmissionfield - The digitalsubmissionfield entity containing the `vectors` array.
 * @param {Array<Object>} [props.digitalsubmissionfield.vectors] - (Optional) Preloaded vector items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `VectorsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of vectors.
 *
 * @example
 * <DigitalSubmissionFieldVectorsAttributeInfinite
 *   digitalsubmissionfield={{
 *     vectors: [
 *       { id: 1, name: "Vector 1" },
 *       { id: 2, name: "Vector 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalSubmissionFieldVectorsAttributeInfinite = ({digitalsubmissionfield, actionParams={}, ...props}) => { 
    const {vectors} = digitalsubmissionfield

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={VectorsVisualiser} 
            preloadedItems={vectors}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalSubmissionFieldVectorsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `vectors` from a `digitalsubmissionfield` entity.
 *
 * This component uses the `DigitalSubmissionFieldVectorsAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmissionfield.vectors` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmissionfield - The digitalsubmissionfield entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `vectors` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered vectors or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionFieldVectorsAttributeLazy digitalsubmissionfield={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionFieldVectorsAttributeLazy
 *   digitalsubmissionfield={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionFieldVectorsAttributeLazy = ({digitalsubmissionfield, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionFieldVectorsAttributeAsyncAction, digitalsubmissionfield, {deferred: true})
    useEffect(() => {
        fetch(digitalsubmissionfield)
    }, [digitalsubmissionfield])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionFieldVectorsAttribute_old digitalsubmissionfield={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({vector, children}) => <div>
    Probably {'<VectorMediumCard vector={vector} />'} <br />
    <pre>{JSON.stringify(vector, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `vectors` attribute of a digitalsubmissionfield entity.
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
 * @param {object} props.digitalsubmissionfield - The digitalsubmissionfield entity containing the `vectors` array.
 * @param {Array<object>} [props.digitalsubmissionfield.vectors] - Array of vector items to render.
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
 * <DigitalSubmissionFieldVectorsAttribute
 *   digitalsubmissionfield={digitalsubmissionfield}
 *   Visualiser={VectorMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalSubmissionFieldVectorsAttribute = ({
    digitalsubmissionfield,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { vectors: unfiltered } = digitalsubmissionfield
    if (typeof unfiltered === 'undefined') return null
    const vectors = unfiltered.filter(filter)
    if (vectors.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalSubmissionFieldVectorsAttribute 
                {...props}    
                digitalsubmissionfield={{vectors: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalsubmissionfield, skip: 0, limit: 10 }}
                asyncAction={DigitalSubmissionFieldVectorsAttributeAsyncAction}
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