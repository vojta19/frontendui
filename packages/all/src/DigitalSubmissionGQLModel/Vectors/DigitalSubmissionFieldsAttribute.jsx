import { useEffect, useMemo } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionFieldLiveEdit } from "../../DigitalSubmissionFieldGQLModel/Components/DigitalSubmissionFieldLiveEdit";
import { DigitalSubmissionSectionFields } from "../../DigitalSubmissionFieldGQLModel/Vectors/DigitalSubmissionSectionFields";


/**
 * Inserts a FieldGQLModel item into a digitalsubmission’s fields array and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `fields` array.
 * @param {Object} fieldItem - The item to insert; must have `__typename === "FieldGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionFieldItemInsert = (digitalsubmission, fieldItem, dispatch) => {
    const { __typename } = fieldItem;
    if (__typename === "FieldGQLModel") {
        const { fields, ...others } = digitalsubmission;
        const newDigitalSubmissionFieldItems = [...fields, fieldItem];
        const newDigitalSubmission = { ...others, fields: newDigitalSubmissionFieldItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

/**
 * Replaces an existing FieldGQLModel item in a digitalsubmission’s fields array and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `fields` array.
 * @param {Object} fieldItem - The updated item; must have `__typename === "FieldGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionFieldItemUpdate = (digitalsubmission, fieldItem, dispatch) => {
    const { __typename } = fieldItem;
    if (__typename === "FieldGQLModel") {
        const { fields, ...others } = digitalsubmission;
        const newDigitalSubmissionFieldItems = fields.map(item =>
            item.id === fieldItem.id ? fieldItem : item
        );
        const newDigitalSubmission = { ...others, fields: newDigitalSubmissionFieldItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

/**
 * Removes a FieldGQLModel item from a digitalsubmission’s fields array by its `id` and dispatches an update.
 *
 * @param {Object} digitalsubmission - The current digitalsubmission object containing a `fields` array.
 * @param {Object} fieldItem - The item to delete; must have `__typename === "FieldGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionFieldItemDelete = (digitalsubmission, fieldItem, dispatch) => {
    const { __typename } = fieldItem;
    if (__typename === "FieldGQLModel") {
        const { fields, ...others } = digitalsubmission;
        const newDigitalSubmissionFieldItems = fields.filter(
            item => item.id !== fieldItem.id
        );
        const newDigitalSubmission = { ...others, fields: newDigitalSubmissionFieldItems };
        dispatch(ItemActions.item_update(newDigitalSubmission));
    }
};

const DigitalSubmissionFieldsAttributeQuery = `
query DigitalSubmissionQueryRead($id: UUID!, $where: FieldInputFilter, $skip: Int, $limit: Int) {
    result: digitalsubmissionById(id: $id) {
        __typename
        id
        fields(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...FieldMedium
        }
    }
}
`

const DigitalSubmissionFieldsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalSubmissionFieldsAttributeQuery,
        //FieldMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("fields")
)


/**
 * A component for displaying the `fields` attribute of a digitalsubmission entity.
 *
 * This component checks if the `fields` attribute exists on the `digitalsubmission` object. If `fields` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `fields` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionFieldsAttribute component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {Array<Object>} [props.digitalsubmission.fields] - An array of field items associated with the digitalsubmission entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the fields array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `fields` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalsubmissionEntity = { 
 *   fields: [
 *     { id: 1, name: "Field Item 1" }, 
 *     { id: 2, name: "Field Item 2" }
 *   ] 
 * };
 * <DigitalSubmissionFieldsAttribute digitalsubmission={digitalsubmissionEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalSubmissionFieldsAttribute 
 *   digitalsubmission={digitalsubmissionEntity}
 *   filter={field => field.name.includes("1")}
 * />
 */
