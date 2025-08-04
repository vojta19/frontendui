import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalSubmissionFieldChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `digitalsubmissionfield` entity along with other props to all child elements.
 * This component is useful for injecting a common `digitalsubmissionfield` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionFieldChildren component.
 * @param {any} props.digitalsubmissionfield - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `digitalsubmissionfield` entity.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionfieldEntity = { id: 1, message: "No data available" };
 *
 * <DigitalSubmissionFieldChildren digitalsubmissionfield={digitalsubmissionfieldEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </DigitalSubmissionFieldChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'digitalsubmissionfield' prop with the specified entity.
 */
export const DigitalSubmissionFieldChildren = ({digitalsubmissionfield, children, ...props}) => <ChildWrapper digitalsubmissionfield={digitalsubmissionfield} children={children} {...props} />