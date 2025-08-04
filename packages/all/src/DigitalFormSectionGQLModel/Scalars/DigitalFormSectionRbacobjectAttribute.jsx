import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `rbacobject` attribute of an digitalformsection entity.
 *
 * This component checks if the `rbacobject` attribute exists on the `digitalformsection` object. If `rbacobject` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `rbacobject` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionRbacobjectAttribute component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {*} [props.digitalformsection.rbacobject] - The rbacobject attribute of the digitalformsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `rbacobject` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { rbacobject: { id: 1, name: "Sample Rbacobject" } };
 *
 * <DigitalFormSectionRbacobjectAttribute digitalformsection={digitalformsectionEntity} />
 */
export const DigitalFormSectionRbacobjectAttribute = ({digitalformsection}) => {
    const {rbacobject} = digitalformsection
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

const DigitalFormSectionRbacobjectAttributeQuery = `
query DigitalFormSectionQueryRead($id: UUID!) {
    result: digitalformsectionById(id: $id) {
        __typename
        id
        rbacobject {
            __typename
            id
        }
    }
}
`

const DigitalFormSectionRbacobjectAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormSectionRbacobjectAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `rbacobject` from a `digitalformsection` entity.
 *
 * This component uses the `DigitalFormSectionRbacobjectAttributeAsyncAction` to asynchronously fetch
 * the `digitalformsection.rbacobject` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformsection - The digitalformsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `rbacobject` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered rbacobject or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSectionRbacobjectAttributeLazy digitalformsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSectionRbacobjectAttributeLazy
 *   digitalformsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSectionRbacobjectAttributeLazy = ({digitalformsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSectionRbacobjectAttributeAsyncAction, digitalformsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSectionRbacobjectAttribute digitalformsection={entity} />    
}