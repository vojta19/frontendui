import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { RequestTypeLink } from "./RequestTypeLink"

/**
 * A specialized card component that displays an `RequestTypeLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `RequestTypeLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `requesttype` object.
 *
 * @component
 * @param {Object} props - The props for the RequestTypeCardCapsule component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {string|number} props.requesttype.id - The unique identifier for the requesttype entity.
 * @param {string} props.requesttype.name - The display name for the requesttype entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { RequestTypeCardCapsule } from './RequestTypeCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const requesttypeEntity = { id: 123, name: "Example Entity" };
 *
 * <RequestTypeCardCapsule requesttype={requesttypeEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </RequestTypeCardCapsule>
 */
export const RequestTypeCardCapsule = ({requesttype, children, title=<><PersonFill /> <RequestTypeLink requesttype={requesttype} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
