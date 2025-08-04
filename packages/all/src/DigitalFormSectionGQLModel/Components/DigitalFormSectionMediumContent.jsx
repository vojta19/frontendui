import { Col, Row } from "react-bootstrap"
/**
 * A component that displays medium-level content for an digitalformsection entity.
 *
 * This component renders a label "DigitalFormSectionMediumContent" followed by a serialized representation of the `digitalformsection` object
 * and any additional child content. It is designed to handle and display information about an digitalformsection entity object.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormSectionMediumContent component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the digitalformsection entity.
 * @param {string} props.digitalformsection.name - The name or label of the digitalformsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `digitalformsection` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormSectionMediumContent digitalformsection={digitalformsectionEntity}>
 *   <p>Additional information about the entity.</p>
 * </DigitalFormSectionMediumContent>
 */
export const DigitalFormSectionMediumContent = ({digitalformsection, children}) => {
    return (
        <>
            <Row>
                <Col>JSON</Col>
                <Col><pre>{JSON.stringify(digitalformsection, null, 2)}</pre></Col>
            </Row>
            {children}
        </>
    )
}
