import { PersonFill } from "react-bootstrap-icons"
import { DigitalSubmissionLink } from "./DigitalSubmissionLink"
import { DigitalSubmissionCardCapsule } from "./DigitalSubmissionCardCapsule"
import { DigitalSubmissionMediumContent } from "./DigitalSubmissionMediumContent"

/**
 * A card component that displays detailed content for an digitalsubmission entity.
 *
 * This component combines `DigitalSubmissionCardCapsule` and `DigitalSubmissionMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the digitalsubmission entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionMediumCard component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {string|number} props.digitalsubmission.id - The unique identifier for the digitalsubmission entity.
 * @param {string} props.digitalsubmission.name - The name or label of the digitalsubmission entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionMediumCard digitalsubmission={digitalsubmissionEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </DigitalSubmissionMediumCard>
 */
export const DigitalSubmissionMediumCard = ({digitalsubmission, children}) => {
    return (
        <DigitalSubmissionCardCapsule title={<><PersonFill /> <DigitalSubmissionLink digitalsubmission={digitalsubmission} /></>}>
            <DigitalSubmissionMediumContent digitalsubmission={digitalsubmission}>
                {children}
            </DigitalSubmissionMediumContent>
        </DigitalSubmissionCardCapsule>
    )
}
