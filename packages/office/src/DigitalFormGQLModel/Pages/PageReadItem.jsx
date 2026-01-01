import { GeneratedContentBase } from "../../../../_template/src/Base/Pages/Page"
import { FormSections } from "../Vectors/FormSections"
import { PageItemBase } from "./PageBase"



export const PageReadItem = ({ 
    SubPage=FormSections,
    ...props
}) => {
    return (
        <PageItemBase SubPage={SubPage} {...props}/>
    )
}