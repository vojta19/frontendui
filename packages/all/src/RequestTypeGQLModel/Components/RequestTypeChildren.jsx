import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * RequestTypeChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `requesttype` entity along with other props to all child elements.
 * This component is useful for injecting a common `requesttype` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeChildren component.
 * @param {any} props.requesttype - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `requesttype` entity.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { id: 1, message: "No data available" };
 *
 * <RequestTypeChildren requesttype={requesttypeEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </RequestTypeChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'requesttype' prop with the specified entity.
 */
export const RequestTypeChildren = ({requesttype, children, ...props}) => <ChildWrapper requesttype={requesttype} children={children} {...props} />