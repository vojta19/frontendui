import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { CreateDelayer } from "./CreateDelayer"

/**
 * shared module.
 * @module shared/components
 */

const ShowResult = ({item, onClick}) => {
    const onClick_ = (event) => {
        event.preventDefault()
        onClick(item)
    }
    return (
        <><a href="#" onClick={onClick_}>{item?.fullname || item?.name}</a>;  </>
    )
}

/**
 * interactive search box checking GQL API endpoint for related items (with fullname || name attribute)
 * @function
 * @param {int} props.limit parametr of the query
 * @param {dict} props.where parametr of the query
 * @param {JSX.Element} props.ShowResultComponent Component for single result visualization
 * @param {function} props.FetchByPatternAsyncAction dispatchable action - query function
 * @param {function} props.onSelect delayed callback notifying about the change
 * @returns JSX.Element
 */
export const SearchInput = ({label="search", phrase: phrase_="", skip=0, limit=100, FetchByPatternAsyncAction, ShowResultComponent=ShowResult, onSelect}) => {
    const dispatch = useDispatch()
    const [Delayer] = useState(() => CreateDelayer()) // useState checks for a function ;)
    const [phrase, setPhrase] = useState(phrase_)
    const [results, setResults] = useState([])
    const [visible, setVisible] = useState(true)

    const onChange = (e) => {
        const newPhrase = e.target.value
        // console.log("newPhrase", newPhrase)
        Delayer(() => setPhrase(newPhrase))
    }
    const onClick = (item) => {
        // console.log('clicked', item)
        if (onSelect) {
            onSelect(item.id)
        }
        setVisible(false)
        setPhrase(item?.fullname||item?.name||"???chyba???")
    }

    useEffect( () => {
        const lowercase = phrase.toLowerCase()
        if (lowercase.length > 2) {
            const asyncAction = FetchByPatternAsyncAction({pattern: `%${lowercase}%`, skip:skip, limit: limit})
            console.log("asyncAction", asyncAction)
            dispatch(asyncAction)
            .then(
                (json) => {
                    const data = json?.data || {}
                    let allResults = []
                    for(const key in data) {
                        const result = data[key]
                        if (Array.isArray(result)) {
                            allResults.push(...result)
                        }
                    }
                    setResults(allResults)
                }
            )
        }
    }, [FetchByPatternAsyncAction, dispatch, phrase, skip, limit])

    if (visible) {
        return (
            <>
                <div className="form-floating">
                    <input className="form-control" id={"searchbox"} defaultValue={phrase} onChange={onChange} />
                    <label htmlFor={"searchbox"}>{label}</label>
                </div>
                {results.map(
                    result => <ShowResultComponent key={result.id} item={result} onClick={onClick}/>
                )}
            </>
        )
    } else {
        return (
            <div className="form-floating">
                <span id={"searchbox"} className="input-group-text form-control" onClick={() => setVisible(true)}>{phrase}</span>
                <label htmlFor={"searchbox"}>{label}</label>
            </div>            
        )        
    }
}
