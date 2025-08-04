import { Col, Row } from "react-bootstrap";
import { DigitalSubmissionFieldLiveEdit } from "../Components/DigitalSubmissionFieldLiveEdit";
import { DigitalSubmissionFieldMediumEditableContent } from "../Components/DigitalSubmissionFieldMediumEditableContent";

export const DigitalSubmissionSectionFields = ({ fields }) => {
    const sorted = fields.toSorted((a, b) => {
        const aOrder = a?.field?.order ?? 0;
        const bOrder = b?.field?.order ?? 0;
        return aOrder - bOrder;
    })
    return ( 
        <>
        {/* <pre>Sorted{JSON.stringify(sorted, null, 2)}</pre> */}
        {sorted.map(field => <DigitalSubmissionFieldMediumEditableContent key={field?.id} digitalsubmissionfield={field} />
        )}
        </>
    )
}