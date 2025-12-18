import { useParams } from "react-router"

import { AsyncActionProvider } from "../../Template/Utils/GQLEntityProvider"
import { ReadAsyncAction, ReadQuery } from "../Queries/ReadAsyncAction"
import { PageContent } from "./PageContent"



export const Page = ({ children }) => {
    const {id} = useParams()
    // const id = "51d101a0-81f1-44ca-8366-6cf51432e8d6";
    const item = {id}
    // console.log("GroupGQLModel/Page rendering with item:", ReadAsyncAction?.__metadata?.queryStr);
    // console.log("GroupGQLModel/Page rendering with item:", ReadQuery());
    return (
        <>
        <AsyncActionProvider queryAsyncAction={ReadAsyncAction} item={item}>
            
            <PageContent>
                {children}
            </PageContent>
        </AsyncActionProvider>
        </>
    )
}