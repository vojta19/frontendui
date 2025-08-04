import { DigitalSubmissionSectionLargeCard } from "../Components"
import { DigitalSubmissionSectionPageNavbar } from "./DigitalSubmissionSectionPageNavbar"

/**
 * Renders a page layout for a single digitalsubmissionsection entity, including navigation and detailed view.
 *
 * This component wraps `DigitalSubmissionSectionPageNavbar` and `DigitalSubmissionSectionLargeCard` to provide a consistent
 * interface for displaying an individual digitalsubmissionsection. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.digitalsubmissionsection - The digitalsubmissionsection entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a digitalsubmissionsection.
 *
 * @example
 * const digitalsubmissionsection = { id: 1, name: "Example DigitalSubmissionSection" };
 * <DigitalSubmissionSectionPageContent digitalsubmissionsection={digitalsubmissionsection}>
 *   <p>Additional info here.</p>
 * </DigitalSubmissionSectionPageContent>
 */
export const DigitalSubmissionSectionPageContent = ({digitalsubmissionsection, children, ...props}) => {
    return (<>
        <DigitalSubmissionSectionPageNavbar digitalsubmissionsection={digitalsubmissionsection} />
        <DigitalSubmissionSectionLargeCard digitalsubmissionsection={digitalsubmissionsection} {...props} >
            DigitalSubmissionSection {JSON.stringify(digitalsubmissionsection)}
            {children}
        </DigitalSubmissionSectionLargeCard>
    </>)
}