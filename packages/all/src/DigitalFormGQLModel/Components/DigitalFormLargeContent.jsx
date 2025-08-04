import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormCardCapsule } from "./DigitalFormCardCapsule"
import { DigitalFormMediumCard } from "./DigitalFormMediumCard"
import { DigitalFormFields, DigitalFormSectionLargeContent, DigitalFormSections } from "../../DigitalFormSectionGQLModel/Components/DigitalFormSectionLargeContent"
import { useState } from "react"
import { DigitalFormSectionButton } from "../../DigitalFormSectionGQLModel/Components/DigitalFormSectionCUDButton"
import { PlusLg } from "react-bootstrap-icons"

/**
 * A large card component for displaying detailed content and layout for an digitalform entity.
 *
 * This component wraps an `DigitalFormCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalFormMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormLargeCard component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform entity.
 * @param {string} props.digitalform.name - The name or label of the digitalform entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormLargeCard digitalform={digitalformEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalFormLargeCard>
 */
export const DigitalFormLargeContent = ({digitalform, children}) => {
    const {fields=[], sections=[]} = digitalform
    const [activeSection, setActiveSection] = useState(sections?.[0])
    const onSectionSelect = (section) => () => setActiveSection(section)
    const onInsert = (freshDigitalFormSection) => {
        console.log("inserted", freshDigitalFormSection)
    }
    return (
        <> 
        {/* DigitalFormLargeContent<br /> */}
            {sections.map(
                section => <button key={section?.id} className="btn btn-sm btn-outline-success" onClick={onSectionSelect(section)}>{section?.name ?? "Nepojmenovaná sekce"}</button>
            )}
            <br />
            {/* <DigitalFormFields digitalformfields={fields} /> */}
            <DigitalFormSections digitalformsections={sections} />
            <DigitalFormSectionButton
                operation="C" 
                className="btn btn-sm btn-outline-success form-control"
                onDone={onInsert}
                digitalformsection={{
                    formId: digitalform.id,
                    id: crypto.randomUUID(),
                    name: "section",
                    label: "Nová sekce fomuláře",
                    labelEn: "New section",
                    description: "Popis / nápověda",
                    order: sections.lenght + 1,
                    repeatable: false,
                    repeatableMin: 1,
                    repeatableMax: 1
                }}
            >
                <PlusLg  /> Přidat sekci do formuláře
            </DigitalFormSectionButton>
            
            {/* <pre>{JSON.stringify(digitalform, null, 4)}</pre> */}
        </>
    )
}
