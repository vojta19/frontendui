// Importuje komponentu Input pro tvorbu formulářových polí ze sdílené šablony prvků
import { Input } from "../../../../_template/src/Base/FormControls/Input";

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
 * * <TemplateMediumContent template={templateEntity}>
 * <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */
// Definuje a exportuje editační komponentu MediumEditableContent s výchozími prázdnými funkcemi pro eventy
export const MediumEditableContent = ({ item, onChange = (e) => null, onBlur = (e) => null, children }) => {
    
    // Vrací JSX fragment seskupující editační formulářová pole
    return (
        <>           
            {/* PŮVODNÍ POZNÁMKA: defaultValue={item?.name|| "Název"}  */}
            
            {/* Vstupní pole pro editaci českého názvu (Jméno) s provázáním na ID, handlery a fallback hodnotu */}
            <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name ?? ""} placeholder={"Název"} onChange={onChange} onBlur={onBlur} />
            
            {/* Vstupní pole pro editaci anglického názvu (EN název) s provázáním na ID, handlery a fallback hodnotu */}
            <Input id={"nameEn"} label={"EN název"} className="form-control" value={item?.nameEn ?? ""} placeholder={"English name"} onChange={onChange} onBlur={onBlur} />
            
            {/* Vstupní pole pro editaci textového popisu (Popis) s provázáním na ID, handlery a fallback hodnotu */}
            <Input id={"description"} label={"Popis"} className="form-control" value={item?.description ?? ""} placeholder={"Popis"} onChange={onChange} onBlur={onBlur} />

            {/* Vykresluje jakékoliv dodatečné vnořené komponenty nebo elementy předané jako children */}
            {children}
        </>
    ); // Konec návratové hodnoty JSX fragmentu
}; // Konec definice komponenty MediumEditableContent