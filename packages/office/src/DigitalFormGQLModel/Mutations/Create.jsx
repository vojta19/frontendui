import { CreateURI, MediumEditableContent, ReadItemURI } from "../Components"
import { InsertAsyncAction } from "../Queries"
import { 
    CreateBody as BaseCreateBody, 
    CreateButton as BaseCreateButton, 
    CreateDialog as BaseCreateDialog, 
    CreateLink  as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create"

const DefaultContent = (props) => <MediumEditableContent {...props}/>
const MutationAsyncAction = InsertAsyncAction

const permissions = {
    oneOfRoles: ["superadmin"],
    mode: "absolute",
}

export const CreateLink = ({
    uriPattern=CreateURI,
    ...props
}) => (
    <BaseCreateLink {...props} uriPattern={uriPattern} />
);

export const CreateButton = ({
    mutationAsyncAction=MutationAsyncAction,
    CreateDialog: CreateDialog_=CreateDialog,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    rbacitem,
    initialitem={
        name: "Nový",
        sections:[{
            name: "Sekce",
            repeatableMin: 0,
            repeatableMax: 1,
            
        }]
    },
    ...props
}) => {
    return <BaseCreateButton 
        {...props}
        DefaultContent={defaultContent} 
        CreateDialog={CreateDialog_}
        readItemURI={readItemURI}
        rbacitem={rbacitem}
        initialitem={initialitem}
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}

export const CreateDialog = ({
    title = "Nový formulář",
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    initialItem={
        name: "Nový",
        sections:[{
            name: "Sekce",
            repeatableMin: 0,
            repeatableMax: 1,
            
        }]
    },
    ...props
}) => {
    return <BaseCreateDialog 
        {...props} 
        title={title}
        DefaultContent={defaultContent} 
        initialItem={initialItem}
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
    />
};

export const CreateBody = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    ...props
}) => {
    return <BaseCreateBody 
        {...props} 
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
    />
};

