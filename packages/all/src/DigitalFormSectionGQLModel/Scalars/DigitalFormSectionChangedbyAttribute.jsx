import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `changedby` attribute of an digitalformsection entity.
 *
 * This component checks if the `changedby` attribute exists on the `digitalformsection` object. If `changedby` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `changedby` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionChangedbyAttribute component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {*} [props.digitalformsection.changedby] - The changedby attribute of the digitalformsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `changedby` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { changedby: { id: 1, name: "Sample Changedby" } };
 *
 * <DigitalFormSectionChangedbyAttribute digitalformsection={digitalformsectionEntity} />
 */
export const DigitalFormSectionChangedbyAttribute = ({digitalformsection}) => {
    const {changedby} = digitalformsection
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

const DigitalFormSectionChangedbyAttributeQuery = `
query DigitalFormSectionQueryRead($id: UUID!) {
    result: digitalformsectionById(id: $id) {
        __typename
        id
        changedby {
            __typename
            id
        }
    }
}
`

const DigitalFormSectionChangedbyAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormSectionChangedbyAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `changedby` from a `digitalformsection` entity.
 *
 * This component uses the `DigitalFormSectionChangedbyAttributeAsyncAction` to asynchronously fetch
 * the `digitalformsection.changedby` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformsection - The digitalformsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `changedby` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered changedby or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSectionChangedbyAttributeLazy digitalformsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSectionChangedbyAttributeLazy
 *   digitalformsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSectionChangedbyAttributeLazy = ({digitalformsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSectionChangedbyAttributeAsyncAction, digitalformsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSectionChangedbyAttribute digitalformsection={entity} />    
}