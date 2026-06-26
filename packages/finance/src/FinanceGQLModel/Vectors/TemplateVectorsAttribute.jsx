// Importuje hook useEffect z knihovny React pro řízení vedlejších účinků komponenty
import { useEffect } from "react";

// Importuje komponentu Col pro mřížkový systém z knihovny react-bootstrap
import { Col } from "react-bootstrap";

// Importuje asynchronní akce, tvůrce GraphQL operací a procesory odpovědí ze sdíleného GraphQL balíčku
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje komponenty pro zpracování chyb, infinite scroll a indikátor načítání ze sdíleného balíčku prvků
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * Inserts a VectorGQLModel item into a template’s vectors array and dispatches an update.
 *
 * @param {Object} template - The current template object containing a `vectors` array.
 * @param {Object} vectorItem - The item to insert; must have `__typename === "VectorGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
// Pomocná funkce pro vložení nové vektorové položky do lokálního Redux/stavového stromu šablony
const followUpTemplateVectorItemInsert = (template, vectorItem, dispatch) => {
    
    // Vytahuje vlastnost __typename z vkládaného objektu
    const { __typename } = vectorItem;
    
    // Podmínka: Akce se provede pouze v případě, že se jedná o validní datový typ VectorGQLModel
    if (__typename === "VectorGQLModel") {
        
        // Destrukturalizuje původní šablonu - oddělí pole vectors a zbytek vlastností (others)
        const { vectors, ...others } = template;
        
        // Vytváří nové pole, do kterého rozbalí původní položky a na konec přidá nový objekt vectorItem
        const newTemplateVectorItems = [...vectors, vectorItem];
        
        // Sestaví nový objekt šablony kombinací ostatních vlastností a nově aktualizovaného pole prvků
        const newTemplate = { ...others, vectors: newTemplateVectorItems };
        
        // Vyvolá dispatch akce pro aktualizaci stavu aplikace s novým objektem šablony
        dispatch(ItemActions.item_update(newTemplate));
    } // Konec podmínky pro typ VectorGQLModel
}; // Konec definice funkce followUpTemplateVectorItemInsert

/**
 * Replaces an existing VectorGQLModel item in a template’s vectors array and dispatches an update.
 *
 * @param {Object} template - The current template object containing a `vectors` array.
 * @param {Object} vectorItem - The updated item; must have `__typename === "VectorGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
// Pomocná funkce pro aktualizaci a nahrazení stávajícího prvku novými daty uvnitř stavu šablony
const followUpTemplateVectorItemUpdate = (template, vectorItem, dispatch) => {
    
    // Vytahuje typ z aktualizovaného objektu
    const { __typename } = vectorItem;
    
    // Kontrola: Provádí se pouze pro správný GraphQL model typu VectorGQLModel
    if (__typename === "VectorGQLModel") {
        
        // Oddělí pole prvků od zbytku kontextu šablony
        const { vectors, ...others } = template;
        
        // Pomocí metody map projde pole a nahradí položku se shodným ID novým objektem vectorItem, ostatní nechá beze změny
        const newTemplateVectorItems = vectors.map(item =>
            item.id === vectorItem.id ? vectorItem : item
        ); // Konec mapování pole

        // Sestaví kompletní upravenou šablonu
        const newTemplate = { ...others, vectors: newTemplateVectorItems };
        
        // Odešle aktualizovaný stav do dispečera aplikace
        dispatch(ItemActions.item_update(newTemplate));
    } // Konec podmínky typu
}; // Konec definice funkce followUpTemplateVectorItemUpdate

