import { MediumContent as MediumContent_ } from "../../../../_template/src/Base/Components/MediumContent"
import { Col } from "../../../../_template/src/Base/Components/Col"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { Link } from "./Link"
import { Attribute } from "../../../../_template/src/Base/Components/Attribute"
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
        <MediumContent_ item={item}>
            <Attribute item={item} attribute_name={"id"} label="id"/>
            <Attribute item={item} attribute_name={"name"} label="Název"/>
            <Attribute item={item} attribute_name={"nameEn"} label="Anglický název"/>
            <Attribute item={item} attribute_name={"description"} label="Popisek"/>
            <Attribute item={item} attribute_name={"lastchange"} label="Poslední změna"/>
            <Attribute item={item} attribute_name={"changedby"} label="Provedl">
                <Link item={item?.changedby} />
            </Attribute>
            
            {/* {children} */}
        </MediumContent_>
    )
}

