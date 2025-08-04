import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `formsection` attribute of an digitalformfield entity.
 *
 * This component checks if the `formsection` attribute exists on the `digitalformfield` object. If `formsection` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `formsection` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormFieldFormsectionAttribute component.
 * @param {Object} props.digitalformfield - The object representing the digitalformfield entity.
 * @param {*} [props.digitalformfield.formsection] - The formsection attribute of the digitalformfield entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `formsection` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformfieldEntity = { formsection: { id: 1, name: "Sample Formsection" } };
 *
 * <DigitalFormFieldFormsectionAttribute digitalformfield={digitalformfieldEntity} />
 */
export const DigitalFormFieldFormsectionAttribute = ({digitalformfield}) => {
    const {formsection} = digitalformfield
    if (typeof formsection === 'undefined') return null
    return (
        <>
            {/* <FormsectionMediumCard formsection={formsection} /> */}
            {/* <FormsectionLink formsection={formsection} /> */}
            Probably {'<FormsectionMediumCard formsection={formsection} />'} <br />
            <pre>{JSON.stringify(formsection, null, 4)}</pre>
        </>
    )
}

const DigitalFormFieldFormsectionAttributeQuery = `
query DigitalFormFieldQueryRead($id: UUID!) {
    result: digitalformfieldById(id: $id) {
        __typename
        id
        formsection {
            __typename
            id
        }
    }
}
`

const DigitalFormFieldFormsectionAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormFieldFormsectionAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `formsection` from a `digitalformfield` entity.
 *
 * This component uses the `DigitalFormFieldFormsectionAttributeAsyncAction` to asynchronously fetch
 * the `digitalformfield.formsection` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformfield - The digitalformfield entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `formsection` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered formsection or a loading/error placeholder.
 *
 * @example
 * <DigitalFormFieldFormsectionAttributeLazy digitalformfield={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormFieldFormsectionAttributeLazy
 *   digitalformfield={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormFieldFormsectionAttributeLazy = ({digitalformfield}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormFieldFormsectionAttributeAsyncAction, digitalformfield)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormFieldFormsectionAttribute digitalformfield={entity} />    
}