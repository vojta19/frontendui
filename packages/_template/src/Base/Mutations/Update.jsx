import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { UpdateAsyncAction } from "../Queries"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction"
import { useState } from "react"
import { LinkURI, LiveEdit, MediumEditableContent } from "../Components"
import { useCallback } from "react"
import { useGQLEntityContext } from "../../Base/Helpers/GQLEntityProvider"
import { useMemo } from "react"
import { ProxyLink } from "../../Base/Components/ProxyLink"
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../Base/FormControls/Dialog"
import { makeMutationURI } from "./helpers"
import { Lock } from "react-bootstrap-icons"

export const UpdateURI = makeMutationURI(LinkURI, "edit", { withId: true });

export const UpdateLink = ({ 
    item, 
    preserveHash = true, 
    preserveSearch = true, 
    oneOfRoles=["superadmin"],
    mode="absolute",
    uriPattern=UpdateURI,
    children,
    ...props 
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={item}>
            <UpdateLinkBody
                item={item}
                preserveHash={preserveHash}
                preserveSearch={preserveSearch}
                uriPattern={uriPattern}
                children={children}
                {...props}
            />
        </PermissionGate>
    );
};

const UpdateLinkBody = ({ 
    item, 
    preserveHash = true, 
    preserveSearch = true, 
    uriPattern=UpdateURI,
    disabled,
    children,
    ...props 
}) => {
    const { allowed } = usePermissionGateContext()
    const to = useMemo(() => {
        const id = item?.id ?? "";
        return uriPattern.replace(":id", String(id));
    }, [uriPattern, item?.id]);
    if (allowed) {
        return (<>
            <ProxyLink
                to={to}
                preserveHash={preserveHash}
                preserveSearch={preserveSearch}
                disabled={disabled}
                {...props}
            >
                {children}
            </ProxyLink>
        </>
    );
    } else {
        return (<>
            <ProxyLink
                to={to}
                preserveHash={preserveHash}
                preserveSearch={preserveSearch}
                disabled={true}
                {...props}
            >
                <Lock />
                {children}
            </ProxyLink>
        </>
    );
    }
};



const DefaultContent = MediumEditableContent

export const UpdateButton = ({ 
    children,
    item, 
    mutationAsyncAction = UpdateAsyncAction, 
    oneOfRoles=["superadmin"],
    mode="absolute",
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog=UpdateDialog,
    ...props 
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={item}>
            <UpdateButtonBody 
                item={item}
                mutationAsyncAction={mutationAsyncAction}
                DefaultContent={DefaultContent_}
                Dialog={Dialog}
                {...props}
            />
        </PermissionGate>
    )
}

const UpdateButtonBody = ({
    children,
    item, 
    mutationAsyncAction,
    DefaultContent,
    Dialog,
    ...props 
}) => {
    const { allowed } = usePermissionGateContext()
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(v => !v);
    const hide = () => setVisible(v => false)
    if (allowed) {
        return (<>
            <button {...props} onClick={toggle}>{children || "Editovat"}</button>
            {visible && (
                <Dialog 
                    onOk={hide} 
                    onCancel={hide} 
                    mutationAsyncAction={mutationAsyncAction}
                    DefaultContent={DefaultContent}
                />
            )}
        </>)
        
    } else {
        return <button {...props} onClick={toggle} ><Lock />{children || "Editovat"}</button>
    }
    
}

const dummyFunc = () => null
export const UpdateDialog = ({
    title = "Editace",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    onOk: handleOk = dummyFunc,
    onCancel: handleCancel = dummyFunc,
    mutationAsyncAction = UpdateAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    children,
    ...props
}) => {
    const { item, onChange: contextOnChange } = useGQLEntityContext()
    const {
        draft,
        onChange,
        onBlur,
        onCancel,
        onConfirm,
        error,
        loading: saving
    } = useEditAction(mutationAsyncAction, item, { mode: "confirm" })

    const handleCancel_ = useCallback(async () => {
        onCancel()
        handleCancel()
    }, [onCancel, handleCancel])

    const handleConfirm = useCallback(async () => {
        const result = await onConfirm(draft);
        // console.log("ConfirmEdit handleConfirm result", result, "draft", draft)
        if (result) {
            const event = { target: { value: draft } };
            // důležité: použij params z kontextu (provider si je drží jako "poslední vars")
            await contextOnChange(event);
        }
        handleOk()
        return result;
    }, [onConfirm, handleOk, contextOnChange]);

    return (
        <Dialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={handleCancel_}
            onOk={handleConfirm}
            {...props}
        >
            <AsyncStateIndicator error={error} loading={saving} text={"Ukládám"} />
            <DefaultContent_ item={item} onChange={onChange} onBlur={onBlur}>
                {children}
            </DefaultContent_>

        </Dialog>
    )
}

export const UpdateBody = ({ 
    children,
    mutationAsyncAction = UpdateAsyncAction,
    DefaultContent: DefaultContent_=DefaultContent,
    oneOfRoles=["superadmin"],
    mode="absolute"
}) => {
    const { item } = useGQLEntityContext()
    // const { can, roleNames } = useRolePermission(item, ["administrátor"])
    if (!item) return null
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={item}>
            <UpdateBodyBody 
                item={item} 
                mutationAsyncAction={mutationAsyncAction} 
                DefaultContent={DefaultContent_}
                children={children}
            />
        </PermissionGate>
    )
}

const UpdateBodyBody = ({ 
    item,
    children,
    mutationAsyncAction = UpdateAsyncAction,
    DefaultContent: DefaultContent_=DefaultContent,
}) => {
    const { allowed } = usePermissionGateContext()
    // const { can, roleNames } = useRolePermission(item, ["administrátor"])

    if (allowed) {
        return (<>
            <LiveEdit 
                item={item} 
                mutationAsyncAction={mutationAsyncAction} 
                DefaultContent={DefaultContent_}
            />
            {children}
    </>)
    } else {
        return (<>
            <div>Nemáte oprávnění</div>
        </>)
    }
    
}

const onDone_ = () => null;

export const UpdateItemConfirm = ({ onDone = onDone_, children }) => {
    const { item, onChange: contextOnChange } = useGQLEntityContext()

    const {
        draft,
        dirty,
        onChange,
        onBlur,
        onCancel,
        onConfirm,
        error,
        loading: saving
    } = useEditAction(UpdateAsyncAction, item, { mode: "confirm" })

    const handleCancel = useCallback(async () => {
        onCancel()
        onDone()
    }, [onDone, onCancel])

    const handleConfirm = useCallback(async () => {
        const result = await onConfirm();
        // console.log("ConfirmEdit handleConfirm result", result, "draft", draft)
        if (result) {
            const event = { target: { value: result } };
            // důležité: použij params z kontextu (provider si je drží jako "poslední vars")
            await contextOnChange(event);
        }
        onDone()
        return result;
    }, [onDone, onConfirm, contextOnChange]);


    return (<>
        <AsyncStateIndicator error={error} loading={saving} text="Ukládám" />
        <DefaultContent item={item} onChange={onChange} onBlur={onBlur} >
            {children}
            <hr />
            {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
            <button
                className="btn btn-warning form-control"
                onClick={handleCancel}
                disabled={!dirty || saving}
            >
                Zrušit změny
            </button>
            <button
                className="btn btn-primary form-control"
                onClick={handleConfirm}
                disabled={!dirty || saving}
            >
                Uložit změny
            </button>
        </DefaultContent>
    </>
    )
}