/**
 * Removes a VectorGQLModel item from a template’s vectors array by its `id` and dispatches an update.
 *
 * @param {Object} template - The current template object containing a `vectors` array.
 * @param {Object} vectorItem - The item to delete; must have `__typename === "VectorGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
// Pomocná funkce pro odstranění vymazané položky z lokálního stavového pole prvků šablony
const followUpTemplateVectorItemDelete = (template, vectorItem, dispatch) => {
    
    // Vytahuje typ z mazaného objektu
    const { __typename } = vectorItem;
    
    // Kontrola validity datového typu před samotným vymazáním
    if (__typename === "VectorGQLModel") {
        
        // Oddělí pole prvků vectors od ostatních meta-dat šablony
        const { vectors, ...others } = template;
        
        // Pomocí metody filter vytvoří nové pole neobsahující položku s ID určeným ke smazání
        const newTemplateVectorItems = vectors.filter(
            item => item.id !== vectorItem.id
        ); // Konec filtrace pole

        // Sestaví upravený cílový objekt šablony
        const newTemplate = { ...others, vectors: newTemplateVectorItems };
        
        // Vyvolá odeslání akce pro zaktualizování globálního stavu aplikace
        dispatch(ItemActions.item_update(newTemplate));
    } // Konec podmínky validace typu
}; // Konec definice funkce followUpTemplateVectorItemDelete

// Definuje čistý GraphQL dotaz pro načtení stránkovaných a filtrovaných položek pole vectors na základě ID šablony
const TemplateVectorsAttributeQuery = `
query TemplateQueryRead($id: UUID!, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: templateById(id: $id) {
        __typename
        id
        vectors(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...VectorMedium
        }
    }
}
`; // Konec definice GraphQL dotazu

// Vytváří a exportuje asynchronní GraphQL akci kombinací lazy dotazu a procesoru odpovědi mapovaného na klíč "vectors"
const TemplateVectorsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(TemplateVectorsAttributeQuery), // Vytvoří lazy načítaný řetězec dotazu (fragment zakomentován)
    processVectorAttributeFromGraphQLResult("vectors") // Zpracuje a vytáhne atribut "vectors" z výsledku GraphQL odpovědi
); // Konec inicializace akce

/**
 * A component for displaying the `vectors` attribute of a template entity.
 *
 * This component checks if the `vectors` attribute exists on the `template` object. If `vectors` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `vectors` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the TemplateVectorsAttribute component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {Array<Object>} [props.template.vectors] - An array of vector items associated with the template entity.
 * Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the vectors array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `vectors` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const templateEntity = { 
 * vectors: [
 * { id: 1, name: "Vector Item 1" }, 
 * { id: 2, name: "Vector Item 2" }
 * ] 
 * };
 * <TemplateVectorsAttribute template={templateEntity} />
 *
 * @example
 * // With a custom filter:
 * <TemplateVectorsAttribute 
 * template={templateEntity}
 * filter={vector => vector.name.includes("1")}
 * />
 */
// Definuje starší verzi komponenty pro statické vykreslení pole prvků s definovaným vizualizérem
export const TemplateVectorsAttribute_old = ({ template, filter = Boolean, Visualiser = TrivialVisualiserDiv }) => {
    
    // Vytahuje pole prvků z objektu pod aliasem unfiltered
    const { vectors: unfiltered } = template;
    
    // Pokud je vlastnost v objektu zcela nedefinovaná, komponenta nic nevykreslí (vrátí null)
    if (typeof unfiltered === 'undefined') return null;
    
    // Aplikuje předanou filtrační funkci na surové pole prvků
    const vectors = unfiltered.filter(filter);
    
    // Pokud po filtraci nezůstaly žádné prvky k zobrazení, vrací null
    if (vectors.length === 0) return null;
    
    // Vrací fragment obsahující namapované prvky pro zadanou vizualizační komponentu
    return (
        <>
            {/* Prochází pole profiltrovaných prvků a pro každý vykreslí Visualiser s unikátním klíčem */}
            {vectors.map(
                vector => <Visualiser id={vector.id} key={vector.id} vector={vector} />
            )}
        </>
    ); // Konec návratové hodnoty fragmentu
}; // Konec definice komponenty TemplateVectorsAttribute_old

/**
 * Visualiser component for displaying a list of vector items using `TemplateVectorsAttribute`.
 *
 * Wraps the `TemplateVectorsAttribute` component, passing the given `items` as the `vectors` attribute
 * on a synthetic `template` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of vector items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `TemplateVectorsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of vectors or `null` if none are provided.
 *
 * @example
 * <VectorsVisualiser
 * items={[
 * { id: 1, name: "Vector 1" },
 * { id: 2, name: "Vector 2" }
 * ]}
 * filter={v => v.name.includes("1")}
 * />
 */
