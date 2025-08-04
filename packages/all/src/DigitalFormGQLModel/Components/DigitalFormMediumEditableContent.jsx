import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an digitalform entity.
 *
 * This component renders a label "DigitalFormMediumContent" followed by a serialized representation of the `digitalform` object
 * and any additional child content. It is designed to handle and display information about an digitalform entity object.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormMediumContent component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform entity.
 * @param {string} props.digitalform.name - The name or label of the digitalform entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `digitalform` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormMediumContent digitalform={digitalformEntity}>
 *   <p>Additional information about the entity.</p>
 * </DigitalFormMediumContent>
 */
export const DigitalFormMediumEditableContent = ({digitalform, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={digitalform?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={digitalform?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
