import { Input } from "@hrbolek/uoisfrontend-shared"

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
export const DigitalSubmissionSectionMediumEditableContent = ({digitalsubmissionsection, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={digitalsubmissionsection?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={digitalsubmissionsection?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
