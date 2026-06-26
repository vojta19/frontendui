// Importuje tvůrce asynchronních GraphQL akcí a hook pro správu dotazů ze sdíleného balíčku @hrbolek/uoisfrontend-gql-shared
import { createAsyncGraphQLAction, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje komponenty pro vykreslení chyb a indikátoru načítání ze sdíleného balíčku @hrbolek/uoisfrontend-shared
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * A component for displaying the `scalar` attribute of an template entity.
 *
 * This component checks if the `scalar` attribute exists on the `template` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the TemplateScalarAttribute component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {*} [props.template.scalar] - The scalar attribute of the template entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const templateEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <TemplateScalarAttribute template={templateEntity} />
 */
// Definuje a exportuje komponentu TemplateScalarAttribute pro statické zobrazení detailu skalární relace
export const TemplateScalarAttribute = ({ template }) => {
    
    // Destrukturalizací bezpečně vytáhne vlastnost scalar ze zadaného objektu šablony
    const { scalar } = template;
    
    // Podmínka: Pokud je vlastnost scalar zcela nedefinovaná (undefined), komponenta nic nevykreslí
    if (typeof scalar === 'undefined') return null;
    
    // Vrací JSX fragment obsahující textový náhled a formátovaný JSON výpis objektu
    return (
        <>
            {/* PŮVODNÍ ZAKOMENTOVANÝ KÓD: <ScalarMediumCard scalar={scalar} /> */}
            {/* PŮVODNÍ ZAKOMENTOVANÝ KÓD: <ScalarLink scalar={scalar} /> */}
            
            {/* Vykresluje textový řetězec informující o chybějící sub-komponentě */}
            Probably {'<ScalarMediumCard scalar={scalar} />'} <br />
            
            {/* Vykresluje lidsky čitelnou podobu JSON struktury objektu scalar se čtyřmi mezerami odsazení */}
            <pre>{JSON.stringify(scalar, null, 4)}</pre>
        </>
    ); // Konec návratové hodnoty JSX fragmentu
}; // Konec definice komponenty TemplateScalarAttribute

// Definuje řetězec čistého GraphQL dotazu (Query) pro stažení skalárního objektu podle ID mateřské entity
const TemplateScalarAttributeQuery = `
query TemplateQueryRead($id: UUID!) {
    result: templateById(id: $id) {
        __typename
        id
        scalar {
            __typename
            id
        }
    }
}
`; // Konec definice GraphQL dotazu

// Vytváří a přiřazuje asynchronní síťovou akci (thunk) pro provádění GraphQL operace na základě definovaného dotazu
const TemplateScalarAttributeAsyncAction = createAsyncGraphQLAction(
    TemplateScalarAttributeQuery
); // Konec inicializace akce

/**
 * A lazy-loading component for displaying filtered `scalar` from a `template` entity.
 *
 * This component uses the `TemplateScalarAttributeAsyncAction` to asynchronously fetch
 * the `template.scalar` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each vector item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.template - The template entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `scalar` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered scalar or a loading/error placeholder.
 *
 * @example
 * <TemplateScalarAttributeLazy template={{ id: "abc123" }} />
 *
 * * @example
 * <TemplateScalarAttributeLazy
 * template={{ id: "abc123" }}
 * filter={(v) => v.status === "active"}
 * />
 */
// Definuje a exportuje komponentu TemplateScalarAttributeLazy, která automaticky spouští a řídí síťový dotaz při svém mountu
export const TemplateScalarAttributeLazy = ({ template }) => {
    
    // Inicializuje hook useAsyncAction pro automatickou správu stavů loading, error, dat (entity) a spouštěcí funkce (fetch)
    const { loading, error, entity, fetch } = useAsyncAction(TemplateScalarAttributeAsyncAction, template);

    // Podmínka: Pokud síťové stahování dat z backendu stále probíhá, vrátí komponentu načítacího spinneru
    if (loading) return <LoadingSpinner />;
    
    // Podmínka: Pokud během GraphQL dotazu nastala chyba, předá pole chyb komponentě ErrorHandler pro zobrazení uživateli
    if (error) return <ErrorHandler errors={error} />;

    // Po úspěšném dokončení dotazu vyrenderuje standardní zobrazení a předá mu stažená data (entity) z kontextu dotazu
    return <TemplateScalarAttribute template={entity} />;    
}; // Konec definice komponenty TemplateScalarAttributeLazy