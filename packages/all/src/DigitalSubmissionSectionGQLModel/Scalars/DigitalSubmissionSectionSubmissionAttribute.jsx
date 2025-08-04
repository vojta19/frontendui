import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `submission` attribute of an digitalsubmissionsection entity.
 *
 * This component checks if the `submission` attribute exists on the `digitalsubmissionsection` object. If `submission` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `submission` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSectionSubmissionAttribute component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {*} [props.digitalsubmissionsection.submission] - The submission attribute of the digitalsubmissionsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `submission` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { submission: { id: 1, name: "Sample Submission" } };
 *
 * <DigitalSubmissionSectionSubmissionAttribute digitalsubmissionsection={digitalsubmissionsectionEntity} />
 */
export const DigitalSubmissionSectionSubmissionAttribute = ({digitalsubmissionsection}) => {
    const {submission} = digitalsubmissionsection
    if (typeof submission === 'undefined') return null
    return (
        <>
            {/* <SubmissionMediumCard submission={submission} /> */}
            {/* <SubmissionLink submission={submission} /> */}
            Probably {'<SubmissionMediumCard submission={submission} />'} <br />
            <pre>{JSON.stringify(submission, null, 4)}</pre>
        </>
    )
}

const DigitalSubmissionSectionSubmissionAttributeQuery = `
query DigitalSubmissionSectionQueryRead($id: UUID!) {
    result: digitalsubmissionsectionById(id: $id) {
        __typename
        id
        submission {
            __typename
            id
        }
    }
}
`

const DigitalSubmissionSectionSubmissionAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalSubmissionSectionSubmissionAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `submission` from a `digitalsubmissionsection` entity.
 *
 * This component uses the `DigitalSubmissionSectionSubmissionAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmissionsection.submission` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmissionsection - The digitalsubmissionsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `submission` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered submission or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionSectionSubmissionAttributeLazy digitalsubmissionsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionSectionSubmissionAttributeLazy
 *   digitalsubmissionsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionSectionSubmissionAttributeLazy = ({digitalsubmissionsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionSectionSubmissionAttributeAsyncAction, digitalsubmissionsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionSectionSubmissionAttribute digitalsubmissionsection={entity} />    
}