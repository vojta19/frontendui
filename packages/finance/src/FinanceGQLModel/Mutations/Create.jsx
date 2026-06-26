// Importuje potřebné konstanty a komponenty z lokálního adresáře Components
import { CreateURI, MediumEditableContent, ReadItemURI } from "../Components";

// Importuje asynchronní akci InsertAsyncAction ze souboru se sítěovými dotazy (Queries)
import { InsertAsyncAction } from "../Queries";

// Importuje základní mutační komponenty ze sdílené šablony a přejmenovává je s prefixem Base
import { 
    CreateBody as BaseCreateBody, 
    CreateButton as BaseCreateButton, 
    CreateDialog as BaseCreateDialog, 
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";

// Definuje komponentu DefaultContent, která jako výchozí editační obsah pouze přeposílá props do MediumEditableContent
const DefaultContent = (props) => <MediumEditableContent {...props} />;

// Přiřazuje asynchronní akci vložení (InsertAsyncAction) do lokální konstanty MutationAsyncAction
const MutationAsyncAction = InsertAsyncAction;

// Definuje konfigurační objekt oprávnění (RBAC) vyžadující roli administrátora v absolutním režimu kontroly
const permissions = {
    oneOfRoles: ["administrátor"], // Pole povolených uživatelských rolí
    mode: "absolute", // Režim vyhodnocování oprávnění (striktní/absolutní)
}; // Konec definice oprávnění

// Nastavuje výchozí datovou strukturu (draft) pro nově vytvářenou entitu s předdefinovaným názvem
const defaultitem = { name: "Nový" };

/**
 * Wrapper nad `BaseCreateLink` (alias importu `CreateLink` z Base/Mutations/Create),
 * který je odvozený z obecných `General*` komponent.
 *
 * Účel wrapperu:
 * - nastaví výchozí `uriPattern` pro create route
 * - aplikuje výchozí RBAC nastavení přes `permissions` (např. `oneOfRoles`, `mode`)
 * - všechny ostatní props pouze přeposílá do Base komponenty
 * * Vizuálně vyrenderuje link pro kliknutí
 *
 * @param {Object} params
 * @param {string} [params.uriPattern=CreateURI]
 * Cílová URI/pattern pro link na create stránku nebo create akci (dle routování aplikace).
 *
 * @param {Object} params.props
 * Další props přeposílané do `BaseCreateLink` (např. `children`, `className`,
 * `preserveSearch`, `preserveHash`, atd.).
 *
 * @returns {JSX.Element} Vykreslí `BaseCreateLink` s přednastaveným `uriPattern` a RBAC oprávněními.
 */
// Definuje a exportuje komponentu CreateLink, která přijímá uriPattern s výchozí hodnotou a zbytek parametrů (props)
export const CreateLink = ({
    uriPattern = CreateURI, // Výchozí cesta pro vytvoření záznamu
    ...props // Zachytává všechny ostatní předané vlastnosti
}) => (
    // Vrací základní komponentu odkazu obohacenou o props, definovanou URI cestu a globální oprávnění administrátora
    <BaseCreateLink {...props} uriPattern={uriPattern} {...permissions} />
); // Konec definice komponenty CreateLink

/**
 * Wrapper nad `BaseCreateButton` (alias importu `CreateButton` z Base/Mutations/Create),
 * který je odvozený z obecných `General*` komponent.
 *
 * Účel wrapperu:
 * - nastaví výchozí oprávnění (RBAC) přes `permissions` (`oneOfRoles`, `mode`)
 * - nastaví výchozí mutaci pro vytvoření entity (`mutationAsyncAction`)
 * - umožní vyměnit dialog a obsah formuláře (`CreateDialog`, `DefaultContent`)
 * - určí kam se má po úspěšném vytvoření navigovat (`readItemURI`)
 * - předá výchozí `item` pro nový záznam
 *
 * Zobrazí tlačítko a po jeho stisku otevře dialog, při volbě OK dochází k odeslání mutace na backend
 *
 * @param {Object} params
 * @param {Function} [params.mutationAsyncAction=MutationAsyncAction]
 * Async action (thunk) pro vytvoření entity (např. InsertAsyncAction). Používá ho Base/General logika.
 *
 * @param {React.ComponentType<Object>} [params.CreateDialog=CreateDialog]
 * Komponenta dialogu použitá pro vytvoření (renderuje formulář a volá `onOk(draft)` / `onCancel()`).
 *
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta, která vykreslí editable obsah formuláře (typicky MediumEditableContent).
 *
 * @param {string} [params.readItemURI=ReadItemURI]
 * URI pattern pro navigaci na detail nově vytvořené entity (obvykle obsahuje `:id`).
 *
 * @param {Object} [params.rbacitem]
 * RBAC item pro PermissionGate/Permission check (pokud se liší od entity, která se vytváří).
 *
 * @param {Object} [params.item=defaultitem]
 * Výchozí objekt (draft) pro nový záznam. Posílá se do dialogu jako `item`.
 *
 * @param {Object} params.props
 * Všechny další props jsou přeposlány přímo do `BaseCreateButton`
 * (typicky `children`, `className`, `disabled`, `title`, atd.).
 *
 * @returns {JSX.Element} Vykreslí `BaseCreateButton` s přednastavenými defaulty a RBAC oprávněními.
 */
// Definuje a exportuje komponentu CreateButton s kompletním výčtem destrukturalizovaných vlastností a výchozích nastavení
export const CreateButton = ({
    mutationAsyncAction = MutationAsyncAction, // Výchozí síťová mutace pro uložení dat
    CreateDialog: CreateDialog_ = CreateDialog, // Výchozí komponenta modálního dialogového okna
    DefaultContent: defaultContent = DefaultContent, // Výchozí komponenta vnitřního formuláře
    readItemURI = ReadItemURI, // Výchozí redirect URL po úspěšném uložení
    rbacitem, // Objekt pro volitelnou kontrolu přístupových práv
    item = defaultitem, // Výchozí prázdná datová struktura pro novou entitu
    ...props // Zbylé props pro HTML tlačítko (children, styl, třídy)
}) => {
    
    // Vrací základní tlačítko ze šablony nakonfigurované podle předaných parametrů a práv
    return (
        <BaseCreateButton 
            {...props} // Předává obecné vlastnosti jako id nebo className
            DefaultContent={defaultContent} // Registruje komponentu formuláře
            CreateDialog={CreateDialog_} // Registruje modal, který se po stisku otevře
            readItemURI={readItemURI} // Nastavuje cestu pro následné přesměrování
            rbacitem={rbacitem} // Dosazuje objekt pro ověření oprávnění
            item={item} // Posílá výchozí data (draft) do formuláře uvnitř dialogu
            mutationAsyncAction={mutationAsyncAction} // Předává asynchronní thunk/akci pro uložení
            {...permissions} // Rozbaluje roli administrátora do atributů komponenty pro PermissionGate
        />
    ); // Konec návratové hodnoty komponenty CreateButton
}; // Konec definice komponenty CreateButton

/**
 * Wrapper nad `BaseCreateDialog` (alias importu `CreateDialog` z Base/Mutations/Create),
 * který je odvozený z obecných `General*` komponent.
 *
 * Účel wrapperu:
 * - nastaví výchozí title, obsah formuláře a výchozí draft (`item`)
 * - předá `readItemURI` pro případnou navigaci po vytvoření (dle implementace Base/General)
 * - umožní přepsat `mutationAsyncAction` (pokud BaseCreateDialog mutaci používá)
 *
 * Mutaci provadi až tlačítko (`BaseCreateButton`) Dialog jen zobrazuje a zabezpecuje sber dat
 * a dialog je jen “formulář”. 
 *
 * @param {Object} params
 * @param {string} [params.title="Nov(ý/é)"]
 * Titulek dialogu.
 *
 * @param {Function} [params.mutationAsyncAction=MutationAsyncAction]
 * Async action (thunk) pro vytvoření entity. Použije se pouze pokud ho `BaseCreateDialog` skutečně volá
 * (záleží na Base/General implementaci).
 *
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta, která vykreslí editable obsah formuláře (typicky MediumEditableContent).
 *
 * @param {string} [params.readItemURI=ReadItemURI]
 * URI pattern pro navigaci na detail nově vytvořené entity (obvykle obsahuje `:id`).
 *
 * @param {Object} [params.item=defaultitem]
 * Výchozí objekt (draft) pro nový záznam. Posílá se do dialogu jako `item`.
 *
 * @param {Object} params.props
 * Všechny další props jsou přeposlány přímo do `BaseCreateDialog`
 * (typicky `oklabel`, `cancellabel`, `onOk`, `onCancel`, `className`, atd.).
 *
 * @returns {JSX.Element} Vykreslí `BaseCreateDialog` s přednastavenými defaulty.
 */
// Definuje a exportuje komponentu CreateDialog, která reprezentuje samotné vyskakovací okno s formulářem
export const CreateDialog = ({
    title = "Nov(ý/é)", // Výchozí text nadpisu v záhlaví modalu
    // mutationAsyncAction=MutationAsyncAction, // Zakomentovaná volitelná asynchronní akce
    DefaultContent: defaultContent = DefaultContent, // Výchozí interní formulářová pole
    readItemURI = ReadItemURI, // Výchozí URI adresa pro detail záznamu
    item = defaultitem, // Výchozí data položky
    ...props // Ostatní props (např. callbacky onOk a onCancel spravované nadřazeným tlačítkem)
}) => {
    
    // Vrací základní dialogové okno s dosazenými výchozími parametry
    return (
        <BaseCreateDialog 
            {...props} // Předává standardní parametry a event handlery ze šablony
            title={title} // Nastavuje titulek okna
            DefaultContent={defaultContent} // Vkládá editační komponentu (formulář) jako obsah modalu
            readItemURI={readItemURI} // Předává informaci o cílové redirect URI
            item={item} // Předává výchozí draft položky
            // mutationAsyncAction={mutationAsyncAction} // Zakomentované předávání mutace do dialogu
        />
    ); // Konec návratové hodnoty komponenty CreateDialog
}; // Konec definice komponenty CreateDialog

/**
 * Wrapper nad `BaseCreateBody` (alias importu `CreateBody` z Base/Mutations/Create),
 * který je odvozený z obecných `General*` komponent.
 *
 * `CreateBody` typicky reprezentuje “page-level” create workflow (ne jen tlačítko + modal):
 * - vykreslí create formulář pomocí `DefaultContent`
 * - zajistí uložení přes `mutationAsyncAction` (dle Base/General implementace)
 * - po úspěchu může navigovat na detail vytvořené entity přes `readItemURI` (pokud Base/General takto funguje)
 *
 * Wrapper pouze nastavuje defaulty a přeposílá props do `BaseCreateBody`.
 * * Vizualizuje <DefaultContent />, sbira zmeny a umoznuje volani backendu pro ulozeni dat
 *
 * @param {Object} params
 * @param {Function} [params.mutationAsyncAction=MutationAsyncAction]
 * Async action (thunk) pro vytvoření entity (např. InsertAsyncAction). Používá ho Base/General logika.
 *
 * @param {React.ComponentType<Object>} [params.DefaultContent=DefaultContent]
 * Komponenta, která vykreslí editable obsah formuláře (typicky MediumEditableContent).
 *
 * @param {string} [params.readItemURI=ReadItemURI]
 * URI pattern pro navigaci na detail nově vytvořené entity (obvykle obsahuje `:id`).
 *
 * @param {Object} params.props
 * Všechny další props jsou přeposlány přímo do `BaseCreateBody`
 * (typicky `title`, `oklabel`, `cancellabel`, `onOk`, `onCancel`, `className`, atd.).
 *
 * @returns {JSX.Element} Vykreslí `BaseCreateBody` s přednastavenými defaulty.
 */
// Definuje a exportuje komponentu CreateBody pro celostránkový (inline) editační a vytvářecí layout
export const CreateBody = ({
    mutationAsyncAction = MutationAsyncAction, // Výchozí asynchronní akce uložení
    DefaultContent: defaultContent = DefaultContent, // Výchozí render formulářových inputů
    readItemURI = ReadItemURI, // Výchozí URI schéma pro následné přesměrování
    ...props // Zachycuje ostatní vlastnosti, jako jsou texty potvrzovacích tlačítek na stránce
}) => {
    
    // Vrací základní celostránkový editační kontejner s namapovanými výchozími akcemi a strukturami
    return (
        <BaseCreateBody 
            {...props} // Předává zbylé klientské vlastnosti komponentě
            DefaultContent={defaultContent} // Vkládá formulář přímo do těla stránky
            readItemURI={readItemURI} // Poskytuje adresu pro směrování po úspěšném odeslání formuláře
            mutationAsyncAction={mutationAsyncAction} // Předává akci, která se zavolá při submitu formuláře
        />
    ); // Konec návratové hodnoty komponenty CreateBody
}; // Konec definice komponenty CreateBody