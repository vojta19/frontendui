import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeUpdateAsyncAction } from "../Queries";
import { RequestTypeMediumEditableContent } from "./RequestTypeMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * RequestTypeLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `requesttype` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `RequestTypeMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`requesttype`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.requesttype - Objekt reprezentující editovanou šablonu (requesttype entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=RequestTypeUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <RequestTypeLiveEdit requesttype={requesttypeEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <RequestTypeLiveEdit requesttype={requesttypeEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </RequestTypeLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const RequestTypeLiveEdit = ({requesttype, children, asyncAction=RequestTypeUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, requesttype, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(requesttype[id] === value, requesttype[id], value)
                if (requesttype[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: requesttype.id, 
                lastchange: (entity?.lastchange || requesttype?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <RequestTypeMediumEditableContent requesttype={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}