// updateItemsFromGraphQLResult.js
import { data } from "react-router-dom";
import { ItemActions } from "../ItemSlice";

/**
 * Rekurzivně vyhledá v JSON stromu všechny objekty s `id`
 * a vrátí je v poli. Při nálezu objektu s `id` **vyžaduje**
 * přítomnost `__typename` – jinak hodí chybu.
 *
 * @param {any} node
 * @param {Array<Object>} acc
 * @returns {Array<Object>}
 */
const collectEntities = (node, acc = [], level) => {
    if (!node || typeof node !== "object") {
        return acc;
    }

    if (Array.isArray(node)) {
        for (const item of node) {
            collectEntities(item, acc, level+1);
        }
        return acc;
    }

    // Objekt
    // if (node.id != null) {
        if (true) {
        // console.log("node", level, node)
        if (level === 1) {
            if (!node.__typename) {
                if (node.id != null) 
                    // "assert" – fail fast, protože bez __typename se ti to rozbije všude jinde
                    // (error boundary / log si uděláš podle sebe)
                    // Můžeš změnit na `console.error` + return, pokud nechceš shazovat celý request.
                    throw new Error(
                        `GraphQL entity with id='${node.id}' is missing __typename. ` +
                        `Add __typename to your query/fragment, otherwise normalizace nebude fungovat.`
                    );           
            } else {
                // console.log("node", node)
                const __typename = node?.__typename || ""
                if (__typename.endsWith("Error")) {
                    const err = Error(`Požadavek vrátil řízený chybový stav\n${JSON.stringify(node, null, 2)}`)
                    err.errors = node
                    throw err
                    // console.log("Error", node)
                }
            }
        }
        
        acc.push(node);
    }

    for (const value of Object.values(node)) {
        collectEntities(value, acc, level+1);
    }

    return acc;
};


export const ItemsFromGraphQLResultFactory = (ItemAction = ItemActions.item_update) => (result) => async (
    dispatch,
    getState,
    next
) => {
    // Podporujeme jak raw {data, errors}, tak případ, kdy client vrací jen data.
    const dataRoot =
        result && typeof result === "object" && "data" in result && result.data != null
            ? result.data
            : result;

    if (dataRoot && typeof dataRoot === "object") {

        let entities = [];
        try {
            entities = collectEntities(dataRoot, [], 0);
        } catch (err) {
            // Tady máš tvrdý assert na __typename – můžeš případně logovat nebo dispatchnout error akci
            console.error("ItemsFromGraphQLResult: normalization failed", err);
            // Volitelně:
            // dispatch({ type: "ITEMS_NORMALIZATION_ERROR", payload: String(err) });
            throw err;
        }

        // Normalizace do ItemSlice – každá entita jde přes item_add (upsert)
        dispatch(ItemAction(entities));
        // for (const entity of entities) {
        //     // dispatch(ItemActions.item_add(entity));
        //     dispatch(ItemAction(entity));
        // }
    }

    // Předáme výsledek dál v chainu (např. do dalšího middleware nebo volajícího)
    return next(result);
};

/**
 * Z GraphQL response (raw {data, errors} nebo přímo { ...data }) vytáhne
 * všechny entitní objekty (s `id` a `__typename`) a:
 *  - pro každý `dispatch(ItemActions.item_add(entity))`
 *  - předá původní `result` dál do chainu
 *
 * Použití:
 *   createAsyncGraphQLAction2(queryStr, updateItemsFromGraphQLResult)
 *
 * @param {any} result - GraphQL výsledek (buď { data, errors } nebo jen { ...data })
 * @returns {(dispatch: Function, getState: Function, next: Function) => Promise<any>}
 */
export const updateItemsFromGraphQLResult = ItemsFromGraphQLResultFactory();

export const addItemsFromGraphQLResult = ItemsFromGraphQLResultFactory(ItemActions.item_add);
