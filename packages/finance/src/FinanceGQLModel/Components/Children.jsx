// Import komponenty ChildWrapper ze sdílené knihovny.
// Tato komponenta zajišťuje předání společných vlastností všem vnořeným komponentám.
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
    // Aktuální finanční entita, která bude zpřístupněna všem potomkům.
    item,

    // Komponenty vložené mezi otevírací a uzavírací značku <Children>.
    children,

    // Zachytí všechny ostatní vlastnosti a přepošle je do ChildWrapper.
    ...props
}) => (
    // ChildWrapper zajistí předání objektu item všem vnořeným komponentám,
    // takže jej není nutné ručně předávat přes několik úrovní komponent.
    <ChildWrapper
        item={item}
        {...props}
    >
        {/* Vykreslení všech potomků obalených tímto wrapperem */}
        {children}
    </ChildWrapper>
);