import { MediumCard as SectionMediumCard } from "../../DigitalFormSectionGQLModel/Components/MediumCard"

export const FormSections = ({ item }) => {
    const { sections=[] } = item || {}
    return (<>
        {sections.map(section => <SectionMediumCard key={item?.id} item={section} />)}
        <pre>{JSON.stringify(item, null, 2)}</pre>
    </>)
}