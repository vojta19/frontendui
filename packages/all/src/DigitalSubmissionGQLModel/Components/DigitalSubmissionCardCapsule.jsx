import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { DigitalSubmissionLink } from "./DigitalSubmissionLink"

/**
 * A specialized card component that displays an `DigitalSubmissionLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `DigitalSubmissionLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `digitalsubmission` object.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionCardCapsule component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {string|number} props.digitalsubmission.id - The unique identifier for the digitalsubmission entity.
 * @param {string} props.digitalsubmission.name - The display name for the digitalsubmission entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { DigitalSubmissionCardCapsule } from './DigitalSubmissionCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const digitalsubmissionEntity = { id: 123, name: "Example Entity" };
 *
 * <DigitalSubmissionCardCapsule digitalsubmission={digitalsubmissionEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </DigitalSubmissionCardCapsule>
 */
export const DigitalSubmissionCardCapsule = ({digitalsubmission, children, title=<><PersonFill /> <DigitalSubmissionLink digitalsubmission={digitalsubmission} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
