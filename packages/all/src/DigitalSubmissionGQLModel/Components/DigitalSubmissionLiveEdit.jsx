import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionUpdateAsyncAction } from "../Queries";
import { DigitalSubmissionMediumEditableContent } from "./DigitalSubmissionMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalSubmissionLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `digitalsubmission` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `DigitalSubmissionMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`digitalsubmission`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.digitalsubmission - Objekt reprezentující editovanou šablonu (digitalsubmission entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=DigitalSubmissionUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <DigitalSubmissionLiveEdit digitalsubmission={digitalsubmissionEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <DigitalSubmissionLiveEdit digitalsubmission={digitalsubmissionEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </DigitalSubmissionLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const DigitalSubmissionLiveEdit = ({digitalsubmission, children, asyncAction=DigitalSubmissionUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, digitalsubmission, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(digitalsubmission[id] === value, digitalsubmission[id], value)
                if (digitalsubmission[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: digitalsubmission.id, 
                lastchange: (entity?.lastchange || digitalsubmission?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <DigitalSubmissionMediumEditableContent digitalsubmission={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}