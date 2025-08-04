import { PersonFill } from "react-bootstrap-icons"
import { DigitalFormSectionLink } from "./DigitalFormSectionLink"
import { DigitalFormSectionCardCapsule } from "./DigitalFormSectionCardCapsule"
import { DigitalFormSectionMediumContent } from "./DigitalFormSectionMediumContent"

/**
 * A card component that displays detailed content for an digitalformsection entity.
 *
 * This component combines `DigitalFormSectionCardCapsule` and `DigitalFormSectionMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the digitalformsection entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormSectionMediumCard component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the digitalformsection entity.
 * @param {string} props.digitalformsection.name - The name or label of the digitalformsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormSectionMediumCard digitalformsection={digitalformsectionEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </DigitalFormSectionMediumCard>
 */
export const DigitalFormSectionMediumCard = ({digitalformsection, children}) => {
    return (
        <DigitalFormSectionCardCapsule title={<><PersonFill /> <DigitalFormSectionLink digitalformsection={digitalformsection} /></>}>
            <DigitalFormSectionMediumContent digitalformsection={digitalformsection}>
                {children}
            </DigitalFormSectionMediumContent>
        </DigitalFormSectionCardCapsule>
    )
}
