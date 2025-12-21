import { ButtonWithDialog, ErrorHandler, Input, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useRoles as useRolePermission } from "../../../../dynamic/src/Hooks/useRoles"
import { useAsync } from "../../../../dynamic/src/Hooks"
import { InsertAsyncAction } from "../Queries"
import { SearchAsyncAction } from "../Queries/SearchAsyncAction"
import { EntityLookup } from "../../Base/FormControls/EntityLookup"
import { useRef } from "react"


export const Insert = ({ item, ...props }) => {
    const { can, roleNames } = useRolePermission(item, ["administrátor"])
    const { loading, error, data, entity, run } = useAsync(InsertAsyncAction, {}, { deferred: true })
    const newId = useRef(crypto.randomUUID())
    // const { run: loadTypes } = useAsync(SearchAsyncAction, {}, { deferred: true })
    const handleConfirm = async (e) => {
        // const { target={} } = e || {}
        // const { value } = target?.value
        console.log("confirmed", e)
        if (e) {
            const result = await run(e)
            console.log("response", result)
        }
        newId.current = crypto.randomUUID()
    }
    const handleSelect = (e) => {
        console.log("selected", e)
        // return {}
    }
    // console.log("render", loadTypes)
    
    if (true)
        return (
            <>
                {error && <ErrorHandler errors={error} />}
                {loading && <LoadingSpinner text="Vytvářím..." />}
                <ButtonWithDialog {...props} params={{id: newId.current}} onClick={handleConfirm}>
                    Insert<br />
                    <Input id={"name"} label={"Název"} className="form-control" value={"Název typu"} />
                    <Input id={"name_en"} label={"Anglický název"} className="form-control" value={"Type name"} />
                    <EntityLookup 
                        id={"mastertypeId"}
                        label="Nadřízený typ"
                        className="form-control"
                        value={null}
                        asyncAction={SearchAsyncAction}
                        onSelect={handleSelect}
                    />
                    {/* {JSON.stringify(roleNames)} */}
                </ButtonWithDialog>
            </>
        )
    else
        return (<span className="btn btn-danger">Nemáte oprávnění</span>)
}
