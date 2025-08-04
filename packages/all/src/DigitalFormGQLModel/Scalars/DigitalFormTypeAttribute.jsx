import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `type` attribute of an digitalform entity.
 *
 * This component checks if the `type` attribute exists on the `digitalform` object. If `type` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `type` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormTypeAttribute component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {*} [props.digitalform.type] - The type attribute of the digitalform entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `type` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { type: { id: 1, name: "Sample Type" } };
 *
 * <DigitalFormTypeAttribute digitalform={digitalformEntity} />
 */
export const DigitalFormTypeAttribute = ({digitalform}) => {
    const {type} = digitalform
    if (typeof type === 'undefined') return null
    return (
        <>
            {/* <TypeMediumCard type={type} /> */}
            {/* <TypeLink type={type} /> */}
            Probably {'<TypeMediumCard type={type} />'} <br />
            <pre>{JSON.stringify(type, null, 4)}</pre>
        </>
    )
}

const DigitalFormTypeAttributeQuery = `
query DigitalFormQueryRead($id: UUID!) {
    result: digitalformById(id: $id) {
        __typename
        id
        type {
            __typename
            id
        }
    }
}
`

const DigitalFormTypeAttributeAsyncAction = createAsyncGraphQLAction(
    DigitalFormTypeAttributeQuery
)

/**
 * A lazy-loading component for displaying filtered `type` from a `digitalform` entity.
 *
 * This component uses the `DigitalFormTypeAttributeAsyncAction` to asynchronously fetch
 * the `digitalform.type` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalform - The digitalform entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `type` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered type or a loading/error placeholder.
 *
 * @example
 * <DigitalFormTypeAttributeLazy digitalform={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormTypeAttributeLazy
 *   digitalform={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormTypeAttributeLazy = ({digitalform}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormTypeAttributeAsyncAction, digitalform)

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormTypeAttribute digitalform={entity} />    
}