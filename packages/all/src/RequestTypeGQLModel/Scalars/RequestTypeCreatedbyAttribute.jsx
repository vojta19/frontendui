import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `createdby` attribute of an requesttype entity.
 *
 * This component checks if the `createdby` attribute exists on the `requesttype` object. If `createdby` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `createdby` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeCreatedbyAttribute component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {*} [props.requesttype.createdby] - The createdby attribute of the requesttype entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `createdby` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { createdby: { id: 1, name: "Sample Createdby" } };
 *
 * <RequestTypeCreatedbyAttribute requesttype={requesttypeEntity} />
 */
export const RequestTypeCreatedbyAttribute = ({requesttype}) => {
    const {createdby} = requesttype
    if (typeof createdby === 'undefined') return null
    return (
        <>
            {/* <CreatedbyMediumCard createdby={createdby} /> */}
            {/* <CreatedbyLink createdby={createdby} /> */}
            Probably {'<CreatedbyMediumCard createdby={createdby} />'} <br />
            <pre>{JSON.stringify(createdby, null, 4)}</pre>
        </>
    )
}

const RequestTypeCreatedbyAttributeQuery = `
query RequestTypeQueryRead($id: UUID!) {
    result: requesttypeById(id: $id) {
        __typename
        id
        createdby {
            __typename
            id
        }
    }
}
`

const RequestTypeCreatedbyAttributeAsyncAction = createAsyncGraphQLAction(
    RequestTypeCreatedbyAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `createdby` from a `requesttype` entity.
 *
 * This component uses the `RequestTypeCreatedbyAttributeAsyncAction` to asynchronously fetch
 * the `requesttype.createdby` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.requesttype - The requesttype entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `createdby` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered createdby or a loading/error placeholder.
 *
 * @example
 * <RequestTypeCreatedbyAttributeLazy requesttype={{ id: "abc123" }} />
 *
 * 
 * @example
 * <RequestTypeCreatedbyAttributeLazy
 *   requesttype={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const RequestTypeCreatedbyAttributeLazy = ({requesttype}) => {
    const {loading, error, entity, fetch} = useAsyncAction(RequestTypeCreatedbyAttributeAsyncAction, requesttype)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <RequestTypeCreatedbyAttribute requesttype={entity} />    
}