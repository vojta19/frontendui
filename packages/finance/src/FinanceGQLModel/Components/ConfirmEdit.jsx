// Import hooku useCallback pro vytvoření memoizovaných funkcí,
// které se zbytečně nevytvářejí při každém překreslení komponenty.
import { useCallback } from "react";

// Import GraphQL mutace sloužící k uložení změn finanční entity.
import { UpdateAsyncAction } from "../Queries";

// Import formuláře obsahujícího editovatelná pole finance.
import { MediumEditableContent } from "./MediumEditableContent";

// Import vlastního hooku, který zajišťuje kompletní logiku editace
// (pracovní kopii dat, ukládání, zrušení změn apod.).
import {
    useEditAction
} from "../../../../dynamic/src/Hooks/useEditAction";

// Import GraphQL kontextu aktuálně otevřené entity.
// Díky němu lze po uložení synchronizovat změny i do ostatních komponent.
import {
    useGQLEntityContext
} from "../../../../_template/src/Base/Helpers/GQLEntityProvider";


/**
 * Displays a confirmation-based editing interface for a finance entity.
 *
 * The component manages a local editable draft through `useEditAction`.
 * Unlike live editing, changes are not persisted immediately. The user must
 * explicitly confirm or cancel the modifications using the provided action
 * buttons.
 *
 * After a successful update, the returned entity is propagated to the
 * surrounding GraphQL entity context so that other components can use the
 * current data.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Original finance entity used to initialize the editable draft.
 *
 * @param {string} [props.item.id]
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Czech name of the finance entity.
 *
 * @param {string} [props.item.nameEn]
 * English name of the finance entity.
 *
 * @param {string} [props.item.description]
 * Description of the finance entity.
 *
 * @param {React.ReactNode} [props.children]
 * Optional additional form fields or content rendered below the standard
 * editable finance fields.
 *
 * @returns {JSX.Element}
 * Confirmation-based finance editing form.
 *
 * @example
 * <ConfirmEdit item={finance}>
 *     <p>Změny se uloží až po potvrzení.</p>
 * </ConfirmEdit>
 */
export const ConfirmEdit = ({
    // Editovaná finanční položka.
    item,

    // Volitelný dodatečný obsah vložený do formuláře.
    children
}) => {

    // Z GraphQL kontextu získává pouze funkci onChange,
    // která slouží k aktualizaci sdílené entity po úspěšném uložení.
    const {
        onChange: contextOnChange
    } = useGQLEntityContext();

    // Inicializace vlastního hooku pro editaci.
    // Hook vytváří pracovní kopii dat (draft), sleduje změny
    // a poskytuje funkce pro jejich potvrzení nebo zrušení.
    const {
        draft,
        dirty,
        loading: saving,
        onChange,
        onBlur,
        onCancel,
        onConfirm
    } = useEditAction(
        UpdateAsyncAction,
        item,
        {
            // Režim "confirm" znamená, že se změny odešlou
            // až po stisku tlačítka "Uložit změny".
            mode: "confirm"
        }
    );


    /**
     * Persists the current finance draft and synchronizes the returned entity
     * with the surrounding GraphQL context.
     *
     * @async
     *
     * @returns {Promise<Object|undefined>}
     * Updated finance entity returned by the mutation, or `undefined` when
     * the update was not completed.
     */
    // Funkce volaná po stisku tlačítka "Uložit změny".
    // Nejprve odešle mutaci na server a následně synchronizuje
    // vrácenou entitu se sdíleným GraphQL kontextem.
    const handleConfirm = useCallback(async () => {

        // Odešle změny na backend.
        const result = await onConfirm();

        // Pokud bylo uložení úspěšné a existuje callback kontextu,
        // aktualizuje data i v ostatních komponentách aplikace.
        if (
            result &&
            typeof contextOnChange === "function"
        ) {
            await contextOnChange({
                target: {
                    value: result
                }
            });
        }

        // Vrací aktualizovanou entitu volající komponentě.
        return result;

    }, [
        contextOnChange,
        onConfirm
    ]);


    // Vykreslení editačního formuláře.
    return (
        <MediumEditableContent

            // Pokud existuje pracovní kopie (draft),
            // zobrazí se právě ta. Jinak původní objekt.
            item={draft ?? item}

            // Handler reagující na změnu hodnot formuláře.
            onChange={onChange}

            // Handler reagující na opuštění vstupního pole.
            onBlur={onBlur}
        >
            {/* Dodatečný obsah předaný rodičovskou komponentou */}
            {children}

            {/* Vizuální oddělení formuláře od akčních tlačítek */}
            <hr />

            <button
                type="button"
                className="btn btn-warning form-control"

                // Obnoví původní hodnoty a zahodí všechny neuložené změny.
                onClick={onCancel}

                // Tlačítko je aktivní pouze pokud existují změny
                // a zároveň právě neprobíhá ukládání.
                disabled={!dirty || saving}
            >
                Zrušit změny
            </button>

            <button
                type="button"
                className="btn btn-primary form-control"

                // Spustí uložení změn na server.
                onClick={handleConfirm}

                // Po dobu ukládání nebo pokud nejsou žádné změny
                // není možné tlačítko použít.
                disabled={!dirty || saving}
            >
                {/* Během ukládání se změní text tlačítka,
                    aby měl uživatel zpětnou vazbu o probíhající operaci. */}
                {saving
                    ? "Ukládám změny..."
                    : "Uložit změny"}
            </button>

        </MediumEditableContent>
    );
};