import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `initialform` attribute of an requesttype entity.
 *
 * This component checks if the `initialform` attribute exists on the `requesttype` object. If `initialform` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `initialform` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeInitialformAttribute component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {*} [props.requesttype.initialform] - The initialform attribute of the requesttype entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `initialform` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { initialform: { id: 1, name: "Sample Initialform" } };
 *
 * <RequestTypeInitialformAttribute requesttype={requesttypeEntity} />
 */
export const RequestTypeInitialformAttribute = ({requesttype}) => {
    const {initialform} = requesttype
    if (typeof initialform === 'undefined') return null
    return (
        <>
            {/* <InitialformMediumCard initialform={initialform} /> */}
            {/* <InitialformLink initialform={initialform} /> */}
            Probably {'<InitialformMediumCard initialform={initialform} />'} <br />
            <pre>{JSON.stringify(initialform, null, 4)}</pre>
        </>
    )
}

const RequestTypeInitialformAttributeQuery = `
query RequestTypeQueryRead($id: UUID!) {
    result: requesttypeById(id: $id) {
        __typename
        id
        initialform {
            __typename
            id
        }
    }
}
`

const RequestTypeInitialformAttributeAsyncAction = createAsyncGraphQLAction(
    RequestTypeInitialformAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `initialform` from a `requesttype` entity.
 *
 * This component uses the `RequestTypeInitialformAttributeAsyncAction` to asynchronously fetch
 * the `requesttype.initialform` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.requesttype - The requesttype entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `initialform` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered initialform or a loading/error placeholder.
 *
 * @example
 * <RequestTypeInitialformAttributeLazy requesttype={{ id: "abc123" }} />
 *
 * 
 * @example
 * <RequestTypeInitialformAttributeLazy
 *   requesttype={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const RequestTypeInitialformAttributeLazy = ({requesttype}) => {
    const {loading, error, entity, fetch} = useAsyncAction(RequestTypeInitialformAttributeAsyncAction, requesttype)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <RequestTypeInitialformAttribute requesttype={entity} />    
}