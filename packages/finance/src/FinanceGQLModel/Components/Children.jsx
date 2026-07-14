import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";


/**
 * Wraps child components and automatically injects the current finance entity
 * into all descendants.
 *
 * This helper component eliminates the need to manually pass the same
 * `item` property to every nested component. All additional properties are
 * forwarded to `ChildWrapper`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity that will be propagated to all child components.
 *
 * @param {React.ReactNode} props.children
 * Child components rendered inside the wrapper.
 *
 * @param {...Object} props
 * Additional properties forwarded to `ChildWrapper`.
 *
 * @returns {JSX.Element}
 * Wrapper providing the current finance entity to all nested components.
 *
 * @example
 * <Children item={finance}>
 *     <MediumContent />
 *     <InteractiveMutations />
 * </Children>
 */
export const Children = ({
    item,
    children,
    ...props
}) => (
    <ChildWrapper
        item={item}
        {...props}
    >
        {children}
    </ChildWrapper>
);