// Import React hooků používaných pro tvorbu stabilních callbacků
// a memoizaci odvozených funkcí mezi jednotlivými rendery.
import {
    useCallback,
    useMemo
} from "react";

// Import vizuálního indikátoru probíhající asynchronní operace.
import {
    LoadingSpinner
} from "@hrbolek/uoisfrontend-shared";

// Import GraphQL async akce, která ukládá změny finanční entity.
import { UpdateAsyncAction } from "../Queries";

// Import formulářové komponenty obsahující editovatelná pole finance.
import { MediumEditableContent } from "./MediumEditableContent";

// Import poskytovatele asynchronní GraphQL akce a hooku
// pro přístup k aktuální entitě a jejím handlerům.
import {
    AsyncActionProvider,
    useGQLEntityContext
} from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

// Import vlastního hooku, který řídí pracovní kopii entity,
// změny formuláře a jejich ukládání.
import {
    useEditAction
} from "../../../../dynamic/src/Hooks/useEditAction";


/**
 * Provides the context-based live-edit workflow for a finance entity.
 *
 * The component reads the current finance entity and its event handlers from
 * the surrounding GraphQL entity context. It then creates a nested asynchronous
 * action provider configured to execute the supplied update action.
 *
 * This variant is intended for pages that already use
 * `GQLEntityProvider` or `AsyncActionProvider`.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ReactNode} [props.children]
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
    // Doplňkový obsah vykreslený uvnitř editačního formuláře.
    children,

    // Async akce použitá pro uložení změn.
    // Pokud není předána vlastní implementace, použije se UpdateAsyncAction.
    asyncAction = UpdateAsyncAction
}) => {
    // Z nadřazeného GraphQL kontextu se načte aktuální entita
    // a handlery pro zpracování změny a opuštění pole.
    const {
        onChange,
        onBlur,
        item
    } = useGQLEntityContext();

    return (
        // Vytvoření vnořeného provideru nakonfigurovaného
        // pro asynchronní aktualizaci aktuální finance.
        <AsyncActionProvider
            // Aktuální finance předaná provideru jako výchozí entita.
            item={item}

            // Async akce, kterou provider použije při síťové operaci.
            queryAsyncAction={asyncAction}

            // Akce je odložená a spouští skutečný síťový požadavek.
            options={{
                deferred: true,
                network: true
            }}

            // Předání handleru změny z okolního GraphQL kontextu.
            onChange={onChange}

            // Předání handleru opuštění pole z okolního kontextu.
            onBlur={onBlur}
        >
            {/* Wrapper převádí události jednotlivých formulářových polí
                na události obsahující celý aktualizovaný objekt finance. */}
            <LiveEditWrapper item={item}>
                {children}
            </LiveEditWrapper>
        </AsyncActionProvider>
    );
};


/**
 * Adapts field-level input events to the object-level events expected by the
 * asynchronous entity context.
 *
 * `MediumEditableContent` emits events containing a field identifier and its
 * new value. The wrapper creates an updated copy of the complete finance
 * entity and passes it to the context handler.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity currently being edited.
 *
 * @param {React.ReactNode} [props.children]
 * Optional content rendered inside the editable form.
 *
 * @returns {JSX.Element}
 * Editable finance form connected to the asynchronous entity context.
 */
