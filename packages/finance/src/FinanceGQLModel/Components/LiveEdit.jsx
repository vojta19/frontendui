// Importuje React hooky pro vytváření stabilních callbacků a memoizovaných hodnot.
import {
    useCallback,
    useMemo
} from "react";

// Importuje vizuální indikátor probíhajícího ukládání.
import {
    LoadingSpinner
} from "@hrbolek/uoisfrontend-shared";

// Importuje výchozí GraphQL akci pro aktualizaci finance.
import { UpdateAsyncAction } from "../Queries";

// Importuje formulářovou komponentu s editovatelnými poli finance.
import { MediumEditableContent } from "./MediumEditableContent";

// Importuje provider asynchronní akce a hook pro práci s aktuální GraphQL entitou.
import {
    AsyncActionProvider,
    useGQLEntityContext
} from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

// Importuje hook zajišťující správu editace, lokálního draftu a ukládání změn.
import {
    useEditAction
} from "../../../../dynamic/src/Hooks/useEditAction";


/**
 * Provides a context-based live-edit workflow for a finance entity.
 *
 * The component reads the current finance entity and its event handlers
 * from the surrounding GraphQL entity context. It then creates a nested
 * asynchronous action provider configured to execute the supplied update
 * action.
 *
 * This variant is intended for pages that already use
 * `GQLEntityProvider` or `AsyncActionProvider`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {*} [props.children]
 * Optional content rendered below the editable finance fields.
 *
 * @param {Function} [props.asyncAction=UpdateAsyncAction]
 * Asynchronous GraphQL action used to persist finance changes.
 *
 * @returns {JSX.Element}
 * Context-based live-edit interface.
 *
 * @example
 * <LiveEdit_>
 *     <p>Změny se ukládají po opuštění pole.</p>
 * </LiveEdit_>
 */
export const LiveEdit_ = ({
    // Volitelný obsah vykreslený pod editovatelnými poli.
    children,

    // Asynchronní akce použitá pro ukládání změn.
    asyncAction = UpdateAsyncAction
}) => {
    // Načte aktuální finance a její obslužné funkce z GraphQL kontextu.
    const {
        onChange,
        onBlur,
        item
    } = useGQLEntityContext();

    // Vytvoří vnořený provider, který provádí zadanou aktualizační akci.
    return (
        <AsyncActionProvider
            // Aktuální finance předaná provideru.
            item={item}

            // GraphQL akce použitá pro uložení změn.
            queryAsyncAction={asyncAction}

            // Akce se nespouští automaticky a komunikuje se skutečným backendem.
            options={{
                deferred: true,
                network: true
            }}

            // Předává obsluhu změny z nadřazeného kontextu.
            onChange={onChange}

            // Předává obsluhu opuštění pole z nadřazeného kontextu.
            onBlur={onBlur}
        >
            {/* Připojí editovatelný formulář k nově vytvořenému kontextu akce. */}
            <LiveEditWrapper item={item}>
                {children}
            </LiveEditWrapper>
        </AsyncActionProvider>
    );
};


/**
 * Adapts field-level input events to the object-level events expected by
 * the asynchronous entity context.
 *
 * `MediumEditableContent` emits events containing a field identifier and
 * its new value. The wrapper creates an updated copy of the complete finance
 * entity and passes it to the corresponding context handler.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity currently being edited.
 *
 * @param {*} [props.children]
 * Optional content rendered inside the editable form.
 *
 * @returns {JSX.Element}
 * Editable finance form connected to the asynchronous entity context.
 */
