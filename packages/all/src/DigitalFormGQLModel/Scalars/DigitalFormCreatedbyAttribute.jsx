import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `createdby` attribute of an digitalform entity.
 *
 * This component checks if the `createdby` attribute exists on the `digitalform` object. If `createdby` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `createdby` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormCreatedbyAttribute component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {*} [props.digitalform.createdby] - The createdby attribute of the digitalform entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `createdby` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { createdby: { id: 1, name: "Sample Createdby" } };
 *
 * <DigitalFormCreatedbyAttribute digitalform={digitalformEntity} />
 */
export const DigitalFormCreatedbyAttribute = ({digitalform}) => {
    const {createdby} = digitalform
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

const DigitalFormCreatedbyAttributeQuery = `
query DigitalFormQueryRead($id: UUID!) {
    result: digitalformById(id: $id) {
        __typename
        id
        createdby {
            __typename
            id
        }
    }
}
`

const DigitalFormCreatedbyAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormCreatedbyAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `createdby` from a `digitalform` entity.
 *
 * This component uses the `DigitalFormCreatedbyAttributeAsyncAction` to asynchronously fetch
 * the `digitalform.createdby` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalform - The digitalform entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `createdby` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered createdby or a loading/error placeholder.
 *
 * @example
 * <DigitalFormCreatedbyAttributeLazy digitalform={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormCreatedbyAttributeLazy
 *   digitalform={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormCreatedbyAttributeLazy = ({digitalform}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormCreatedbyAttributeAsyncAction, digitalform)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormCreatedbyAttribute digitalform={entity} />    
}