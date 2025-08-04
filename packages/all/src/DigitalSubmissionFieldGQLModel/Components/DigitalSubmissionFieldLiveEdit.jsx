import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionFieldUpdateAsyncAction } from "../Queries";
import { DigitalSubmissionFieldMediumEditableContent } from "./DigitalSubmissionFieldMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalSubmissionFieldLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `digitalsubmissionfield` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `DigitalSubmissionFieldMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`digitalsubmissionfield`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.digitalsubmissionfield - Objekt reprezentující editovanou šablonu (digitalsubmissionfield entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=DigitalSubmissionFieldUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <DigitalSubmissionFieldLiveEdit digitalsubmissionfield={digitalsubmissionfieldEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <DigitalSubmissionFieldLiveEdit digitalsubmissionfield={digitalsubmissionfieldEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </DigitalSubmissionFieldLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const DigitalSubmissionFieldLiveEdit = ({digitalsubmissionfield, children, asyncAction=DigitalSubmissionFieldUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, digitalsubmissionfield, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(digitalsubmissionfield[id] === value, digitalsubmissionfield[id], value)
                if (digitalsubmissionfield[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: digitalsubmissionfield.id, 
                lastchange: (entity?.lastchange || digitalsubmissionfield?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <DigitalSubmissionFieldMediumEditableContent digitalsubmissionfield={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {digitalsubmissionfield && (
            <DigitalSubmissionFieldMediumEditableContent digitalsubmissionfield={digitalsubmissionfield} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}