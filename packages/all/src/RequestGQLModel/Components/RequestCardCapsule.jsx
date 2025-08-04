import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { RequestLink } from "./RequestLink"

/**
 * A specialized card component that displays an `RequestLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `RequestLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `request` object.
 *
 * @component
 * @param {Object} props - The props for the RequestCardCapsule component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The display name for the request entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { RequestCardCapsule } from './RequestCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const requestEntity = { id: 123, name: "Example Entity" };
 *
 * <RequestCardCapsule request={requestEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </RequestCardCapsule>
 */
export const RequestCardCapsule = ({request, children, title=<><PersonFill /> <RequestLink request={request} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
