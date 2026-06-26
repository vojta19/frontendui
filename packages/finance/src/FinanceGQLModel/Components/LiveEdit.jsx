// Importuje hook 'useCallback' z knihovny React pro memoizaci funkcí
import { useCallback } from "react";

// Importuje hook 'useMemo' z knihovny React pro memoizaci vypočtených hodnot
import { useMemo } from "react";

// Importuje asynchronní akci 'UpdateAsyncAction' ze souboru se sítěovými dotazy
import { UpdateAsyncAction } from "../Queries";

// Importuje sdílené pomocné komponenty (CreateDelayer, ErrorHandler, LoadingSpinner) ze společného balíčku
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

// Importuje editační komponentu středního rozsahu, která se stará o zobrazení formulářových polí
import { MediumEditableContent } from "./MediumEditableContent";

// Importuje vlastní React hook 'useEditAction' pro řízení stavu a akcí během editace dat
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction";

/**
 * TemplateLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `template` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `TemplateMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`template`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.template - Objekt reprezentující editovanou šablonu (template entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=TemplateUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <TemplateLiveEdit template={templateEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <TemplateLiveEdit template={templateEntity} asyncAction={myUpdateAction}>
 * <div>Extra obsah nebo poznámka</div>
 * </TemplateLiveEdit>
 *
 * @returns {JSX.Element}
 * Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
// Definuje a exportuje vnitřní komponentu LiveEdit_ přijímající children a výchozí update akci
export const LiveEdit_ = ({ children, asyncAction = UpdateAsyncAction }) => {
    
    // Vytahuje funkce onChange, onBlur a objekt item z globálního GraphQL kontextu entity
    const { onChange, onBlur, item } = useGQLEntityContext();
    
    // Vrací JSX strom obalený poskytovatelem asynchronních akcí
    return (
        <AsyncActionProvider 
            item={item} // Předává aktuální entitu (položku) do provideru
            queryAsyncAction={asyncAction} // Předává asynchronní mutaci/akci pro uložení změn
            options={{ deferred: true, network: true }} // Nastavuje specifické chování provideru (odloženě, síťově)
            onChange={onChange} // Předává callback vyvolaný při změně
            onBlur={onBlur} // Předává callback vyvolaný při opuštění pole
        >
            <LiveEditWrapper item={item}>
                {children}
            </LiveEditWrapper>
        </AsyncActionProvider>
    ); // Konec návratové hodnoty komponenty LiveEdit_
}; // Konec definice komponenty LiveEdit_

// Definuje komponentu LiveEditWrapper, která obaluje vnitřní logiku zachytávání a úpravy událostí inputů
const LiveEditWrapper = ({ item, children }) => {
    
    // Destrukturalizuje funkce a stavy poskytované kontextem useGQLEntityContext
    const { run, error, loading, entity, data, onChange, onBlur } = useGQLEntityContext();
    
    // Pomocí useCallback vytváří memoizovanou funkci vyššího řádu pro zpracování změn (onChange/onBlur)
    const handleEvent = useCallback((handler) => async (e) => {
        
        // Vytahuje vlastnosti 'id' a 'value' z elementu, který událost vyvolal
        const { id, value } = e?.target || {};
        
        // Pokud chybí ID nebo nová hodnota, okamžitě ukončí zpracování události
        if (id === undefined || value === undefined) return;
        
        // Pokud se nová hodnota shoduje se starou hodnotou v itemu, není třeba nic ukládat
        if (item?.[id] === value) {
            return;
        } // Konec podmínky shody hodnot
        
        // Vytváří kopii původní položky a přepisuje v ní změněné pole novou hodnotou
        const newItem = { ...item, [e.target.id]: e.target.value };
        
        // Simuluje strukturu události (eventu) pro předání do nadřazeného handleru, kde 'value' je celý nový objekt
        const newEvent = { target: { value: newItem } };
        
        // Asynchronně spouští předaný handler (onChange/onBlur) s nově vytvořeným eventem a čeká na výsledek
        const result = await handler(newEvent);
        
        // Vrací výsledek provedení dané akce (úspěch/chyba uložení)
        return result;
        
    }, [item]); // Závislostí useCallback je objekt item; při jeho změně se funkce přegeneruje

    // Memoizuje napojenou funkci onChange tak, že předá originální onChange z kontextu do handleEvent generátoru
    const bindedOnChange = useMemo(() => handleEvent(onChange), [onChange, handleEvent]);
    
    // Memoizuje napojenou funkci onBlur tak, že předá originální onBlur z kontextu do handleEvent generátoru
    const bindedOnBlur = useMemo(() => handleEvent(onBlur), [onBlur, handleEvent]);

    // Vrací komponentu MediumEditableContent, které předává item a nově navázané handlery
    return (
        <MediumEditableContent item={item} onChange={bindedOnChange} onBlur={bindedOnBlur}>
            {children}
        </MediumEditableContent>
    ); // Konec návratové hodnoty komponenty LiveEditWrapper
}; // Konec definice komponenty LiveEditWrapper

// Definuje a exportuje hlavní komponentu LiveEdit pro přímou inline editaci položky za běhu
export const LiveEdit = ({ item, children, asyncMutationAction = UpdateAsyncAction }) => {
    
    // Inicializuje hook useEditAction, který spravuje lokální drafty (koncepty), příznaky změn a samotný proces uložení
    const {
        draft, // Obsahuje aktuální rozpracovaný stav dat (draft)
        dirty, // Indikuje, zda se data v draftu liší od původního itemu
        loading: saving, // Přejmenovává loading stav na 'saving', který značí probíhající ukládání na pozadí
        onChange, // Handler pro registraci průběžných změn v polích formuláře
        onBlur, // Handler reagující na opuštění pole (v režimu "live" spouští uložení)
        onCancel, // Funkce pro zahození změn a návrat k původnímu stavu
        onConfirm, // Funkce pro ruční potvrzení a odeslání změn
    } = useEditAction(asyncMutationAction, item, {
        mode: "live", // Konfiguruje hook tak, aby se změny ukládaly ihned po opuštění políčka (onBlur)
    }); // Konec volání hooku useEditAction

    // Vrací editační kontejner napojený na handlery z useEditAction
    return (
        <MediumEditableContent item={item} onChange={onChange} onBlur={onBlur}>
            {saving && <LoadingSpinner />}
            {children}
        </MediumEditableContent>
    ); // Konec návratové hodnoty komponenty LiveEdit
}; // Konec definice komponenty LiveEdit