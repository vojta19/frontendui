import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `rbacobject` attribute of an requesttype entity.
 *
 * This component checks if the `rbacobject` attribute exists on the `requesttype` object. If `rbacobject` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `rbacobject` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeRbacobjectAttribute component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {*} [props.requesttype.rbacobject] - The rbacobject attribute of the requesttype entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `rbacobject` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { rbacobject: { id: 1, name: "Sample Rbacobject" } };
 *
 * <RequestTypeRbacobjectAttribute requesttype={requesttypeEntity} />
 */
export const RequestTypeRbacobjectAttribute = ({requesttype}) => {
    const {rbacobject} = requesttype
    if (typeof rbacobject === 'undefined') return null
    return (
        <>
            {/* <RbacobjectMediumCard rbacobject={rbacobject} /> */}
            {/* <RbacobjectLink rbacobject={rbacobject} /> */}
            Probably {'<RbacobjectMediumCard rbacobject={rbacobject} />'} <br />
            <pre>{JSON.stringify(rbacobject, null, 4)}</pre>
        </>
    )
}

const RequestTypeRbacobjectAttributeQuery = `
query RequestTypeQueryRead($id: UUID!) {
    result: requesttypeById(id: $id) {
        __typename
        id
        rbacobject {
            __typename
            id
        }
    }
}
`

const RequestTypeRbacobjectAttributeAsyncAction = createAsyncGraphQLAction(
    RequestTypeRbacobjectAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `rbacobject` from a `requesttype` entity.
 *
 * This component uses the `RequestTypeRbacobjectAttributeAsyncAction` to asynchronously fetch
 * the `requesttype.rbacobject` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.requesttype - The requesttype entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `rbacobject` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered rbacobject or a loading/error placeholder.
 *
 * @example
 * <RequestTypeRbacobjectAttributeLazy requesttype={{ id: "abc123" }} />
 *
 * 
 * @example
 * <RequestTypeRbacobjectAttributeLazy
 *   requesttype={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const RequestTypeRbacobjectAttributeLazy = ({requesttype}) => {
    const {loading, error, entity, fetch} = useAsyncAction(RequestTypeRbacobjectAttributeAsyncAction, requesttype)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <RequestTypeRbacobjectAttribute requesttype={entity} />    
}