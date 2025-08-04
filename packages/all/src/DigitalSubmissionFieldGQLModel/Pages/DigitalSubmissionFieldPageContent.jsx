import { DigitalSubmissionFieldLargeCard } from "../Components"
import { DigitalSubmissionFieldPageNavbar } from "./DigitalSubmissionFieldPageNavbar"

/**
 * Renders a page layout for a single digitalsubmissionfield entity, including navigation and detailed view.
 *
 * This component wraps `DigitalSubmissionFieldPageNavbar` and `DigitalSubmissionFieldLargeCard` to provide a consistent
 * interface for displaying an individual digitalsubmissionfield. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.digitalsubmissionfield - The digitalsubmissionfield entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a digitalsubmissionfield.
 *
 * @example
 * const digitalsubmissionfield = { id: 1, name: "Example DigitalSubmissionField" };
 * <DigitalSubmissionFieldPageContent digitalsubmissionfield={digitalsubmissionfield}>
 *   <p>Additional info here.</p>
 * </DigitalSubmissionFieldPageContent>
 */
export const DigitalSubmissionFieldPageContent = ({digitalsubmissionfield, children, ...props}) => {
    return (<>
        <DigitalSubmissionFieldPageNavbar digitalsubmissionfield={digitalsubmissionfield} />
        <DigitalSubmissionFieldLargeCard digitalsubmissionfield={digitalsubmissionfield} {...props} >
            DigitalSubmissionField {JSON.stringify(digitalsubmissionfield)}
            {children}
        </DigitalSubmissionFieldLargeCard>
    </>)
}