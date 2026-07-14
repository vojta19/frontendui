/**
 * Creates a mutation URI from a read/view URI.
 *
 * The function replaces the `/view` segment in the supplied URI with the
 * specified mutation action (for example `update`, `delete` or `create`).
 * Optionally, it appends the `:id` route parameter to produce a route
 * definition suitable for React Router.
 *
 * @param {string} linkURI
 * Source URI containing the `/view` segment.
 *
 * @param {string} action
 * Mutation action that replaces the `/view` segment.
 *
 * @param {Object} [options]
 * Additional configuration options.
 *
 * @param {boolean} [options.withId=false]
 * When `true`, appends the `:id` route parameter to the generated URI.
 *
 * @returns {string}
 * Generated mutation URI.
 *
 * @throws {Error}
 * Thrown when `linkURI` does not contain the `/view` segment.
 *
 * @example
 * makeMutationURI("/finance/view", "update");
 * // "/finance/update"
 *
 * @example
 * makeMutationURI("/finance/view", "delete", { withId: true });
 * // "/finance/delete/:id"
 */
// Definuje a exportuje čistou funkci makeMutationURI pro transformaci klientských URL/URI adres na mutační API cesty
export const makeMutationURI = (linkURI, action, { withId = false } = {}) => {
    
    // Vytváří regulární výraz, který bezpečně hledá segment "/view" buď na konci řetězce, nebo jako součást cesty s lomítkem
    const viewSegmentRe = /\/view(\/|$)/;
    
    // Podmínka: Pokud vstupní linkURI neobsahuje klíčové slovo "/view", vyhodí vývojovou chybu s detailním popisem
    if (!viewSegmentRe.test(linkURI)) throw new Error(`LinkURI must contain '/view'. Got: ${linkURI}`);

    // Nahrazuje segment "/view" novou požadovanou akcí (např. "edit", "delete") a zajišťuje, že adresa bude končit jedním lomítkem
    const base = linkURI.replace(viewSegmentRe, `/${action}$1`).replace(/\/?$/, "/");
    
    // Vrací výslednou URL; pokud je požadováno ID (withId), připojí parametr ":id", jinak odstraní koncové lomítko pro čisté URI
    return withId ? `${base}:id` : base.replace(/\/$/, "");
}; // Konec definice funkce makeMutationURI