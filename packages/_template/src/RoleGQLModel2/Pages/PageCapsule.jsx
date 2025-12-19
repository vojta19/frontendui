import { useParams } from "react-router"
import { AsyncActionProvider } from "../../Base/Helpers/GQLEntityProvider"
import { ReadAsyncAction } from "../Queries"

export const PageCapsule = ({ children, queryAsyncAction=ReadAsyncAction }) => {
    const {id} = useParams()
    const item = {id}
    return (
        <AsyncActionProvider item={item} queryAsyncAction={queryAsyncAction}>
            {children}
        </AsyncActionProvider>
    )
}
