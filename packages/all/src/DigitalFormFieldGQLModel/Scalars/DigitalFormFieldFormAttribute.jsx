import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `form` attribute of an digitalformfield entity.
 *
 * This component checks if the `form` attribute exists on the `digitalformfield` object. If `form` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `form` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormFieldFormAttribute component.
 * @param {Object} props.digitalformfield - The object representing the digitalformfield entity.
 * @param {*} [props.digitalformfield.form] - The form attribute of the digitalformfield entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `form` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformfieldEntity = { form: { id: 1, name: "Sample Form" } };
 *
 * <DigitalFormFieldFormAttribute digitalformfield={digitalformfieldEntity} />
 */
export const DigitalFormFieldFormAttribute = ({digitalformfield}) => {
    const {form} = digitalformfield
    if (typeof form === 'undefined') return null
    return (
        <>
            {/* <FormMediumCard form={form} /> */}
            {/* <FormLink form={form} /> */}
            Probably {'<FormMediumCard form={form} />'} <br />
            <pre>{JSON.stringify(form, null, 4)}</pre>
        </>
    )
}

const DigitalFormFieldFormAttributeQuery = `
query DigitalFormFieldQueryRead($id: UUID!) {
    result: digitalformfieldById(id: $id) {
        __typename
        id
        form {
            __typename
            id
        }
    }
}
`

const DigitalFormFieldFormAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormFieldFormAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `form` from a `digitalformfield` entity.
 *
 * This component uses the `DigitalFormFieldFormAttributeAsyncAction` to asynchronously fetch
 * the `digitalformfield.form` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformfield - The digitalformfield entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `form` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered form or a loading/error placeholder.
 *
 * @example
 * <DigitalFormFieldFormAttributeLazy digitalformfield={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormFieldFormAttributeLazy
 *   digitalformfield={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormFieldFormAttributeLazy = ({digitalformfield}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormFieldFormAttributeAsyncAction, digitalformfield)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormFieldFormAttribute digitalformfield={entity} />    
}