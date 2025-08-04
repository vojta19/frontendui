import { Col, Row } from "react-bootstrap"
/**
 * A component that displays medium-level content for an digitalsubmissionsection entity.
 *
 * This component renders a label "DigitalSubmissionSectionMediumContent" followed by a serialized representation of the `digitalsubmissionsection` object
 * and any additional child content. It is designed to handle and display information about an digitalsubmissionsection entity object.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionSectionMediumContent component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {string|number} props.digitalsubmissionsection.id - The unique identifier for the digitalsubmissionsection entity.
 * @param {string} props.digitalsubmissionsection.name - The name or label of the digitalsubmissionsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `digitalsubmissionsection` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionSectionMediumContent digitalsubmissionsection={digitalsubmissionsectionEntity}>
 *   <p>Additional information about the entity.</p>
 * </DigitalSubmissionSectionMediumContent>
 */
export const DigitalSubmissionSectionMediumContent = ({digitalsubmissionsection, children}) => {
    return (
        <>
            <Row>
                <Col>JSON</Col>
                <Col><pre>{JSON.stringify(digitalsubmissionsection, null, 2)}</pre></Col>
            </Row>
            {children}
        </>
    )
}
