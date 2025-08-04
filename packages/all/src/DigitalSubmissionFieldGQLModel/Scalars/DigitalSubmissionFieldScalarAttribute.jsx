import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `scalar` attribute of an digitalsubmissionfield entity.
 *
 * This component checks if the `scalar` attribute exists on the `digitalsubmissionfield` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionFieldScalarAttribute component.
 * @param {Object} props.digitalsubmissionfield - The object representing the digitalsubmissionfield entity.
 * @param {*} [props.digitalsubmissionfield.scalar] - The scalar attribute of the digitalsubmissionfield entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionfieldEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <DigitalSubmissionFieldScalarAttribute digitalsubmissionfield={digitalsubmissionfieldEntity} />
 */
export const DigitalSubmissionFieldScalarAttribute = ({digitalsubmissionfield}) => {
    const {scalar} = digitalsubmissionfield
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

const DigitalSubmissionFieldScalarAttributeQuery = `
query DigitalSubmissionFieldQueryRead($id: UUID!) {
    result: digitalsubmissionfieldById(id: $id) {
        __typename
        id
        scalar {
            __typename
            id
        }
    }
}
`

const DigitalSubmissionFieldScalarAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalSubmissionFieldScalarAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `scalar` from a `digitalsubmissionfield` entity.
 *
 * This component uses the `DigitalSubmissionFieldScalarAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmissionfield.scalar` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmissionfield - The digitalsubmissionfield entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `scalar` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered scalar or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionFieldScalarAttributeLazy digitalsubmissionfield={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionFieldScalarAttributeLazy
 *   digitalsubmissionfield={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionFieldScalarAttributeLazy = ({digitalsubmissionfield}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionFieldScalarAttributeAsyncAction, digitalsubmissionfield)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionFieldScalarAttribute digitalsubmissionfield={entity} />    
}