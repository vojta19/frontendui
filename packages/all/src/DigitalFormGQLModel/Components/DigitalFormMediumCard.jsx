import { PersonFill } from "react-bootstrap-icons"
import { DigitalFormLink } from "./DigitalFormLink"
import { DigitalFormCardCapsule } from "./DigitalFormCardCapsule"
import { DigitalFormMediumContent } from "./DigitalFormMediumContent"

/**
 * A card component that displays detailed content for an digitalform entity.
 *
 * This component combines `DigitalFormCardCapsule` and `DigitalFormMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the digitalform entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormMediumCard component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform entity.
 * @param {string} props.digitalform.name - The name or label of the digitalform entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormMediumCard digitalform={digitalformEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </DigitalFormMediumCard>
 */
export const DigitalFormMediumCard = ({digitalform, children}) => {
    return (
        <DigitalFormCardCapsule title={<><PersonFill /> <DigitalFormLink digitalform={digitalform} /></>}>
            <DigitalFormMediumContent digitalform={digitalform}>
                {children}
            </DigitalFormMediumContent>
        </DigitalFormCardCapsule>
    )
}
