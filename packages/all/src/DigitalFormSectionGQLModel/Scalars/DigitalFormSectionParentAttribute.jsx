import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `parent` attribute of an digitalformsection entity.
 *
 * This component checks if the `parent` attribute exists on the `digitalformsection` object. If `parent` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `parent` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionParentAttribute component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {*} [props.digitalformsection.parent] - The parent attribute of the digitalformsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `parent` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { parent: { id: 1, name: "Sample Parent" } };
 *
 * <DigitalFormSectionParentAttribute digitalformsection={digitalformsectionEntity} />
 */
export const DigitalFormSectionParentAttribute = ({digitalformsection}) => {
    const {parent} = digitalformsection
    if (typeof parent === 'undefined') return null
    return (
        <>
            {/* <ParentMediumCard parent={parent} /> */}
            {/* <ParentLink parent={parent} /> */}
            Probably {'<ParentMediumCard parent={parent} />'} <br />
            <pre>{JSON.stringify(parent, null, 4)}</pre>
        </>
    )
}

const DigitalFormSectionParentAttributeQuery = `
query DigitalFormSectionQueryRead($id: UUID!) {
    result: digitalformsectionById(id: $id) {
        __typename
        id
        parent {
            __typename
            id
        }
    }
}
`

const DigitalFormSectionParentAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormSectionParentAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `parent` from a `digitalformsection` entity.
 *
 * This component uses the `DigitalFormSectionParentAttributeAsyncAction` to asynchronously fetch
 * the `digitalformsection.parent` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformsection - The digitalformsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `parent` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered parent or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSectionParentAttributeLazy digitalformsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSectionParentAttributeLazy
 *   digitalformsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSectionParentAttributeLazy = ({digitalformsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSectionParentAttributeAsyncAction, digitalformsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSectionParentAttribute digitalformsection={entity} />    
}