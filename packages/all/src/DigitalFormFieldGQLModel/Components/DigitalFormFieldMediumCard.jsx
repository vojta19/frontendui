import { PersonFill } from "react-bootstrap-icons"
import { DigitalFormFieldLink } from "./DigitalFormFieldLink"
import { DigitalFormFieldCardCapsule } from "./DigitalFormFieldCardCapsule"
import { DigitalFormFieldMediumContent } from "./DigitalFormFieldMediumContent"

/**
 * A card component that displays detailed content for an digitalformfield entity.
 *
 * This component combines `DigitalFormFieldCardCapsule` and `DigitalFormFieldMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the digitalformfield entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormFieldMediumCard component.
 * @param {Object} props.digitalformfield - The object representing the digitalformfield entity.
 * @param {string|number} props.digitalformfield.id - The unique identifier for the digitalformfield entity.
 * @param {string} props.digitalformfield.name - The name or label of the digitalformfield entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const digitalformfieldEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormFieldMediumCard digitalformfield={digitalformfieldEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </DigitalFormFieldMediumCard>
 */
export const DigitalFormFieldMediumCard = ({digitalformfield, children}) => {
    return (
        <DigitalFormFieldCardCapsule title={<><PersonFill /> <DigitalFormFieldLink digitalformfield={digitalformfield} /></>}>
            <DigitalFormFieldMediumContent digitalformfield={digitalformfield}>
                {children}
            </DigitalFormFieldMediumContent>
        </DigitalFormFieldCardCapsule>
    )
}
