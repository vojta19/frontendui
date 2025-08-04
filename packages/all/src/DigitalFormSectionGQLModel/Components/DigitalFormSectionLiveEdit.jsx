import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormSectionUpdateAsyncAction } from "../Queries";
import { DigitalFormSectionMediumEditableContent } from "./DigitalFormSectionMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalFormSectionLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `digitalformsection` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `DigitalFormSectionMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`digitalformsection`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.digitalformsection - Objekt reprezentující editovanou šablonu (digitalformsection entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=DigitalFormSectionUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <DigitalFormSectionLiveEdit digitalformsection={digitalformsectionEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <DigitalFormSectionLiveEdit digitalformsection={digitalformsectionEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </DigitalFormSectionLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const DigitalFormSectionLiveEdit = ({digitalformsection, children, asyncAction=DigitalFormSectionUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, digitalformsection, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(digitalformsection[id] === value, digitalformsection[id], value)
                if (digitalformsection[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: digitalformsection.id, 
                lastchange: (entity?.lastchange || digitalformsection?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <DigitalFormSectionMediumEditableContent digitalformsection={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}