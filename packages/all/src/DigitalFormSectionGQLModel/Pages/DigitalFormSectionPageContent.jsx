import { DigitalFormSectionLargeCard } from "../Components"
import { DigitalFormSectionPageNavbar } from "./DigitalFormSectionPageNavbar"

/**
 * Renders a page layout for a single digitalformsection entity, including navigation and detailed view.
 *
 * This component wraps `DigitalFormSectionPageNavbar` and `DigitalFormSectionLargeCard` to provide a consistent
 * interface for displaying an individual digitalformsection. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.digitalformsection - The digitalformsection entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a digitalformsection.
 *
 * @example
 * const digitalformsection = { id: 1, name: "Example DigitalFormSection" };
 * <DigitalFormSectionPageContent digitalformsection={digitalformsection}>
 *   <p>Additional info here.</p>
 * </DigitalFormSectionPageContent>
 */
export const DigitalFormSectionPageContent = ({digitalformsection, children, ...props}) => {
    return (<>
        <DigitalFormSectionPageNavbar digitalformsection={digitalformsection} />
        <DigitalFormSectionLargeCard digitalformsection={digitalformsection} {...props} >
            DigitalFormSection {JSON.stringify(digitalformsection)}
            {children}
        </DigitalFormSectionLargeCard>
    </>)
}