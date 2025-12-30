import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { LinkURI, MediumEditableContent } from "../Components"
import { useState } from "react"
import { useCreateSession } from "../../../../dynamic/src/Hooks/useCreateSession"
import { InsertAsyncAction } from "../Queries"
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../Base/FormControls/Dialog"
import { ProxyLink } from "../../Base/Components/ProxyLink"
import { makeMutationURI } from "./helpers"
import { Lock } from "react-bootstrap-icons"


export const CreateURI = makeMutationURI(LinkURI, "create", { withId: false });
const ReadItemURI = `${LinkURI}:id`

export const CreateLink = ({
    rbacitem = {},
    oneOfRoles=["superadmin"],
    mode="absolute",
    uriPattern=CreateURI,
    children,
    ...props
}) => (
    <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={rbacitem}>
        <CreateLinkBody
            uriPattern={uriPattern}
            children={children}
            {...props}
        />
    </PermissionGate>
);

const CreateLinkBody = ({
    uriPattern=CreateURI,
    children,
    ...props
}) => {
    const { allowed } = usePermissionGateContext()
    if (allowed) {
        return (
            <ProxyLink to={uriPattern} {...props}>{children || "Vytvořit"}</ProxyLink>
        );
    } else {
        return (
            <ProxyLink 
                to={uriPattern} 
                disabled={true}
                {...props}
            >
                <Lock /> {children || "Vytvořit"}
            </ProxyLink>
        )
    }
}


const DefaultContent = MediumEditableContent
export const CreateButton = ({ 
    children,
    rbacitem,
    mutationAsyncAction=InsertAsyncAction,
    oneOfRoles=["superadmin"],
    mode="absolute",
    CreateDialog: CreateDialog_,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI=ReadItemURI,
    initialItem,
    ...props 
}) => {
    // console.log("CreateButton.premission test", rbacitem, oneOfRoles)
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={rbacitem}>
            <CreateButtonBody 
                children={children}
                mutationAsyncAction={mutationAsyncAction}
                CreateDialog={CreateDialog_}
                DefaultContent={DefaultContent_}
                initialItem={initialItem}
                readItemURI={readItemURI}
                rbacitem={rbacitem}
                {...props}
            />
        </PermissionGate>
    )
}

const CreateButtonBody = ({ 
    children,
    rbacitem,
    mutationAsyncAction=InsertAsyncAction,
    CreateDialog: CreateDialog_,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI=ReadItemURI,
    initialItem,
    ...props 
}) => {
    const [visible, setVisible] = useState(false)
    const { allowed } = usePermissionGateContext()
    // console.log("CreateButtonBody.allowed", allowed, rbacitem)
    const handleClick = () => {
        setVisible(prev => !prev)
    }
    if (allowed) {
        return (
            <>
                <button {...props} onClick={handleClick}>{children || "Vytvořit nový"}</button>
                {visible && CreateDialog_ &&(
                    <CreateDialog_
                        onOk={handleClick}
                        onCancel={handleClick}
                        mutationAsyncAction={mutationAsyncAction}
                        readItemURI={readItemURI}
                        initialItem={initialItem}
                    />
                )}
                {visible && !CreateDialog_ && (
                    <CreateDialog
                        onOk={handleClick}
                        onCancel={handleClick}
                        mutationAsyncAction={mutationAsyncAction}
                        DefaultContent={DefaultContent_}
                        readItemURI={readItemURI}
                        initialItem={initialItem}
                    />
                )}
            </>
        )    
    } else {
        return (
            <button {...props} onClick={handleClick} disabled><Lock />{children || "Vytvořit nový"}</button>
        )

    }
}

const dummyFunc = () => null
export const CreateDialog = ({
    title = "Nové oprávnění",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    onOk: handleOk = dummyFunc,
    onCancel: handleCancel = dummyFunc,
    mutationAsyncAction = InsertAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI=ReadItemURI,
    initialItem,
    children,
    ...props
}) => {
    const session = useCreateSession({
        initialItem: initialItem,
        readUri: readItemURI,
        mutationAsyncAction,
        onAfterConfirm: handleOk,
        onAfterCancel: handleCancel
    });

    return (
        <Dialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={session.handleCancel}
            onOk={session.handleConfirm}
            {...props}
        >
            <AsyncStateIndicator error={session.error} loading={session.saving} />
            <DefaultContent_ item={session.draft} onChange={session.onChange} onBlur={session.onBlur}>
                {children}
            </DefaultContent_>
        </Dialog>
    );
};

export const CreateBody = ({
    children,
    rbacitem,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    DefaultContent: DefaultContent_=DefaultContent,
    readItemURI=ReadItemURI,
    oneOfRoles=["superadmin"],
    mode="absolute",    
    ...props
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={rbacitem}>
            <CreateBodyBody 
                children={children}
                mutationAsyncAction={mutationAsyncAction}
                onOk={onOk}
                onCancel={onCancel}
                DefaultContent={DefaultContent_}
                readItemURI={readItemURI}
                {...props}
            />
        </PermissionGate>
    );
};

const CreateBodyBody = ({
    children,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    DefaultContent: DefaultContent_=DefaultContent,
    readItemURI=ReadItemURI,
    ...props
}) => {
    const session = useCreateSession({
        readUri: readItemURI,
        mutationAsyncAction,
        onAfterConfirm: async (result, draft) => {
            if (onOk) return onOk(result, draft);
            // když onOk není, session udělá default navigaci
        },
        onAfterCancel: async () => {
            if (onCancel) return onCancel();
            // když onCancel není, session udělá default navigate(-1)
        }
    });

    return (
        <>
            <DefaultContent_
                item={session.draft}
                onChange={session.onChange}
                onBlur={session.onBlur}
                {...props}
            >
                <AsyncStateIndicator error={session.error} loading={session.saving} />
                {children}

                <button
                    className="btn btn-warning form-control"
                    onClick={session.handleCancel}
                // disabled={!session.dirty || session.saving}
                >
                    Zrušit změny
                </button>

                <button
                    className="btn btn-primary form-control"
                    onClick={session.handleConfirm}
                // disabled={!session.dirty || session.saving}
                >
                    Uložit změny
                </button>
            </DefaultContent_>
        </>
    );
};
