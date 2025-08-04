import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `state` attribute of an requesttype entity.
 *
 * This component checks if the `state` attribute exists on the `requesttype` object. If `state` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `state` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeStateAttribute component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {*} [props.requesttype.state] - The state attribute of the requesttype entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `state` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { state: { id: 1, name: "Sample State" } };
 *
 * <RequestTypeStateAttribute requesttype={requesttypeEntity} />
 */
export const RequestTypeStateAttribute = ({requesttype}) => {
    const {state} = requesttype
    if (typeof state === 'undefined') return null
    return (
        <>
            {/* <StateMediumCard state={state} /> */}
            {/* <StateLink state={state} /> */}
            Probably {'<StateMediumCard state={state} />'} <br />
            <pre>{JSON.stringify(state, null, 4)}</pre>
        </>
    )
}

const RequestTypeStateAttributeQuery = `
query RequestTypeQueryRead($id: UUID!) {
    result: requesttypeById(id: $id) {
        __typename
        id
        state {
            __typename
            id
        }
    }
}
`

const RequestTypeStateAttributeAsyncAction = createAsyncGraphQLAction(
    RequestTypeStateAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `state` from a `requesttype` entity.
 *
 * This component uses the `RequestTypeStateAttributeAsyncAction` to asynchronously fetch
 * the `requesttype.state` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.requesttype - The requesttype entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `state` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered state or a loading/error placeholder.
 *
 * @example
 * <RequestTypeStateAttributeLazy requesttype={{ id: "abc123" }} />
 *
 * 
 * @example
 * <RequestTypeStateAttributeLazy
 *   requesttype={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const RequestTypeStateAttributeLazy = ({requesttype}) => {
    const {loading, error, entity, fetch} = useAsyncAction(RequestTypeStateAttributeAsyncAction, requesttype)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <RequestTypeStateAttribute requesttype={entity} />    
}