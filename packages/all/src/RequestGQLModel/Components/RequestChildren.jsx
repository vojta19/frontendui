import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * RequestChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `request` entity along with other props to all child elements.
 * This component is useful for injecting a common `request` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the RequestChildren component.
 * @param {any} props.request - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `request` entity.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 1, message: "No data available" };
 *
 * <RequestChildren request={requestEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </RequestChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'request' prop with the specified entity.
 */
export const RequestChildren = ({request, children, ...props}) => <ChildWrapper request={request} children={children} {...props} />