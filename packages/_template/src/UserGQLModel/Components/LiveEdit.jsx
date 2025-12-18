import { UpdateAsyncAction } from "../Queries";
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";
import { MediumEditableContent } from "./MediumEditableContent";
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction";



export const LiveEdit = ({ item, children }) => {
    const {
        draft,
        dirty,
        error,
        loading: saving,
        onChange, 
        onBlur,
        onCancel,
        onConfirm,
    } = useEditAction(UpdateAsyncAction, item, {
        mode: "live", 
    })

    return (
        
        <MediumEditableContent item={item} onChange={onChange} onBlur={onBlur} >
            {error && <ErrorHandler errors={error} />}
            {saving && <LoadingSpinner/>}
            {children}
        </MediumEditableContent>
        
    )
}