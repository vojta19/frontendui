import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { DigitalFormSectionLink } from "./DigitalFormSectionLink"

/**
 * A specialized card component that displays an `DigitalFormSectionLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `DigitalFormSectionLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `digitalformsection` object.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionCardCapsule component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the digitalformsection entity.
 * @param {string} props.digitalformsection.name - The display name for the digitalformsection entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { DigitalFormSectionCardCapsule } from './DigitalFormSectionCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const digitalformsectionEntity = { id: 123, name: "Example Entity" };
 *
 * <DigitalFormSectionCardCapsule digitalformsection={digitalformsectionEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </DigitalFormSectionCardCapsule>
 */
export const DigitalFormSectionCardCapsule = ({digitalformsection, children, title=<><PersonFill /> <DigitalFormSectionLink digitalformsection={digitalformsection} /></>, ...props}) => {
    return (
        <CardCapsule title={title} { ...props}>
            {children}
        </CardCapsule>
    )
}
