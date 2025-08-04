import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `statemachine` attribute of an requesttype entity.
 *
 * This component checks if the `statemachine` attribute exists on the `requesttype` object. If `statemachine` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `statemachine` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeStatemachineAttribute component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {*} [props.requesttype.statemachine] - The statemachine attribute of the requesttype entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `statemachine` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { statemachine: { id: 1, name: "Sample Statemachine" } };
 *
 * <RequestTypeStatemachineAttribute requesttype={requesttypeEntity} />
 */
export const RequestTypeStatemachineAttribute = ({requesttype}) => {
    const {statemachine} = requesttype
    if (typeof statemachine === 'undefined') return null
    return (
        <>
            {/* <StatemachineMediumCard statemachine={statemachine} /> */}
            {/* <StatemachineLink statemachine={statemachine} /> */}
            Probably {'<StatemachineMediumCard statemachine={statemachine} />'} <br />
            <pre>{JSON.stringify(statemachine, null, 4)}</pre>
        </>
    )
}

const RequestTypeStatemachineAttributeQuery = `
query RequestTypeQueryRead($id: UUID!) {
    result: requesttypeById(id: $id) {
        __typename
        id
        statemachine {
            __typename
            id
        }
    }
}
`

const RequestTypeStatemachineAttributeAsyncAction = createAsyncGraphQLAction(
    RequestTypeStatemachineAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `statemachine` from a `requesttype` entity.
 *
 * This component uses the `RequestTypeStatemachineAttributeAsyncAction` to asynchronously fetch
 * the `requesttype.statemachine` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.requesttype - The requesttype entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `statemachine` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered statemachine or a loading/error placeholder.
 *
 * @example
 * <RequestTypeStatemachineAttributeLazy requesttype={{ id: "abc123" }} />
 *
 * 
 * @example
 * <RequestTypeStatemachineAttributeLazy
 *   requesttype={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const RequestTypeStatemachineAttributeLazy = ({requesttype}) => {
    const {loading, error, entity, fetch} = useAsyncAction(RequestTypeStatemachineAttributeAsyncAction, requesttype)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <RequestTypeStatemachineAttribute requesttype={entity} />    
}