export const DigitalSubmissionFieldsAttribute_old = ({digitalsubmission, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { fields: unfiltered } = digitalsubmission
    if (typeof unfiltered === 'undefined') return null
    const fields = unfiltered.filter(filter)
    if (fields.length === 0) return null
    return (
        <>
            {fields.map(
                field => <Visualiser id={field.id} key={field.id} field={field} />
            )}
        </>
    )
}

/**
 * Visualiser component for displaying a list of field items using `DigitalSubmissionFieldsAttribute`.
 *
 * Wraps the `DigitalSubmissionFieldsAttribute` component, passing the given `items` as the `fields` attribute
 * on a synthetic `digitalsubmission` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of field items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalSubmissionFieldsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of fields or `null` if none are provided.
 *
 * @example
 * <FieldsVisualiser
 *   items={[
 *     { id: 1, name: "Field 1" },
 *     { id: 2, name: "Field 2" }
 *   ]}
 *   filter={v => v.name.includes("1")}
 * />
 */
const FieldsVisualiser = ({ items, ...props }) => 
    <DigitalSubmissionFieldsAttribute_old {...props} digitalsubmission={{ fields: items }} />

/**
 * Infinite-scrolling component for the `fields` attribute of a digitalsubmission entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `fields` array
 * associated with the provided `digitalsubmission` object. It utilizes `FieldsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalsubmission - The digitalsubmission entity containing the `fields` array.
 * @param {Array<Object>} [props.digitalsubmission.fields] - (Optional) Preloaded field items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `FieldsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of fields.
 *
 * @example
 * <DigitalSubmissionFieldsAttributeInfinite
 *   digitalsubmission={{
 *     fields: [
 *       { id: 1, name: "Field 1" },
 *       { id: 2, name: "Field 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalSubmissionFieldsAttributeInfinite = ({digitalsubmission, actionParams={}, ...props}) => { 
    const {fields} = digitalsubmission

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={FieldsVisualiser} 
            preloadedItems={fields}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalSubmissionFieldsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `fields` from a `digitalsubmission` entity.
 *
 * This component uses the `DigitalSubmissionFieldsAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmission.fields` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each field item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmission - The digitalsubmission entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `fields` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered fields or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionFieldsAttributeLazy digitalsubmission={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionFieldsAttributeLazy
 *   digitalsubmission={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionFieldsAttributeLazy = ({digitalsubmission, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionFieldsAttributeAsyncAction, digitalsubmission, {deferred: true})
    useEffect(() => {
        fetch(digitalsubmission)
    }, [digitalsubmission])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionFieldsAttribute_old digitalsubmission={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({field, children}) => <div>
    Probably {'<FieldMediumCard field={field} />'} <br />
    <pre>{JSON.stringify(field, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `fields` attribute of a digitalsubmission entity.
 *
 * Applies an optional filter function to the fields array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.digitalsubmission - The digitalsubmission entity containing the `fields` array.
 * @param {Array<object>} [props.digitalsubmission.fields] - Array of field items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each field item.
 *   Receives `field` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 *   This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on fields before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no fields.
 *
 * @example
 * <DigitalSubmissionFieldsAttribute
 *   digitalsubmission={digitalsubmission}
 *   Visualiser={FieldMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalSubmissionFieldsAttribute_ = ({
    digitalsubmission,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { fields: unfiltered } = digitalsubmission
    if (typeof unfiltered === 'undefined') return null
    const fields = unfiltered.filter(filter)
    if (fields.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalSubmissionFieldsAttribute 
                {...props}    
                digitalsubmission={{fields: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalsubmission, skip: 0, limit: 10 }}
                asyncAction={DigitalSubmissionFieldsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={fields}
            />
        );
    }

    return (
        <>
        {fields.map((field) => (
            <Layout key={field.id}>
                {field && <Visualiser {...props} field={field} />}
            </Layout>
        ))}
        </>
    );
};

export const DigitalSubmissionFieldsAttribute = ({digitalsubmission}) => {
    const {fields = []} = digitalsubmission;
    return (
        <DigitalSubmissionSectionFields fields={fields} />
    )
}