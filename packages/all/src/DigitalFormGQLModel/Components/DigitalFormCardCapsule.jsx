import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { DigitalFormLink } from "./DigitalFormLink"

/**
 * A specialized card component that displays an `DigitalFormLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `DigitalFormLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `digitalform` object.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormCardCapsule component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform entity.
 * @param {string} props.digitalform.name - The display name for the digitalform entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { DigitalFormCardCapsule } from './DigitalFormCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const digitalformEntity = { id: 123, name: "Example Entity" };
 *
 * <DigitalFormCardCapsule digitalform={digitalformEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </DigitalFormCardCapsule>
 */
export const DigitalFormCardCapsule = ({digitalform, children, title=<><PersonFill /> <DigitalFormLink digitalform={digitalform} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
