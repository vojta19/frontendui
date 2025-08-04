import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { DigitalSubmissionFieldLink } from "./DigitalSubmissionFieldLink"

/**
 * A specialized card component that displays an `DigitalSubmissionFieldLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `DigitalSubmissionFieldLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `digitalsubmissionfield` object.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionFieldCardCapsule component.
 * @param {Object} props.digitalsubmissionfield - The object representing the digitalsubmissionfield entity.
 * @param {string|number} props.digitalsubmissionfield.id - The unique identifier for the digitalsubmissionfield entity.
 * @param {string} props.digitalsubmissionfield.name - The display name for the digitalsubmissionfield entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { DigitalSubmissionFieldCardCapsule } from './DigitalSubmissionFieldCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const digitalsubmissionfieldEntity = { id: 123, name: "Example Entity" };
 *
 * <DigitalSubmissionFieldCardCapsule digitalsubmissionfield={digitalsubmissionfieldEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </DigitalSubmissionFieldCardCapsule>
 */
export const DigitalSubmissionFieldCardCapsule = ({digitalsubmissionfield, children, title=<><PersonFill /> <DigitalSubmissionFieldLink digitalsubmissionfield={digitalsubmissionfield} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
