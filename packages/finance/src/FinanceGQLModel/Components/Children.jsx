// Importuje pomocnou komponentu, která automaticky předává item všem potomkům.
import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";


/**
 * Wraps child components and automatically injects the current finance
 * entity into all descendants.
 *
 * This helper component eliminates the need to manually pass the same
 * `item` property to every nested component. All additional properties
 * are forwarded to `ChildWrapper`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity propagated to all child components.
 *
 * @param {*} props.children
 * Child components rendered inside the wrapper.
 *
 * @param {Object} [props]
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
    // Finance entita předávaná všem potomkům.
    item,

    // Vnořené komponenty.
    children,

    // Ostatní vlastnosti předané komponentě ChildWrapper.
    ...props
}) => (
    <ChildWrapper
        // Předá aktuální finance všem potomkům.
        item={item}

        // Předá ostatní vlastnosti beze změny.
        {...props}
    >
        {/* Vykreslí všechny vnořené komponenty. */}
        {children}
    </ChildWrapper>
);