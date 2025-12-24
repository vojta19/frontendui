import { 
    UpdateBody as BaseUpdateBody, 
    UpdateButton as BaseUpdateButton, 
    UpdateDialog as BaseUpdateDialog, 
    UpdateLink as BaseUpdateLink 
} from "../../Base/Mutations/Update";

import { LinkURI, MediumEditableContent } from "../Components";
import { UpdateAsyncAction } from "../Queries";
import { makeMutationURI } from "./helpers";
//import { UpdateBody, UpdateButton, UpdateDialog, UpdateLink } from "./Update";

export const UpdateURI2 = makeMutationURI(LinkURI, "edit2", { withId: true });

const DefaultContent = MediumEditableContent
const mutationAsyncAction = UpdateAsyncAction

const permissions = {
    oneOfRoles: ["superadmin"],
    mode: "absolute",
}

export const UpdateLink2 = ({...props}) => {
    return <BaseUpdateLink {...props} uriPattern={UpdateURI2} />
}

export const UpdateButton2 = ({...props}) => {
    return <BaseUpdateButton 
        {...props} 
        DefaultContent={DefaultContent} 
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}

export const UpdateDialog2 = ({...props}) => {
    return <BaseUpdateDialog 
        {...props} 
        DefaultContent={DefaultContent} 
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}

export const UpdateBody2 = ({...props}) => {
    return <BaseUpdateBody 
        {...props} 
        DefaultContent={DefaultContent} 
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}