const LiveEditWrapper = ({
    // Aktuální finanční položka, ze které se vytváří aktualizovaná kopie.
    item,

    // Volitelný doplňkový obsah formuláře.
    children
}) => {
    // Z vnořeného GraphQL kontextu se načtou handlery,
    // které očekávají událost obsahující celý objekt entity.
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
        // Funkce vyššího řádu přijme konkrétní kontextový handler
        // a vrátí asynchronní handler použitelý formulářovým polem.
        (handler) => async (event) => {
            // Z původní události se vybere název změněného atributu
            // a jeho nová hodnota.
            const {
                id,
                value
            } = event?.target ?? {};

            // Událost nelze zpracovat bez identifikátoru pole,
            // jeho hodnoty nebo platného cílového handleru.
            if (
                id === undefined ||
                value === undefined ||
                typeof handler !== "function"
            ) {
                return undefined;
            }

            // Pokud se hodnota nezměnila, není nutné spouštět aktualizaci.
            if (item?.[id] === value) {
                return undefined;
            }

            // Vytvoření nové kopie finance s přepsaným změněným atributem.
            // Původní objekt item zůstává nezměněn.
            const updatedItem = {
                ...item,
                [id]: value
            };

            // Kontext očekává aktualizovanou entitu uvnitř target.value,
            // proto se vytvoří nová událost v požadovaném formátu.
            const updatedEvent = {
                target: {
                    id,
                    value: updatedItem
                }
            };

            // Předání aktualizovaného objektu příslušnému kontextovému handleru.
            return handler(updatedEvent);
        },
        // Nový převodní handler se vytvoří pouze při změně editované entity.
        [item]
    );


    // Vytvoření handleru určeného pro průběžné změny hodnot.
    // useMemo zachovává stejnou referenci, dokud se nezmění jeho závislosti.
    const boundOnChange = useMemo(
        () => handleEvent(onChange),
        [handleEvent, onChange]
    );

    // Vytvoření stejného adaptéru pro událost opuštění formulářového pole.
    const boundOnBlur = useMemo(
        () => handleEvent(onBlur),
        [handleEvent, onBlur]
    );


    return (
        // Vykreslení editovatelných polí finance s upravenými handlery.
        <MediumEditableContent
            // Aktuálně editovaná finanční entita.
            item={item}

            // Upravený handler změny převádí hodnotu jednoho pole
            // na nový kompletní objekt finance.
            onChange={boundOnChange}

            // Upravený handler opuštění pole používá stejný převod.
            onBlur={boundOnBlur}
        >
            {/* Volitelné další prvky vložené do formuláře */}
            {children}
        </MediumEditableContent>
    );
};


/**
 * Displays a standalone live-edit form for a finance entity.
 *
 * The component uses `useEditAction` in live mode. Input changes are stored in
 * a local draft and persisted through the configured update mutation when the
 * corresponding field loses focus.
 *
 * A loading indicator is displayed while an update request is being processed.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Original finance entity used to initialize the editable draft.
 *
 * @param {React.ReactNode} [props.children]
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
    // Původní finanční entita použitá pro inicializaci pracovního návrhu.
    item,

    // Volitelný obsah zobrazený pod standardními formulářovými poli.
    children,

    // Async mutace použitá pro uložení změn.
    // Výchozí hodnotou je standardní finance UpdateAsyncAction.
    asyncMutationAction = UpdateAsyncAction
}) => {
    // Hook useEditAction řídí pracovní kopii dat a ukládání změn.
    const {
        // Aktuální pracovní kopie finance obsahující změny uživatele.
        draft,

        // Stav načítání je přejmenován na saving,
        // aby bylo zřejmé, že představuje probíhající ukládání.
        loading: saving,

        // Handler změny formulářového pole.
        onChange,

        // Handler opuštění pole, který v live režimu spouští uložení.
        onBlur
    } = useEditAction(
        // Async mutace odesílaná na backend.
        asyncMutationAction,

        // Původní data editované finanční položky.
        item,

        {
            // Live režim ukládá změny průběžně,
            // typicky po opuštění konkrétního formulářového pole.
            mode: "live"
        }
    );

    return (
        // Vykreslení formuláře napojeného přímo na useEditAction.
        <MediumEditableContent
            // Přednostně se zobrazí aktuální draft.
            // Pokud ještě nebyl vytvořen, použije se původní item.
            item={draft ?? item}

            // Registrace změny do lokálního draftu.
            onChange={onChange}

            // Spuštění live uložení po opuštění pole.
            onBlur={onBlur}
        >
            {/* Po dobu ukládání se zobrazí vizuální indikátor. */}
            {saving && <LoadingSpinner />}

            {/* Volitelný doplňkový obsah formuláře */}
            {children}
        </MediumEditableContent>
    );
};