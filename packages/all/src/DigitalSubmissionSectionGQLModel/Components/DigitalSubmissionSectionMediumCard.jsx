import { PersonFill } from "react-bootstrap-icons"
import { DigitalSubmissionSectionLink } from "./DigitalSubmissionSectionLink"
import { DigitalSubmissionSectionCardCapsule } from "./DigitalSubmissionSectionCardCapsule"
import { DigitalSubmissionSectionMediumContent } from "./DigitalSubmissionSectionMediumContent"

/**
 * A card component that displays detailed content for an digitalsubmissionsection entity.
 *
 * This component combines `DigitalSubmissionSectionCardCapsule` and `DigitalSubmissionSectionMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the digitalsubmissionsection entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionSectionMediumCard component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {string|number} props.digitalsubmissionsection.id - The unique identifier for the digitalsubmissionsection entity.
 * @param {string} props.digitalsubmissionsection.name - The name or label of the digitalsubmissionsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionSectionMediumCard digitalsubmissionsection={digitalsubmissionsectionEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </DigitalSubmissionSectionMediumCard>
 */
export const DigitalSubmissionSectionMediumCard = ({digitalsubmissionsection, children}) => {
    return (
        <DigitalSubmissionSectionCardCapsule title={<><PersonFill /> <DigitalSubmissionSectionLink digitalsubmissionsection={digitalsubmissionsection} /></>}>
            <DigitalSubmissionSectionMediumContent digitalsubmissionsection={digitalsubmissionsection}>
                {children}
            </DigitalSubmissionSectionMediumContent>
        </DigitalSubmissionSectionCardCapsule>
    )
}
