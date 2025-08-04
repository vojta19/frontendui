import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { DigitalFormFieldLink } from "./DigitalFormFieldLink"

/**
 * A specialized card component that displays an `DigitalFormFieldLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `DigitalFormFieldLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `digitalformfield` object.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormFieldCardCapsule component.
 * @param {Object} props.digitalformfield - The object representing the digitalformfield entity.
 * @param {string|number} props.digitalformfield.id - The unique identifier for the digitalformfield entity.
 * @param {string} props.digitalformfield.name - The display name for the digitalformfield entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { DigitalFormFieldCardCapsule } from './DigitalFormFieldCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const digitalformfieldEntity = { id: 123, name: "Example Entity" };
 *
 * <DigitalFormFieldCardCapsule digitalformfield={digitalformfieldEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </DigitalFormFieldCardCapsule>
 */
export const DigitalFormFieldCardCapsule = ({digitalformfield, children, title=<><PersonFill /> <DigitalFormFieldLink digitalformfield={digitalformfield} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
