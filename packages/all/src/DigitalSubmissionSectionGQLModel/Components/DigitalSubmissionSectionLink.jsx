import { ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { URIRoot } from "../../uriroot";

export const DigitalSubmissionSectionURI = `${URIRoot}/digitalsubmissionsection/view/`;

/**
 * A React component that renders a `ProxyLink` to an "digitalsubmissionsection" entity's view page.
 *
 * The target URL is dynamically constructed using the `digitalsubmissionsection` object's `id`, and the link displays
 * the `digitalsubmissionsection` object's `name` as its clickable content.
 *
 * @function DigitalSubmissionSectionLink
 * @param {Object} props - The properties for the `DigitalSubmissionSectionLink` component.
 * @param {Object} props.digitalsubmissionsection - The object representing the "digitalsubmissionsection" entity.
 * @param {string|number} props.digitalsubmissionsection.id - The unique identifier for the "digitalsubmissionsection" entity. Used to construct the target URL.
 * @param {string} props.digitalsubmissionsection.name - The display name for the "digitalsubmissionsection" entity. Used as the link text.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified "digitalsubmissionsection" entity's view page.
 *
 * @example
 * // Example usage with a sample digitalsubmissionsection entity:
 * const digitalsubmissionsectionEntity = { id: 123, name: "Example DigitalSubmissionSection Entity" };
 * 
 * <DigitalSubmissionSectionLink digitalsubmissionsection={digitalsubmissionsectionEntity} />
 * // Renders: <ProxyLink to="/digitalsubmissionsection/digitalsubmissionsection/view/123">Example DigitalSubmissionSection Entity</ProxyLink>
 *
 * @remarks
 * - This component utilizes `ProxyLink` to ensure consistent link behavior, including parameter preservation and conditional reloads.
 * - The URL format `/digitalsubmissionsection/digitalsubmissionsection/view/:id` must be supported by the application routing.
 *
 * @see ProxyLink - The base component used for rendering the link.
 */
export const DigitalSubmissionSectionLink = ({digitalsubmissionsection, ...props}) => {
    return <ProxyLink to={DigitalSubmissionSectionURI + digitalsubmissionsection.id} {...props}>{digitalsubmissionsection.name}</ProxyLink>
}