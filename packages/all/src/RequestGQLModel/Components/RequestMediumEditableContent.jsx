import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an request entity.
 *
 * This component renders a label "RequestMediumContent" followed by a serialized representation of the `request` object
 * and any additional child content. It is designed to handle and display information about an request entity object.
 *
 * @component
 * @param {Object} props - The properties for the RequestMediumContent component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `request` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestMediumContent request={requestEntity}>
 *   <p>Additional information about the entity.</p>
 * </RequestMediumContent>
 */
export const RequestMediumEditableContent = ({request, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={request?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={request?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
