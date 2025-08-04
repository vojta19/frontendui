import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionSectionUpdateAsyncAction } from "../Queries";
import { DigitalSubmissionSectionMediumEditableContent } from "./DigitalSubmissionSectionMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalSubmissionSectionLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `digitalsubmissionsection` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `DigitalSubmissionSectionMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`digitalsubmissionsection`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.digitalsubmissionsection - Objekt reprezentující editovanou šablonu (digitalsubmissionsection entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=DigitalSubmissionSectionUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <DigitalSubmissionSectionLiveEdit digitalsubmissionsection={digitalsubmissionsectionEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <DigitalSubmissionSectionLiveEdit digitalsubmissionsection={digitalsubmissionsectionEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </DigitalSubmissionSectionLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const DigitalSubmissionSectionLiveEdit = ({digitalsubmissionsection, children, asyncAction=DigitalSubmissionSectionUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, digitalsubmissionsection, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(digitalsubmissionsection[id] === value, digitalsubmissionsection[id], value)
                if (digitalsubmissionsection[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: digitalsubmissionsection.id, 
                lastchange: (entity?.lastchange || digitalsubmissionsection?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <DigitalSubmissionSectionMediumEditableContent digitalsubmissionsection={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}