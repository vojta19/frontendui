import { PersonFill } from "react-bootstrap-icons"
import { DigitalSubmissionFieldLink } from "./DigitalSubmissionFieldLink"
import { DigitalSubmissionFieldCardCapsule } from "./DigitalSubmissionFieldCardCapsule"
import { DigitalSubmissionFieldMediumContent } from "./DigitalSubmissionFieldMediumContent"

/**
 * A card component that displays detailed content for an digitalsubmissionfield entity.
 *
 * This component combines `DigitalSubmissionFieldCardCapsule` and `DigitalSubmissionFieldMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the digitalsubmissionfield entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionFieldMediumCard component.
 * @param {Object} props.digitalsubmissionfield - The object representing the digitalsubmissionfield entity.
 * @param {string|number} props.digitalsubmissionfield.id - The unique identifier for the digitalsubmissionfield entity.
 * @param {string} props.digitalsubmissionfield.name - The name or label of the digitalsubmissionfield entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionfieldEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionFieldMediumCard digitalsubmissionfield={digitalsubmissionfieldEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </DigitalSubmissionFieldMediumCard>
 */
export const DigitalSubmissionFieldMediumCard = ({digitalsubmissionfield, children}) => {
    return (
        <DigitalSubmissionFieldCardCapsule title={<><PersonFill /> <DigitalSubmissionFieldLink digitalsubmissionfield={digitalsubmissionfield} /></>}>
            <DigitalSubmissionFieldMediumContent digitalsubmissionfield={digitalsubmissionfield}>
                {children}
            </DigitalSubmissionFieldMediumContent>
        </DigitalSubmissionFieldCardCapsule>
    )
}
