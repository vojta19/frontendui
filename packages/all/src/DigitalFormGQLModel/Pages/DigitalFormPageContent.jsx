import { DigitalFormLargeCard } from "../Components"
import { DigitalFormPageNavbar } from "./DigitalFormPageNavbar"

/**
 * Renders a page layout for a single digitalform entity, including navigation and detailed view.
 *
 * This component wraps `DigitalFormPageNavbar` and `DigitalFormLargeCard` to provide a consistent
 * interface for displaying an individual digitalform. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.digitalform - The digitalform entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a digitalform.
 *
 * @example
 * const digitalform = { id: 1, name: "Example DigitalForm" };
 * <DigitalFormPageContent digitalform={digitalform}>
 *   <p>Additional info here.</p>
 * </DigitalFormPageContent>
 */
export const DigitalFormPageContent = ({digitalform, children, ...props}) => {
    return (<>
        <DigitalFormPageNavbar digitalform={digitalform} />
        <DigitalFormLargeCard digitalform={digitalform} {...props} >
            {/* DigitalForm {JSON.stringify(digitalform)} */}
            {children}
        </DigitalFormLargeCard>
    </>)
}