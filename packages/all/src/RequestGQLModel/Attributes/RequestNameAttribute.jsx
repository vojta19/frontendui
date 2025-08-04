/**
 * A component for displaying the `name` attribute of an request entity.
 *
 * This component checks if the `name` attribute exists on the `request` object. If `name` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `name` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestNameAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {*} [props.request.name] - The name attribute of the request entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `name` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { name: { id: 1, name: "Sample Name" } };
 *
 * <RequestNameAttribute request={requestEntity} />
 */
export const RequestNameAttribute = ({request}) => <>{request?.name}</>
