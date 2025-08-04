import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormUpdateAsyncAction } from "../Queries";
import { DigitalFormMediumEditableContent } from "./DigitalFormMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalFormLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `digitalform` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `DigitalFormMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`digitalform`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.digitalform - Objekt reprezentující editovanou šablonu (digitalform entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=DigitalFormUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <DigitalFormLiveEdit digitalform={digitalformEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <DigitalFormLiveEdit digitalform={digitalformEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </DigitalFormLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const DigitalFormLiveEdit = ({digitalform, children, asyncAction=DigitalFormUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, digitalform, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(digitalform[id] === value, digitalform[id], value)
                if (digitalform[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: digitalform.id, 
                lastchange: (entity?.lastchange || digitalform?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <DigitalFormMediumEditableContent digitalform={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}