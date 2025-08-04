import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormFieldUpdateAsyncAction } from "../Queries";
import { DigitalFormFieldMediumEditableContent } from "./DigitalFormFieldMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * DigitalFormFieldLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `digitalformfield` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `DigitalFormFieldMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`digitalformfield`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.digitalformfield - Objekt reprezentující editovanou šablonu (digitalformfield entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=DigitalFormFieldUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <DigitalFormFieldLiveEdit digitalformfield={digitalformfieldEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <DigitalFormFieldLiveEdit digitalformfield={digitalformfieldEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </DigitalFormFieldLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const DigitalFormFieldLiveEdit = ({digitalformfield, children, asyncAction=DigitalFormFieldUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, digitalformfield, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(digitalformfield[id] === value, digitalformfield[id], value)
                if (digitalformfield[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: digitalformfield.id, 
                lastchange: (entity?.lastchange || digitalformfield?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
            <DigitalFormFieldMediumEditableContent digitalformfield={entity} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}