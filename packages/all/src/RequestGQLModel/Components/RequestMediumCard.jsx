import { PersonFill } from "react-bootstrap-icons"
import { RequestLink } from "./RequestLink"
import { RequestCardCapsule } from "./RequestCardCapsule"
import { RequestMediumContent } from "./RequestMediumContent"

/**
 * A card component that displays detailed content for an request entity.
 *
 * This component combines `RequestCardCapsule` and `RequestMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the request entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the RequestMediumCard component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestMediumCard request={requestEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </RequestMediumCard>
 */
export const RequestMediumCard = ({request, children}) => {
    return (
        <RequestCardCapsule title={<><PersonFill /> <RequestLink request={request} /></>}>
            <RequestMediumContent request={request}>
                {children}
            </RequestMediumContent>
        </RequestCardCapsule>
    )
}
