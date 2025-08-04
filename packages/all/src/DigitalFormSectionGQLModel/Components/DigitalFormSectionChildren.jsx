import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalFormSectionChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `digitalformsection` entity along with other props to all child elements.
 * This component is useful for injecting a common `digitalformsection` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionChildren component.
 * @param {any} props.digitalformsection - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `digitalformsection` entity.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { id: 1, message: "No data available" };
 *
 * <DigitalFormSectionChildren digitalformsection={digitalformsectionEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </DigitalFormSectionChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'digitalformsection' prop with the specified entity.
 */
export const DigitalFormSectionChildren = ({digitalformsection, children, ...props}) => <ChildWrapper digitalformsection={digitalformsection} children={children} {...props} />