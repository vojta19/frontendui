import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { DigitalSubmissionSectionLink } from "./DigitalSubmissionSectionLink"

/**
 * A specialized card component that displays an `DigitalSubmissionSectionLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `DigitalSubmissionSectionLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `digitalsubmissionsection` object.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSectionCardCapsule component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {string|number} props.digitalsubmissionsection.id - The unique identifier for the digitalsubmissionsection entity.
 * @param {string} props.digitalsubmissionsection.name - The display name for the digitalsubmissionsection entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { DigitalSubmissionSectionCardCapsule } from './DigitalSubmissionSectionCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const digitalsubmissionsectionEntity = { id: 123, name: "Example Entity" };
 *
 * <DigitalSubmissionSectionCardCapsule digitalsubmissionsection={digitalsubmissionsectionEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </DigitalSubmissionSectionCardCapsule>
 */
export const DigitalSubmissionSectionCardCapsule = ({digitalsubmissionsection, children, title=<><PersonFill /> <DigitalSubmissionSectionLink digitalsubmissionsection={digitalsubmissionsection} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