// Pomocná komponenta pro transformaci pole prvků na syntetický objekt vyžadovaný starou verzí atributu
const VectorsVisualiser = ({ items, ...props }) => 
    <TemplateVectorsAttribute_old {...props} template={{ vectors: items }} />; // Vytvoří umělou strukturu a přeposílá props

/**
 * Infinite-scrolling component for the `vectors` attribute of a template entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `vectors` array
 * associated with the provided `template` object. It utilizes `VectorsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.template - The template entity containing the `vectors` array.
 * @param {Array<Object>} [props.template.vectors] - (Optional) Preloaded vector items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `VectorsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of vectors.
 *
 * @example
 * <TemplateVectorsAttributeInfinite
 * template={{
 * vectors: [
 * { id: 1, name: "Vector 1" },
 * { id: 2, name: "Vector 2" }
 * ]
 * }}
 * />
 */
// Definuje a exportuje komponentu pro nekonečné scrollování a automatické stránkování prvků z GraphQL
export const TemplateVectorsAttributeInfinite = ({ template, actionParams = {}, ...props }) => { 
    
    // Vytahuje přednačtené položky z objektu šablony
    const { vectors } = template;

    // Vrací nakonfigurovanou komponentu InfiniteScroll zajišťující lazy-loading na pozadí
    return (
        <InfiniteScroll 
            {...props} // Předává ostatní styly a konfigurace scrollu
            Visualiser={VectorsVisualiser} // Přiřazuje dříve definovaný wrapper seznamu jako vizualizér
            preloadedItems={vectors} // Dosazuje výchozí sadu přednačtených dat
            actionParams={{ ...actionParams, skip: 0, limit: 10 }} // Nastavuje výchozí offset a limit pro stránku
            asyncAction={TemplateVectorsAttributeAsyncAction} // Přiřazuje síťovou asynchronní akci dotazu
        />
    ); // Konec návratové hodnoty komponenty InfiniteScroll
}; // Konec definice komponenty TemplateVectorsAttributeInfinite

/**
 * A lazy-loading component for displaying filtered `vectors` from a `template` entity.
 *
 * This component uses the `TemplateVectorsAttributeAsyncAction` to asynchronously fetch
 * the `template.vectors` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.template - The template entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `vectors` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered vectors or a loading/error placeholder.
 *
 * @example
 * <TemplateVectorsAttributeLazy template={{ id: "abc123" }} />
 *
 * * @example
 * <TemplateVectorsAttributeLazy
 * template={{ id: "abc123" }}
 * filter={(v) => v.status === "active"}
 * />
 */
// Definuje a exportuje komponentu, která spouští síťový dotaz až při svém zobrazení (lazy-loading)
export const TemplateVectorsAttributeLazy = ({ template, filter = Boolean, ...props }) => {
    
    // Inicializuje hook useAsyncAction pro automatickou správu stavu dotazu v odloženém režimu
    const { loading, error, entity, fetch } = useAsyncAction(TemplateVectorsAttributeAsyncAction, template, { deferred: true });
    
    // Vyvolá síťové stažení dat pokaždé, když se změní identifikační parametry šablony (template)
    useEffect(() => {
        fetch(template); // Spustí fetch s novými parametry
    }, [template]); // Sleduje změny objektu template

    // Podmínka: Pokud síťový dotaz probíhá, zobrazí načítací spinner
    if (loading) return <LoadingSpinner />;
    
    // Podmínka: Pokud síťový dotaz selhal, předá pole chyb komponentě ErrorHandler
    if (error) return <ErrorHandler errors={error} />;

    // Po úspěšném načtení dat vrátí statické vykreslení s předáním stažené entity a filtru
    return <TemplateVectorsAttribute_old template={entity} filter={filter} {...props} />;    
}; // Konec definice komponenty TemplateVectorsAttributeLazy

// Pomocná triviální komponenta pro zobrazení JSON dumpu a informativního textu o chybějící střední kartě
const TrivialVisualiserDiv = ({ vector, children }) => (
    <div>
        Probably {'<VectorMediumCard vector={vector} />'} <br />
        {/* Formátuje a vypisuje surový objekt vektoru se čtyřmi mezerami odsazení */}
        <pre>{JSON.stringify(vector, null, 4)}</pre>
        {/* Vykresluje případné vnořené prvky */}
        {children}
    </div>
); // Konec definice TrivialVisualiserDiv

