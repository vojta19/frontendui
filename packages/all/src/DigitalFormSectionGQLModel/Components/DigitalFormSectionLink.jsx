import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const DigitalFormSectionURI = `${URIRoot}/digitalformsection/view/`;

/**
 * A React component that renders a `ProxyLink` to an "digitalformsection" entity's view page.
 *
 * The target URL is dynamically constructed using the `digitalformsection` object's `id`, and the link displays
 * the `digitalformsection` object's `name` as its clickable content.
 *
 * @function DigitalFormSectionLink
 * @param {Object} props - The properties for the `DigitalFormSectionLink` component.
 * @param {Object} props.digitalformsection - The object representing the "digitalformsection" entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the "digitalformsection" entity. Used to construct the target URL.
 * @param {string} props.digitalformsection.name - The display name for the "digitalformsection" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "digitalformsection" entity's view page.
 *
 * @example
 * // Example usage with a sample digitalformsection entity:
 * const digitalformsectionEntity = { id: 123, name: "Example DigitalFormSection Entity" };
 * 
 * <DigitalFormSectionLink digitalformsection={digitalformsectionEntity} />
 * // Renders: <ProxyLink to="/digitalformsection/digitalformsection/view/123">Example DigitalFormSection Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/digitalformsection/digitalformsection/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const DigitalFormSectionLink = ({digitalformsection, ...props}) => {
    return <ProxyLink to={DigitalFormSectionURI + digitalformsection.id} {...props}>{digitalformsection.name}</ProxyLink>
}