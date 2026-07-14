// Importuje React hook pro vytváření memoizovaných callback funkcí.
import { useCallback } from "react";

// Importuje GraphQL mutaci používanou pro aktualizaci finance.
import { UpdateAsyncAction } from "../Queries";

// Importuje formulář s editovatelnými poli finance.
import { MediumEditableContent } from "./MediumEditableContent";

// Importuje hook zajišťující práci s draftem a potvrzovací editací.
import {
    useEditAction
} from "../../../../dynamic/src/Hooks/useEditAction";

// Importuje GraphQL kontext aktuálně otevřené entity.
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
 * After a successful update, the returned finance entity is propagated to
 * the surrounding GraphQL entity context so that other components can use
 * the current data.
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
 * @param {*} [props.children]
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
    // Finance entita určená k editaci.
    item,

    // Volitelný obsah vykreslený pod formulářem.
    children
}) => {

    // Načte funkci pro synchronizaci změn do GraphQL kontextu.
    const {
        onChange: contextOnChange
    } = useGQLEntityContext();

    // Inicializuje potvrzovací režim editace.
    const {
        draft,
        dirty,
        loading: saving,
        onChange,
        onBlur,
        onCancel,
        onConfirm
    } = useEditAction(
        // GraphQL mutace používaná pro uložení změn.
        UpdateAsyncAction,

        // Výchozí data formuláře.
        item,

        {
            // Editace bude potvrzena až stiskem tlačítka.
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
    // Potvrdí změny a synchronizuje aktualizovanou entitu s okolním kontextem.
    const handleConfirm = useCallback(async () => {

        // Odešle změny na server.
        const result = await onConfirm();

        // Pokud bylo uložení úspěšné, aktualizuje GraphQL kontext.
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

        // Vrátí uloženou entitu volající komponentě.
        return result;
    }, [
        contextOnChange,
        onConfirm
    ]);


    // Vykreslí potvrzovací formulář editace.
    return (
        <MediumEditableContent
            // Zobrazuje lokální draft nebo původní data.
            item={draft ?? item}

            // Obsluha změn formulářových polí.
            onChange={onChange}

            // Obsluha opuštění formulářového pole.
            onBlur={onBlur}
        >
            {/* Vykreslí případný dodatečný obsah. */}
            {children}

            <hr />

            {/* Tlačítko pro zrušení všech neuložených změn. */}
            <button
                type="button"
                className="btn btn-warning form-control"
                onClick={onCancel}
                disabled={!dirty || saving}
            >
                Zrušit změny
            </button>

            {/* Tlačítko pro potvrzení a uložení změn. */}
            <button
                type="button"
                className="btn btn-primary form-control"
                onClick={handleConfirm}
                disabled={!dirty || saving}
            >
                {saving
                    ? "Ukládám změny..."
                    : "Uložit změny"}
            </button>
        </MediumEditableContent>
    );
};