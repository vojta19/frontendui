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