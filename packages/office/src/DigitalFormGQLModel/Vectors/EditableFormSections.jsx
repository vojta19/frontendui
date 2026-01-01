import { MediumCard as SectionMediumCard } from "../../DigitalFormSectionGQLModel/Components/MediumCard"
import { LiveEdit as SectionLiveEdit } from "../../DigitalFormSectionGQLModel/Components/LiveEdit"
import { SimpleCardCapsule } from "../../../../_template/src/Base/Components"

export const EditableFormSections = ({ item }) => {
    const { sections=[] } = item || {}
    return (<>
            {sections.map(section => {
                return (<SimpleCardCapsule key={section?.id} title={section?.name}>
                    <SectionLiveEdit item={section} />
                </SimpleCardCapsule>)
            })}
    </>)
}