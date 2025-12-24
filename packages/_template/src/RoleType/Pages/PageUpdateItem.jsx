import { LargeCard, LinkURI } from "../Components"
import { ReadAsyncAction } from "../Queries"
import { PageItemBase } from "./PageBase"
import { UpdateBody } from "../Mutations/Update"
import { useGQLEntityContext } from "../../Base/Helpers/GQLEntityProvider"
import { UpdateBody2 } from "../Mutations/Update2"

export const UpdateItemURI = `${LinkURI.replace('view', 'edit')}:id`

export const PageUpdateItem = ({ children, queryAsyncAction=ReadAsyncAction, ...props }) => {
    return (
        <PageItemBase queryAsyncAction={queryAsyncAction}>
            PageUpdateItem
            <LargeCardFromContext {...props}/>
        </PageItemBase>
    )
}

const LargeCardFromContext = ({...props}) => {
    const { item } = useGQLEntityContext()
    return (
        <LargeCard item={item}>
            <UpdateBody2 {...props} />
        </LargeCard>
    )
}