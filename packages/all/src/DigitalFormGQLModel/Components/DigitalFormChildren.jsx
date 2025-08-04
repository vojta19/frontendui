import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalFormChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `digitalform` entity along with other props to all child elements.
 * This component is useful for injecting a common `digitalform` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormChildren component.
 * @param {any} props.digitalform - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `digitalform` entity.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { id: 1, message: "No data available" };
 *
 * <DigitalFormChildren digitalform={digitalformEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </DigitalFormChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'digitalform' prop with the specified entity.
 */
export const DigitalFormChildren = ({digitalform, children, ...props}) => <ChildWrapper digitalform={digitalform} children={children} {...props} />