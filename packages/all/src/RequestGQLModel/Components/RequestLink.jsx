import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const RequestURI = `${URIRoot}/request/view/`;

/**
 * A React component that renders a `ProxyLink` to an "request" entity's view page.
 *
 * The target URL is dynamically constructed using the `request` object's `id`, and the link displays
 * the `request` object's `name` as its clickable content.
 *
 * @function RequestLink
 * @param {Object} props - The properties for the `RequestLink` component.
 * @param {Object} props.request - The object representing the "request" entity.
 * @param {string|number} props.request.id - The unique identifier for the "request" entity. Used to construct the target URL.
 * @param {string} props.request.name - The display name for the "request" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "request" entity's view page.
 *
 * @example
 * // Example usage with a sample request entity:
 * const requestEntity = { id: 123, name: "Example Request Entity" };
 * 
 * <RequestLink request={requestEntity} />
 * // Renders: <ProxyLink to="/request/request/view/123">Example Request Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/request/request/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const RequestLink = ({request, ...props}) => {
    return <ProxyLink to={RequestURI + request.id} {...props}>{request.name}</ProxyLink>
}