/**
 * Component to render the filtered `vectors` attribute of a template entity.
 *
 * Applies an optional filter function to the vectors array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.template - The template entity containing the `vectors` array.
 * @param {Array<object>} [props.template.vectors] - Array of vector items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each vector item.
 * Receives `vector` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 * This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on vectors before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no vectors.
 *
 * @example
 * <TemplateVectorsAttribute
 * template={template}
 * Visualiser={VectorMediumCard}
 * Layout={Col}
 * filter={(v) => v.active}
 * infinite={true}
 * />
 */
// Definuje a exportuje univerzální komponentu, která sdružuje jak statické mapování mřížky, tak přepnutí do infinite scroll režimu
export const TemplateVectorsAttribute = ({
    template, // Vstupní objekt entity
    Visualiser = TrivialVisualiserDiv, // Komponenta pro render detailu jednoho vektoru
    infinite = true, // Příznak zapnutí nekonečného scrollování (výchozí true)
    Layout = Col, // Obalový prvek rozvržení buňky (výchozí sloupec mřížky Col)
    filter = Boolean, // Filtrační funkce prvků před vykreslením
    ...props // Přebírané doplňkové parametry
}) => {

    // Vytáhne pole prvků z objektu šablony pod aliasem unfiltered
    const { vectors: unfiltered } = template;
    
    // Pokud pole prvků v objektu vůbec neexistuje, komponenta nic nevykreslí (vrátí null)
    if (typeof unfiltered === 'undefined') return null;
    
    // Vyfiltruje surové pole prvků pomocí zadané filtrační funkce
    const vectors = unfiltered.filter(filter);
    
    // Pokud po filtraci pole neobsahuje žádné prvky, vrací null
    if (vectors.length === 0) return null;

    // Větvení: Pokud je zapnutý režim infinite scroll, sestaví se rekurzivní wrapper nad InfiniteScroll komponentou
    if (infinite) {
        
        // Vnitřní pomocná komponenta sloužící jako adaptér pro předání pole nově načtených položek zpět do této univerzální komponenty s potlačením nekonečného smyčkování (infinite={false})
        const VisualiserWrapper = ({ items }) => ( 
            <TemplateVectorsAttribute 
                {...props} // Přeposílá klientské props
                template={{ vectors: items }} // Sestaví syntetickou šablonu z nově dodaných prvků stránky
                Visualiser={Visualiser} // Předává originální vizualizér položky
                infinite={false} // Vypne vnitřní rekurzivní infinite větvit, aby se data vykreslila staticky jako mřížka
                Layout={Layout} // Zachovává nastavený layout buněk (např. Col)
                filter={filter} // Zachovává filtrační pravidlo
            />
        ); // Konec definice VisualiserWrapper

        // Vrací kompletní infinite scroll s navázaným wrapperem a počátečními parametry stránkování pro API dotaz
        return (
            <InfiniteScroll
                actionParams={{ ...template, skip: 0, limit: 10 }} // Nastavuje parametry GraphQL dotazu včetně počátečních mezí stránky
                asyncAction={TemplateVectorsAttributeAsyncAction} // Přiřazuje asynchronní thunk akci pro načítání dat
                {...props} // Propisuje doplňkové parametry konfigurace scrollu
                Visualiser={VisualiserWrapper} // Registruje nově vytvořený buňkový adaptér
                preloadedItems={vectors} // Dosahuje aktuální profiltrované položky jako základ první stránky
            />
        ); // Konec návratu infinite scrollu
    } // Konec podmínky pro infinite scroll

    // Statický režim (infinite === false): Standardní vykreslení pomocí procházení prvků pole metodou .map()
    return (
        <>
            {/* Prochází pole prvků a každý prvek zabalí do komponenty specifikované v Layout s unikátním React klíčem */}
            {vectors.map((vector) => (
                <Layout key={vector.id}>
                    {/* Pokud objekt vektoru existuje, vyrenderuje pro něj Visualiser se zbylými parametry */}
                    {vector && <Visualiser {...props} vector={vector} />}
                </Layout>
            ))}
        </>
    ); // Konec návratu statického JSX rozvržení
}; // Konec definice univerzální komponenty TemplateVectorsAttribute