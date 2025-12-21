import { CreateDelayer, ErrorHandler, Input, Label, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useCallback } from "react"
import { useGQLClient } from "../../../../dynamic/src/Store"
import { useAsync } from "../../../../dynamic/src/Hooks"
import { useEffect } from "react"
import { useState } from "react"

export const EntityLookup = ({ 
    id,
    asyncAction, 
    value,
    onSelect = (item) => { clear: true }, 
    onChange = null,
    skip = 0, 
    limit = 10, 
    label = "Hledaný text", 
    ...props 
}) => {
    // const dispatch = useDispatch()
    const [Delayer] = useState(() => CreateDelayer()) // useState checks for a function ;)
    const { run, loading, error } = useAsync(asyncAction, {}, { deferred: true })
    const [fetchedItems, setFetchedItems] = useState([])
    const gqlClient = useGQLClient()
    const [value_, setValue_] = useState(value)

    useEffect(()=>{
        setValue_(value)
    },[value])

    const handleChange = useCallback(async (e) => {
        const target = e?.target || {}
        const value = target?.value || ""
        if (target?.value === "") {
            if (onChange) {
                onChange({target: {id, value: null}})    
            }
        }
        if (value.length < 3) return
        const searchresult = await Delayer(async () => await run({ pattern: "%" + value + "%" }, gqlClient))
        // console.log("searchresult", searchresult)
        setFetchedItems(old => searchresult)
    }, [asyncAction, skip, limit])

    const handleSelect = useCallback((item) => {
        
        setValue_(prev => item || prev)

        if (onChange) {
            onChange({target: {id, value: item?.id}})
            setFetchedItems(() => [])
        }

        const response = onSelect(item) || {}
        const { clear = true } = response
        if (clear) {
            setFetchedItems(() => [])
        }
        
    }, [onSelect, setFetchedItems])

    // const sureValue = value || {}
    // const inputValue = sureValue?.fullname || sureValue?.name
    return (
        <>
            {loading && <LoadingSpinner text="Hledám" />}
            {error && <ErrorHandler errors={error} />}
            {/* {JSON.stringify(value)} */}
            <Label title={label}>
                <Input {...props} 
                    id={"__phrase"} 
                    onChange={handleChange} 
                    placeholder="Napiště alespoň 3 znaky" 
                    value={value_?.name}
                />
                {fetchedItems.map(
                    item => <SearchResult key={item?.id} item={item} onSelect={handleSelect} />
                )}
            </Label>
            
        </>
    )
}

const SearchResult = ({ item, onSelect }) => {
    const text = item?.fullname || item?.name || item?.id || "(Chyba v programu, dotaz nevraci jmena)";
    return (
        <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onSelect(item)}
            style={{ display: "block", width: "100%", textAlign: "left" }}
        >
            {text}
        </button>
    );
};