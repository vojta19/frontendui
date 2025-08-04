import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalFormFieldChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `digitalformfield` entity along with other props to all child elements.
 * This component is useful for injecting a common `digitalformfield` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormFieldChildren component.
 * @param {any} props.digitalformfield - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `digitalformfield` entity.
 *
 * @example
 * // Example usage:
 * const digitalformfieldEntity = { id: 1, message: "No data available" };
 *
 * <DigitalFormFieldChildren digitalformfield={digitalformfieldEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </DigitalFormFieldChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'digitalformfield' prop with the specified entity.
 */
export const DigitalFormFieldChildren = ({digitalformfield, children, ...props}) => <ChildWrapper digitalformfield={digitalformfield} children={children} {...props} />