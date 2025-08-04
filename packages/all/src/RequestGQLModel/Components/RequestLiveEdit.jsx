import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestUpdateAsyncAction } from "../Queries";
import { RequestMediumEditableContent } from "./RequestMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * RequestLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `request` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `RequestMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`request`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.request - Objekt reprezentující editovanou šablonu (request entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=RequestUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <RequestLiveEdit request={requestEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <RequestLiveEdit request={requestEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </RequestLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const RequestLiveEdit = ({request, children, asyncAction=RequestUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, request, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(request[id] === value, request[id], value)
                if (request[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: request.id, 
                lastchange: (entity?.lastchange || request?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <RequestMediumEditableContent request={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}