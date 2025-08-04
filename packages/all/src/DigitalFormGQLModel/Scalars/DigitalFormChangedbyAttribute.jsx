import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `changedby` attribute of an digitalform entity.
 *
 * This component checks if the `changedby` attribute exists on the `digitalform` object. If `changedby` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `changedby` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormChangedbyAttribute component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {*} [props.digitalform.changedby] - The changedby attribute of the digitalform entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `changedby` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { changedby: { id: 1, name: "Sample Changedby" } };
 *
 * <DigitalFormChangedbyAttribute digitalform={digitalformEntity} />
 */
export const DigitalFormChangedbyAttribute = ({digitalform}) => {
    const {changedby} = digitalform
    if (typeof changedby === 'undefined') return null
    return (
        <>
            {/* <ChangedbyMediumCard changedby={changedby} /> */}
            {/* <ChangedbyLink changedby={changedby} /> */}
            Probably {'<ChangedbyMediumCard changedby={changedby} />'} <br />
            <pre>{JSON.stringify(changedby, null, 4)}</pre>
        </>
    )
}

const DigitalFormChangedbyAttributeQuery = `
query DigitalFormQueryRead($id: UUID!) {
    result: digitalformById(id: $id) {
        __typename
        id
        changedby {
            __typename
            id
        }
    }
}
`

const DigitalFormChangedbyAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormChangedbyAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `changedby` from a `digitalform` entity.
 *
 * This component uses the `DigitalFormChangedbyAttributeAsyncAction` to asynchronously fetch
 * the `digitalform.changedby` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalform - The digitalform entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `changedby` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered changedby or a loading/error placeholder.
 *
 * @example
 * <DigitalFormChangedbyAttributeLazy digitalform={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormChangedbyAttributeLazy
 *   digitalform={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormChangedbyAttributeLazy = ({digitalform}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormChangedbyAttributeAsyncAction, digitalform)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormChangedbyAttribute digitalform={entity} />    
}