/**
 * A component for displaying the `name` attribute of an digitalsubmission entity.
 *
 * This component checks if the `name` attribute exists on the `digitalsubmission` object. If `name` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `name` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionNameAttribute component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {*} [props.digitalsubmission.name] - The name attribute of the digitalsubmission entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `name` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionEntity = { name: { id: 1, name: "Sample Name" } };
 *
 * <DigitalSubmissionNameAttribute digitalsubmission={digitalsubmissionEntity} />
 */
export const DigitalSubmissionNameAttribute = ({digitalsubmission}) => <>{digitalsubmission?.name}</>
