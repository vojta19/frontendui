import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalSubmissionChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `digitalsubmission` entity along with other props to all child elements.
 * This component is useful for injecting a common `digitalsubmission` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionChildren component.
 * @param {any} props.digitalsubmission - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `digitalsubmission` entity.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionEntity = { id: 1, message: "No data available" };
 *
 * <DigitalSubmissionChildren digitalsubmission={digitalsubmissionEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </DigitalSubmissionChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'digitalsubmission' prop with the specified entity.
 */
export const DigitalSubmissionChildren = ({digitalsubmission, children, ...props}) => <ChildWrapper digitalsubmission={digitalsubmission} children={children} {...props} />