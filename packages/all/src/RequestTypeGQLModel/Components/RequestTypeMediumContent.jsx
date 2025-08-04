import { Col, Row } from "react-bootstrap"
/**
 * A component that displays medium-level content for an requesttype entity.
 *
 * This component renders a label "RequestTypeMediumContent" followed by a serialized representation of the `requesttype` object
 * and any additional child content. It is designed to handle and display information about an requesttype entity object.
 *
 * @component
 * @param {Object} props - The properties for the RequestTypeMediumContent component.
 * @param {Object} props.requesttype - The object representing the requesttype entity.
 * @param {string|number} props.requesttype.id - The unique identifier for the requesttype entity.
 * @param {string} props.requesttype.name - The name or label of the requesttype entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `requesttype` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const requesttypeEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestTypeMediumContent requesttype={requesttypeEntity}>
 *   <p>Additional information about the entity.</p>
 * </RequestTypeMediumContent>
 */
export const RequestTypeMediumContent = ({requesttype, children}) => {
    return (
        <>
            <Row>
                <Col>JSON</Col>
                <Col><pre>{JSON.stringify(requesttype, null, 2)}</pre></Col>
            </Row>
            {children}
        </>
    )
}
