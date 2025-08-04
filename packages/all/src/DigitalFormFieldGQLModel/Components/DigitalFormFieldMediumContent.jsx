import { Col, Row } from "react-bootstrap"
/**
 * A component that displays medium-level content for an digitalformfield entity.
 *
 * This component renders a label "DigitalFormFieldMediumContent" followed by a serialized representation of the `digitalformfield` object
 * and any additional child content. It is designed to handle and display information about an digitalformfield entity object.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormFieldMediumContent component.
 * @param {Object} props.digitalformfield - The object representing the digitalformfield entity.
 * @param {string|number} props.digitalformfield.id - The unique identifier for the digitalformfield entity.
 * @param {string} props.digitalformfield.name - The name or label of the digitalformfield entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `digitalformfield` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const digitalformfieldEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormFieldMediumContent digitalformfield={digitalformfieldEntity}>
 *   <p>Additional information about the entity.</p>
 * </DigitalFormFieldMediumContent>
 */
export const DigitalFormFieldMediumContent = ({digitalformfield, children}) => {
    return (
        <>
            <Row>
                <Col>JSON</Col>
                <Col><pre>{JSON.stringify(digitalformfield, null, 2)}</pre></Col>
            </Row>
            {children}
        </>
    )
}