const LiveEditWrapper = ({
    // Finance entita aktuálně upravovaná ve formuláři.
    item,

    // Volitelný obsah vložený do formuláře.
    children
}) => {
    // Načte obslužné funkce z nejbližšího GraphQL entity kontextu.
    const {
        onChange,
        onBlur
    } = useGQLEntityContext();


    /**
    * Creates an event handler that converts a field-level event into an
    * object-level finance update event.
    *
    * @param {Function} handler
    * Context handler that receives the updated finance entity.
    *
    * @returns {Function}
    * Asynchronous input event handler.
    */
    const handleEvent = useCallback(
        // Vrací asynchronní obsluhu konkrétní formulářové události.
        (handler) => async (event) => {
            // Z události bezpečně získá ID pole a novou hodnotu.
            const {
                id,
                value
            } = event?.target ?? {};

            // Neúplná událost nebo neplatný handler se dále nezpracovává.
            if (
                id === undefined ||
                value === undefined ||
                typeof handler !== "function"
            ) {
                return undefined;
            }

            // Pokud se hodnota nezměnila, není potřeba spouštět aktualizaci.
            if (item?.[id] === value) {
                return undefined;
            }

            // Vytvoří novou kopii finance s aktualizovaným jedním polem.
            const updatedItem = {
                ...item,
                [id]: value
            };

            // Připraví událost ve formátu očekávaném objektovým kontextem.
            const updatedEvent = {
                target: {
                    id,
                    value: updatedItem
                }
            };

            // Předá aktualizovanou finance zadanému kontextovému handleru.
            return handler(updatedEvent);
        },
        [item]
    );


    // Vytvoří stabilní obsluhu změny formulářového pole.
    const boundOnChange = useMemo(
        () => handleEvent(onChange),
        [handleEvent, onChange]
    );

    // Vytvoří stabilní obsluhu opuštění formulářového pole.
    const boundOnBlur = useMemo(
        () => handleEvent(onBlur),
        [handleEvent, onBlur]
    );


    // Vykreslí editovatelný formulář napojený na transformované handlery.
    return (
        <MediumEditableContent
            item={item}
            onChange={boundOnChange}
            onBlur={boundOnBlur}
        >
            {children}
        </MediumEditableContent>
    );
};


/**
 * Displays a standalone live-edit form for a finance entity.
 *
 * The component uses `useEditAction` in live mode. Input changes are stored
 * in a local draft and persisted through the configured update mutation when
 * the corresponding field loses focus.
 *
 * A loading indicator is displayed while an update request is being
 * processed.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Original finance entity used to initialize the editable draft.
 *
 * @param {*} [props.children]
 * Optional content rendered below the editable fields.
 *
 * @param {Function} [props.asyncMutationAction=UpdateAsyncAction]
 * Asynchronous GraphQL mutation used to persist changes.
 *
 * @returns {JSX.Element}
 * Standalone live-edit form for a finance entity.
 *
 * @example
 * <LiveEdit
 *     item={finance}
 *     asyncMutationAction={UpdateAsyncAction}
 * >
 *     <small>Změny se ukládají automaticky.</small>
 * </LiveEdit>
 */
export const LiveEdit = ({
    // Původní finance použitá k vytvoření lokálního draftu.
    item,

    // Volitelný obsah vykreslený pod editovatelnými poli.
    children,

    // Asynchronní mutace použitá pro ukládání změn.
    asyncMutationAction = UpdateAsyncAction
}) => {
    // Inicializuje živou editaci s lokálním draftem a automatickým ukládáním.
    const {
        draft,
        loading: saving,
        onChange,
        onBlur
    } = useEditAction(
        // GraphQL akce použitá pro aktualizaci finance.
        asyncMutationAction,

        // Výchozí data formuláře.
        item,

        {
            // Režim live ukládá změny automaticky podle obsluhy hooku.
            mode: "live"
        }
    );

    // Vykreslí formulář s aktuálním draftem nebo původními daty.
    return (
        <MediumEditableContent
            item={draft ?? item}
            onChange={onChange}
            onBlur={onBlur}
        >
            {/* Během ukládání zobrazí vizuální indikátor. */}
            {saving && <LoadingSpinner />}

            {/* Vykreslí případný další obsah vložený rodičem. */}
            {children}
        </MediumEditableContent>
    );
};