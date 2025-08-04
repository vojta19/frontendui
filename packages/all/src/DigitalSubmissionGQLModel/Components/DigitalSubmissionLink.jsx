import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const DigitalSubmissionURI = `${URIRoot}/digitalsubmission/view/`;

/**
 * A React component that renders a `ProxyLink` to an "digitalsubmission" entity's view page.
 *
 * The target URL is dynamically constructed using the `digitalsubmission` object's `id`, and the link displays
 * the `digitalsubmission` object's `name` as its clickable content.
 *
 * @function DigitalSubmissionLink
 * @param {Object} props - The properties for the `DigitalSubmissionLink` component.
 * @param {Object} props.digitalsubmission - The object representing the "digitalsubmission" entity.
 * @param {string|number} props.digitalsubmission.id - The unique identifier for the "digitalsubmission" entity. Used to construct the target URL.
 * @param {string} props.digitalsubmission.name - The display name for the "digitalsubmission" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "digitalsubmission" entity's view page.
 *
 * @example
 * // Example usage with a sample digitalsubmission entity:
 * const digitalsubmissionEntity = { id: 123, name: "Example DigitalSubmission Entity" };
 * 
 * <DigitalSubmissionLink digitalsubmission={digitalsubmissionEntity} />
 * // Renders: <ProxyLink to="/digitalsubmission/digitalsubmission/view/123">Example DigitalSubmission Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/digitalsubmission/digitalsubmission/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const DigitalSubmissionLink = ({digitalsubmission, ...props}) => {
    return <ProxyLink to={DigitalSubmissionURI + digitalsubmission.id} {...props}>{digitalsubmission.name}</ProxyLink>
}