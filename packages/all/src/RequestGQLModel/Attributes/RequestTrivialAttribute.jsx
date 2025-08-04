/**
 * A component for displaying the `trivial` attribute of an request entity.
 *
 * This component checks if the `trivial` attribute exists on the `request` object. If `trivial` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `trivial` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestTrivialAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {*} [props.request.trivial] - The trivial attribute of the request entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `trivial` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { trivial: { id: 1, name: "Sample Trivial" } };
 *
 * <RequestTrivialAttribute request={requestEntity} />
 */
export const RequestTrivialAttribute = ({request}) => <>{request?.trivial}</>
