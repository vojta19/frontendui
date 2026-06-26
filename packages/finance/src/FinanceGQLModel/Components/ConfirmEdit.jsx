import { UpdateAsyncAction } from "../Queries" // import async akce pro mutaci/aktualizaci
import { MediumEditableContent } from "./MediumEditableContent" // import komponenty pro editaci s středním obsahem
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction" // hook pro správu edit stavu a akcí
import { useCallback } from "react" // hook pro optimalizaci callback funkcí
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider" // hook pro přístup ke GQL kontextu entity

/**
 * A component that handles confirmation and saving of entity edits.
 *
 * This component integrates with the GraphQL context and edit action hook to provide
 * a complete edit workflow with cancel and confirm buttons. It manages local draft state
 * and synchronizes changes with the GraphQL context upon confirmation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.item - The entity item to be edited.
 * @param {React.ReactNode} props.children - Child elements to render inside the editable content.
 *
 * @returns {JSX.Element} A form with editable content and action buttons.
 *
 * @example
 * import { ConfirmEdit } from './ConfirmEdit';
 *
 * const item = { id: 1, name: "Finance Entry", amount: 100 };
 *
 * <ConfirmEdit item={item}>
 *   <CustomFormFields />
 * </ConfirmEdit>
 */
export const ConfirmEdit = ({ item, children }) => { // komponenta přijímá editovanou položku a potomky
    // extrahuje GQL kontext: funkce run, error state, loading state, entitu, data a callback handlery
    const {
        run,
        error,
        loading,
        entity,
        data,
        onChange: contextOnChange,
        onBlur: contextOnBlur,
    } = useGQLEntityContext()

    // callback pro zpracování mutace s notifikací - kombinuje změnu a notifikační handler
    const localOnMutationEvent = useCallback(
        (mutationHandler, notifyHandler) =>
            async (e) => {
                // vytvoří nový objekt položky s aktualizovanou hodnotou z targetu
                const newItem = { ...item, [e.target.id]: e.target.value }
                // vytvoří nový event objekt se zaktualizovanou hodnotou
                const newEvent = { target: { value: newItem } }

                // zavolá notifikační handler s novým eventem
                await notifyHandler(newEvent)
                // zavolá mutační handler s původním eventem
                return await mutationHandler(e)
            },
        []
    )

    // extrahuje edit state a akce z hooku: draft, dirty flag, handlery pro změny a akce
    const { draft, dirty, onChange, onBlur, onCancel, onConfirm } = useEditAction(
        UpdateAsyncAction,
        item,
        { mode: "confirm" }
    )

    // callback pro potvrzení změn - provede mutaci a synchronizuje s kontextem
    const handleConfirm = useCallback(
        async () => {
            // zavolá onConfirm z useEditAction, který provede mutaci
            const result = await onConfirm()
            // log pro debug: výsledek mutace a aktuální draft
            console.log("ConfirmEdit handleConfirm result", result, "draft", draft)
            // pokud mutace vrátila výsledek
            if (result) {
                // vytvoří event s výsledkem pro kontext
                const event = { target: { value: result } }
                // synchronizuje výsledek s GQL kontextem
                await contextOnChange(event)
            }
            // vrací výsledek mutace
            return result
        },
        [onConfirm, contextOnChange]
    )

    return (
        <MediumEditableContent item={item} onChange={onChange} onBlur={onBlur}>
            {children} {/* render potomků */}
            <hr /> {/* vizuální oddělovač */}
            {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
            <button
                className="btn btn-warning form-control" // warning styl tlačítka
                onClick={onCancel} // zavolá cancel handler
                disabled={!dirty || loading} // disable pokud není změn nebo je loading
            >
                Zrušit změny {/* text tlačítka pro zrušení */}
            </button>
            <button
                className="btn btn-primary form-control" // primary styl tlačítka
                onClick={handleConfirm} // zavolá confirm handler
                disabled={!dirty || loading} // disable pokud není změn nebo je loading
            >
                Uložit změny {/* text tlačítka pro uložení */}
            </button>
        </MediumEditableContent>
    )
}
