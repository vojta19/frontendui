import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const DigitalFormURI = `${URIRoot}/digitalform/view/`;

/**
 * A React component that renders a `ProxyLink` to an "digitalform" entity's view page.
 *
 * The target URL is dynamically constructed using the `digitalform` object's `id`, and the link displays
 * the `digitalform` object's `name` as its clickable content.
 *
 * @function DigitalFormLink
 * @param {Object} props - The properties for the `DigitalFormLink` component.
 * @param {Object} props.digitalform - The object representing the "digitalform" entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the "digitalform" entity. Used to construct the target URL.
 * @param {string} props.digitalform.name - The display name for the "digitalform" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "digitalform" entity's view page.
 *
 * @example
 * // Example usage with a sample digitalform entity:
 * const digitalformEntity = { id: 123, name: "Example DigitalForm Entity" };
 * 
 * <DigitalFormLink digitalform={digitalformEntity} />
 * // Renders: <ProxyLink to="/digitalform/digitalform/view/123">Example DigitalForm Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/digitalform/digitalform/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const DigitalFormLink = ({digitalform, ...props}) => {
    return <ProxyLink to={DigitalFormURI + digitalform.id} {...props}>{digitalform.name}</ProxyLink>
}