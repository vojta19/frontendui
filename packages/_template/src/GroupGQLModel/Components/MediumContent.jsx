import { Col } from "../../Base/Helpers/Col"
import { Row } from "../../Base/Helpers/Row"
// import { Roles } from "../Vectors/Roles"

export const Attribute = ({ item, label, attribute_name, attribute_value  }) => {
    const _attribute_value = attribute_value!=null ? attribute_value : item?.[attribute_name]
    return (
        <Row>
            {label&&<Col className="col-4"><b>{label}</b></Col>}
            <Col className="col-8">{_attribute_value}</Col>
        </Row>
    )
}

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateMediumContent template={templateEntity}>
 *   <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */
export const MediumContent = ({ item, children}) => {
    return (
        <div>
            <Attribute attribute_name="id" label="ID" item={item} />
            <Attribute attribute_name="name" label="Jméno" item={item} />
            <hr />
            {/* <Roles item={item} /> */}
            {children}
        </div>
        
    )
}

