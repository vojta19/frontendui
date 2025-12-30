import { useNavigate } from "react-router-dom";
import { useGQLEntityContext } from "../../Base/Helpers/GQLEntityProvider";
import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction";
import { LinkURI, MediumContent } from "../Components";
import { DeleteAsyncAction } from "../Queries";
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator";
import { useState } from "react";
import { useCallback } from "react";
import { ProxyLink, useLink } from "../../Base/Components/ProxyLink";
import { useMemo } from "react";
import { Dialog } from "../../Base/FormControls/Dialog";
import { makeMutationURI } from "./helpers";
import { Lock } from "react-bootstrap-icons";


export const DeleteURI = makeMutationURI(LinkURI, "delete", { withId: true });
const VectorItemsURI = makeMutationURI(LinkURI, "list", { withId: false });
const DefaultContent = MediumContent

export const DeleteLink = ({ 
    item, 
    preserveHash = true, 
    preserveSearch = true, 
    oneOfRoles=["superadmin"],
    mode="absolute",
    uriPattern=DeleteURI,
    children,
    ...props 
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode}>
            <DeleteLinkBody
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

const DeleteLinkBody = ({ 
    item, 
    preserveHash = true, 
    preserveSearch = true, 
    oneOfRoles=["superadmin"],
    mode="absolute",
    uriPattern=DeleteURI,
    children,
    ...props 
}) => {
    const { allowed } = usePermissionGateContext()
    const to = useMemo(() => {
        const id = item?.id ?? "";
        return uriPattern.replace(":id", String(id));
    }, [uriPattern, item?.id]);
    if (allowed) {
        return (
            <ProxyLink
                to={to}
                preserveHash={preserveHash}
                preserveSearch={preserveSearch}
                {...props}
            />
        );
    } else {
        return (
            <ProxyLink
                to={to}
                preserveHash={preserveHash}
                preserveSearch={preserveSearch}
                disabled={true}
                {...props}
            >
                <Lock /> {children}
            </ProxyLink>
        );
    }
};


export const DeleteButton = ({ 
    children, 
    item,
    mutationAsyncAction = DeleteAsyncAction, 
    oneOfRoles=["superadmin"],
    mode="absolute",
    DefaultContent: DefaultContent_ = DefaultContent,
    vectorItemsURI=VectorItemsURI,
    ...props 
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={item}>
            <DeleteButtonBody 
                item={item}
                mutationAsyncAction={mutationAsyncAction}
                DefaultContent={DefaultContent_}
                vectorItemsURI={vectorItemsURI}
                {...props }
            />
            {/* {JSON.stringify(visible)} */}
        </PermissionGate>
    )
}

const DeleteButtonBody = ({ 
    children, 
    item,
    mutationAsyncAction = DeleteAsyncAction, 
    DefaultContent: DefaultContent_ = DefaultContent,
    vectorItemsURI=VectorItemsURI,
    ...props 
}) => {
    const { allowed } = usePermissionGateContext()
    // const { can, roleNames } = useRoles(item, ["superadmin"])
    const { follow } = useLink({ to: vectorItemsURI })
    const [visible, setVisible] = useState(false)
    const togleVisible = () => setVisible(prev => !prev)
    const handleOkClick = () => {
        setVisible(false)
        follow()
    }
    const handleCancelClick = () => {
        setVisible(false)
    }
    if (allowed) {
        return (
            <>
                <button {...props} onClick={togleVisible}>{children || "Odstranit"}</button>
                {visible && (
                    <DeleteDialog 
                        onOk={handleOkClick} 
                        onCancel={handleCancelClick} 
                        mutationAsyncAction={mutationAsyncAction}
                        DefaultContent={DefaultContent_}
                        vectorItemsURI={vectorItemsURI}
                    />
                )}
                {/* {JSON.stringify(visible)} */}
            </>
        )
    } else {
            return (
                <button {...props} onClick={togleVisible} disabled><Lock />{children || "Odstranit"}</button>
        )
    }
}

const dummyFunc = () => null
export const DeleteDialog = ({
    title = "Odstranit",

    oklabel = "Odstranit",
    cancellabel = "Zrušit",
    onOk: handleOk = dummyFunc,
    onCancel: handleCancel = dummyFunc,
    mutationAsyncAction = DeleteAsyncAction,
    vectorItemsURI=VectorItemsURI,
    DefaultContent: DefaultContent_ = DefaultContent

}) => {
    const {
        item,
        // onChange: contextOnChange 
    } = useGQLEntityContext()
    const {
        commitNow,
        error,
        loading: saving
    } = useEditAction(mutationAsyncAction, item, { mode: "confirm" })

    const handleConfirm = useCallback(async () => {
        const result = await commitNow(item);
        handleOk(result);

        return result;
    }, [commitNow, handleOk, item]);

    return (
        <Dialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={handleCancel}
            onOk={handleConfirm}
            vectorItemsURI={vectorItemsURI}
        >
            <AsyncStateIndicator error={error} loading={saving} text={"Odstraňuji"} />
            <DefaultContent_ item={item} />
        </Dialog>
    )
}

export const DeleteBody = ({ 
    children, 
    mutationAsyncAction = DeleteAsyncAction,
    DefaultContent: DefaultContent_=DefaultContent,
    oneOfRoles=["superadmin"],
    mode="absolute",
    vectorItemsURI=VectorItemsURI,
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode}>
            <DeleteBodyBody 
                mutationAsyncAction={mutationAsyncAction}
                DefaultContent={DefaultContent_}
                vectorItemsURI={vectorItemsURI}
                children={children}
            />
        </PermissionGate>
    )
}

export const DeleteBodyBody = ({ 
    children, 
    mutationAsyncAction = DeleteAsyncAction,
    DefaultContent: DefaultContent_=DefaultContent,
    vectorItemsURI=VectorItemsURI,
}) => {
    const { allowed } = usePermissionGateContext()
    const navigate = useNavigate();
    const { item } = useGQLEntityContext()

    const {
        loading: saving,
        error: savingError,
        commitNow
    } = useEditAction(mutationAsyncAction, item, {
        mode: "confirm",
        // onCommit: contextOnChange
    })

    const handleConfirm = useCallback(async () => {
        const result = await commitNow(item)
        console.log("handleConfirm", result)
        if (result && navigate) {
            navigate(vectorItemsURI, { replace: true })
        }
    }, [navigate, commitNow])

    const handleCancel = () => {
        navigate(-1)
    }

    if (!item) return null
    if (allowed) {
        return (
            <>
                <DefaultContent_ item={item} >
                    <AsyncStateIndicator error={savingError} loading={saving} text={"Odstraňuji"} />
                    {children}
                    <button
                        className="btn btn-warning form-control"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Zrušit
                    </button>
                    <button
                        className="btn btn-primary form-control"
                        onClick={handleConfirm}
                        disabled={saving}
                    >
                        Smazat
                    </button>

                </DefaultContent_>
            </>
        )
    } else {
            return (
            <div>
                <button
                    className="btn btn-warning form-control"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Nemáte oprávnění
                </button>
            </div>
        )
    }
}
