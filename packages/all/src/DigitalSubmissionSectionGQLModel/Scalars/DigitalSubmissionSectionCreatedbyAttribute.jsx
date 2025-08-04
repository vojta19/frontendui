import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `createdby` attribute of an digitalsubmissionsection entity.
 *
 * This component checks if the `createdby` attribute exists on the `digitalsubmissionsection` object. If `createdby` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `createdby` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSectionCreatedbyAttribute component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {*} [props.digitalsubmissionsection.createdby] - The createdby attribute of the digitalsubmissionsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `createdby` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { createdby: { id: 1, name: "Sample Createdby" } };
 *
 * <DigitalSubmissionSectionCreatedbyAttribute digitalsubmissionsection={digitalsubmissionsectionEntity} />
 */
export const DigitalSubmissionSectionCreatedbyAttribute = ({digitalsubmissionsection}) => {
    const {createdby} = digitalsubmissionsection
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

const DigitalSubmissionSectionCreatedbyAttributeQuery = `
query DigitalSubmissionSectionQueryRead($id: UUID!) {
    result: digitalsubmissionsectionById(id: $id) {
        __typename
        id
        createdby {
            __typename
            id
        }
    }
}
`

const DigitalSubmissionSectionCreatedbyAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalSubmissionSectionCreatedbyAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `createdby` from a `digitalsubmissionsection` entity.
 *
 * This component uses the `DigitalSubmissionSectionCreatedbyAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmissionsection.createdby` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmissionsection - The digitalsubmissionsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `createdby` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered createdby or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionSectionCreatedbyAttributeLazy digitalsubmissionsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionSectionCreatedbyAttributeLazy
 *   digitalsubmissionsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionSectionCreatedbyAttributeLazy = ({digitalsubmissionsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionSectionCreatedbyAttributeAsyncAction, digitalsubmissionsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionSectionCreatedbyAttribute digitalsubmissionsection={entity} />    
}