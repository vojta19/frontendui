import { DigitalSubmissionLargeCard } from "../Components"
import { DigitalSubmissionPageNavbar } from "./DigitalSubmissionPageNavbar"

/**
 * Renders a page layout for a single digitalsubmission entity, including navigation and detailed view.
 *
 * This component wraps `DigitalSubmissionPageNavbar` and `DigitalSubmissionLargeCard` to provide a consistent
 * interface for displaying an individual digitalsubmission. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.digitalsubmission - The digitalsubmission entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a digitalsubmission.
 *
 * @example
 * const digitalsubmission = { id: 1, name: "Example DigitalSubmission" };
 * <DigitalSubmissionPageContent digitalsubmission={digitalsubmission}>
 *   <p>Additional info here.</p>
 * </DigitalSubmissionPageContent>
 */
export const DigitalSubmissionPageContent = ({digitalsubmission, children, ...props}) => {
    return (<>
        <DigitalSubmissionPageNavbar digitalsubmission={digitalsubmission} />
        <DigitalSubmissionLargeCard digitalsubmission={digitalsubmission} {...props} >
            DigitalSubmission {JSON.stringify(digitalsubmission)}
            {children}
        </DigitalSubmissionLargeCard>
    </>)
}