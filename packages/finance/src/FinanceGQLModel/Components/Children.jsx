import { ChildWrapper } from "@hrbolek/uoisfrontend-shared" // import ChildWrapper komponenty pro obalení potomků

/**
 * A utility component that wraps children with the `ChildWrapper` component.
 *
 * This component passes down an `item` entity along with other props to all child elements,
 * allowing children to access common data while preserving their functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {any} props.item - An entity (object, string, or other data) to be passed to children.
 * @param {React.ReactNode} props.children - The child elements to be wrapped.
 * @param {...any} props - Additional props to be forwarded to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with injected `item`.
 *
 * @example
 * import { Children } from './Children';
 *
 * const item = { id: 1, name: "Finance Item" };
 *
 * <Children item={item}>
 *   <CustomMessage />
 *   <CustomIcon />
 * </Children>
 *
 * // Both children receive the 'item' prop with the specified entity.
 */
export const Children = ({ item, children, ...props }) => ( // komponenta destructuje item, children a zbytek props
    <ChildWrapper item={item} children={children} {...props} /> // vrací ChildWrapper s předaným item, potomky a ostatními props
)
