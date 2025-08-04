import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const DigitalFormFieldURI = `${URIRoot}/digitalformfield/view/`;

/**
 * A React component that renders a `ProxyLink` to an "digitalformfield" entity's view page.
 *
 * The target URL is dynamically constructed using the `digitalformfield` object's `id`, and the link displays
 * the `digitalformfield` object's `name` as its clickable content.
 *
 * @function DigitalFormFieldLink
 * @param {Object} props - The properties for the `DigitalFormFieldLink` component.
 * @param {Object} props.digitalformfield - The object representing the "digitalformfield" entity.
 * @param {string|number} props.digitalformfield.id - The unique identifier for the "digitalformfield" entity. Used to construct the target URL.
 * @param {string} props.digitalformfield.name - The display name for the "digitalformfield" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "digitalformfield" entity's view page.
 *
 * @example
 * // Example usage with a sample digitalformfield entity:
 * const digitalformfieldEntity = { id: 123, name: "Example DigitalFormField Entity" };
 * 
 * <DigitalFormFieldLink digitalformfield={digitalformfieldEntity} />
 * // Renders: <ProxyLink to="/digitalformfield/digitalformfield/view/123">Example DigitalFormField Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/digitalformfield/digitalformfield/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const DigitalFormFieldLink = ({digitalformfield, ...props}) => {
    return <ProxyLink to={DigitalFormFieldURI + digitalformfield.id} {...props}>{digitalformfield.name}</ProxyLink>
}