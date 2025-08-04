import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `scalar` attribute of an digitalformsection entity.
 *
 * This component checks if the `scalar` attribute exists on the `digitalformsection` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionScalarAttribute component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {*} [props.digitalformsection.scalar] - The scalar attribute of the digitalformsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <DigitalFormSectionScalarAttribute digitalformsection={digitalformsectionEntity} />
 */
export const DigitalFormSectionScalarAttribute = ({digitalformsection}) => {
    const {scalar} = digitalformsection
    if (typeof scalar === 'undefined') return null
    return (
        <>
            {/* <ScalarMediumCard scalar={scalar} /> */}
            {/* <ScalarLink scalar={scalar} /> */}
            Probably {'<ScalarMediumCard scalar={scalar} />'} <br />
            <pre>{JSON.stringify(scalar, null, 4)}</pre>
        </>
    )
}

const DigitalFormSectionScalarAttributeQuery = `
query DigitalFormSectionQueryRead($id: UUID!) {
    result: digitalformsectionById(id: $id) {
        __typename
        id
        scalar {
            __typename
            id
        }
    }
}
`

const DigitalFormSectionScalarAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormSectionScalarAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `scalar` from a `digitalformsection` entity.
 *
 * This component uses the `DigitalFormSectionScalarAttributeAsyncAction` to asynchronously fetch
 * the `digitalformsection.scalar` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformsection - The digitalformsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `scalar` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered scalar or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSectionScalarAttributeLazy digitalformsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSectionScalarAttributeLazy
 *   digitalformsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSectionScalarAttributeLazy = ({digitalformsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSectionScalarAttributeAsyncAction, digitalformsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSectionScalarAttribute digitalformsection={entity} />    
}