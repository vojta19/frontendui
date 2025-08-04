import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const RequestTypeURI = `${URIRoot}/requesttype/view/`;

/**
 * A React component that renders a `ProxyLink` to an "requesttype" entity's view page.
 *
 * The target URL is dynamically constructed using the `requesttype` object's `id`, and the link displays
 * the `requesttype` object's `name` as its clickable content.
 *
 * @function RequestTypeLink
 * @param {Object} props - The properties for the `RequestTypeLink` component.
 * @param {Object} props.requesttype - The object representing the "requesttype" entity.
 * @param {string|number} props.requesttype.id - The unique identifier for the "requesttype" entity. Used to construct the target URL.
 * @param {string} props.requesttype.name - The display name for the "requesttype" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "requesttype" entity's view page.
 *
 * @example
 * // Example usage with a sample requesttype entity:
 * const requesttypeEntity = { id: 123, name: "Example RequestType Entity" };
 * 
 * <RequestTypeLink requesttype={requesttypeEntity} />
 * // Renders: <ProxyLink to="/requesttype/requesttype/view/123">Example RequestType Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/requesttype/requesttype/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const RequestTypeLink = ({requesttype, ...props}) => {
    return <ProxyLink to={RequestTypeURI + requesttype.id} {...props}>{requesttype.name}</ProxyLink>
}