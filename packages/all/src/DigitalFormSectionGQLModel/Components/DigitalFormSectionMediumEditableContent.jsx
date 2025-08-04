import { Input, Label, Select } from "@hrbolek/uoisfrontend-shared"

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
export const DigitalFormSectionMediumEditableContent = ({digitalformsection, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={digitalformsection?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"label"} label={"Titulek"} className="form-control" defaultValue={digitalformsection?.label|| "Titulek"} onChange={onChange} onBlur={onBlur} />
            <Input id={"labelEn"} label={"Anglický titulek"} className="form-control" defaultValue={digitalformsection?.label_en|| "Title"} onChange={onChange} onBlur={onBlur} />
            <Input id={"description"} label={"Popis"} className="form-control" defaultValue={digitalformsection?.description|| "Popis"} onChange={onChange} onBlur={onBlur} />
            <Input id={"order"} type="number" label={"Pořadí"} className="form-control" defaultValue={digitalformsection?.order|| 1} onChange={onChange} onBlur={onBlur} />
            <Select id={"repeatable"} label={"Povolit opakování"} className="form-control" defaultValue={digitalformsection?.repeatable ?? false} onChange={onChange} onBlur={onBlur} >
                <option value={false}>Ne</option>
                <option value={true}>Ano</option>
            </Select>
            {digitalformsection?.repeatable && (<>
                <Input id={"repeatableMin"} type="number" label={"Minimální počet opakování"} className="form-control" defaultValue={digitalformsection?.repeatableMin|| 1} onChange={onChange} onBlur={onBlur} />
                <Input id={"repeatableMax"} type="number" label={"Maximální počet opakování"} className="form-control" defaultValue={digitalformsection?.repeatableMax|| 1} onChange={onChange} onBlur={onBlur} />
            </>)}
            
            {children}
        </>
    )
}
