import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `section` attribute of an digitalsubmissionsection entity.
 *
 * This component checks if the `section` attribute exists on the `digitalsubmissionsection` object. If `section` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `section` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSectionSectionAttribute component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {*} [props.digitalsubmissionsection.section] - The section attribute of the digitalsubmissionsection entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `section` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { section: { id: 1, name: "Sample Section" } };
 *
 * <DigitalSubmissionSectionSectionAttribute digitalsubmissionsection={digitalsubmissionsectionEntity} />
 */
export const DigitalSubmissionSectionSectionAttribute = ({digitalsubmissionsection}) => {
    const {section} = digitalsubmissionsection
    if (typeof section === 'undefined') return null
    return (
        <>
            {/* <SectionMediumCard section={section} /> */}
            {/* <SectionLink section={section} /> */}
            Probably {'<SectionMediumCard section={section} />'} <br />
            <pre>{JSON.stringify(section, null, 4)}</pre>
        </>
    )
}

const DigitalSubmissionSectionSectionAttributeQuery = `
query DigitalSubmissionSectionQueryRead($id: UUID!) {
    result: digitalsubmissionsectionById(id: $id) {
        __typename
        id
        section {
            __typename
            id
        }
    }
}
`

const DigitalSubmissionSectionSectionAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalSubmissionSectionSectionAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `section` from a `digitalsubmissionsection` entity.
 *
 * This component uses the `DigitalSubmissionSectionSectionAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmissionsection.section` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmissionsection - The digitalsubmissionsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `section` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered section or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionSectionSectionAttributeLazy digitalsubmissionsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionSectionSectionAttributeLazy
 *   digitalsubmissionsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionSectionSectionAttributeLazy = ({digitalsubmissionsection}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionSectionSectionAttributeAsyncAction, digitalsubmissionsection)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionSectionSectionAttribute digitalsubmissionsection={entity} />    
}