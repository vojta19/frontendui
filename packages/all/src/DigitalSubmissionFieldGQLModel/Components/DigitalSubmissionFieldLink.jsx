import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const DigitalSubmissionFieldURI = `${URIRoot}/digitalsubmissionfield/view/`;

/**
 * A React component that renders a `ProxyLink` to an "digitalsubmissionfield" entity's view page.
 *
 * The target URL is dynamically constructed using the `digitalsubmissionfield` object's `id`, and the link displays
 * the `digitalsubmissionfield` object's `name` as its clickable content.
 *
 * @function DigitalSubmissionFieldLink
 * @param {Object} props - The properties for the `DigitalSubmissionFieldLink` component.
 * @param {Object} props.digitalsubmissionfield - The object representing the "digitalsubmissionfield" entity.
 * @param {string|number} props.digitalsubmissionfield.id - The unique identifier for the "digitalsubmissionfield" entity. Used to construct the target URL.
 * @param {string} props.digitalsubmissionfield.name - The display name for the "digitalsubmissionfield" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "digitalsubmissionfield" entity's view page.
 *
 * @example
 * // Example usage with a sample digitalsubmissionfield entity:
 * const digitalsubmissionfieldEntity = { id: 123, name: "Example DigitalSubmissionField Entity" };
 * 
 * <DigitalSubmissionFieldLink digitalsubmissionfield={digitalsubmissionfieldEntity} />
 * // Renders: <ProxyLink to="/digitalsubmissionfield/digitalsubmissionfield/view/123">Example DigitalSubmissionField Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/digitalsubmissionfield/digitalsubmissionfield/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const DigitalSubmissionFieldLink = ({digitalsubmissionfield, ...props}) => {
    return <ProxyLink to={DigitalSubmissionFieldURI + digitalsubmissionfield.id} {...props}>{digitalsubmissionfield.name}</ProxyLink>
}