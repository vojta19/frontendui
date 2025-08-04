/**
 * A component for displaying the `trivial` attribute of an digitalsubmission entity.
 *
 * This component checks if the `trivial` attribute exists on the `digitalsubmission` object. If `trivial` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `trivial` attribute.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionTrivialAttribute component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {*} [props.digitalsubmission.trivial] - The trivial attribute of the digitalsubmission entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `trivial` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionEntity = { trivial: { id: 1, name: "Sample Trivial" } };
 *
 * <DigitalSubmissionTrivialAttribute digitalsubmission={digitalsubmissionEntity} />
 */
export const DigitalSubmissionTrivialAttribute = ({digitalsubmission}) => <>{digitalsubmission?.trivial}</>
