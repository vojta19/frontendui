// useAsyncThunkAction.js
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectItemById } from "../Store/ItemSlice"; // uprav cestu
import { useGQLClient } from "../Store";

// jednoduchý shallowEqual pro porovnání vars
const shallowEqual = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) {
        if (a[k] !== b[k]) return false;
    }
    return true;
};



const useAsyncThunkActionFactory = (useDispatchHook, useSelectorHook) => 
(
    AsyncAction,
    vars,
    options = {}
) => {
    const { deferred = false, network = true } = options;
    const dispatch = useDispatchHook();
    const gqlClient = useGQLClient();

    // stabilizovaná verze vars (aby každé nové {} nebo {id} neznamenalo novou fetch smyčku)
    const [varsState, setVarsState] = useState(vars || {});

    useEffect(() => {
        const nextVars = vars || {};
        if (!shallowEqual(nextVars, varsState)) {
            setVarsState(nextVars);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vars]);

    // základní stav hooku
    const [state, setState] = useState({
        loading: !deferred && network,
        error: null,
        data: null,
    });

    // když ve varsState existuje id, přečteme entitu z ItemSlice
    const id = varsState && varsState.id;
    const entity = useSelectorHook((rootState) => {
        const result = id != null ? selectItemById(rootState, id) : null
        // console.log(id, rootState, result)
        // console.log("useSelectorHook found", id, result)
        return result
    });

    const run = useCallback(
        (overrideVars) => {
            // console.log("run.overrideVars", overrideVars, AsyncAction)

            if (!network || !AsyncAction) {
                return Promise.resolve(null);
            }

            const mergedVars =
                overrideVars === undefined
                    ? varsState
                    : { ...(varsState || {}), ...overrideVars };

            setState((prev) => ({
                ...prev,
                loading: true,
                error: null,
            }));
            // console.log("useAsyncThunkAction run", AsyncAction?.name, overrideVars, '=>', mergedVars);
            return dispatch(AsyncAction(mergedVars, gqlClient))
                .then((result) => {
                    setState({
                        loading: false,
                        error: null,
                        data: result,
                    });
                    return result;
                })
                .catch((err) => {
                    setState({
                        loading: false,
                        error: err,
                        data: null,
                    });
                    throw err;
                });
        },
        [AsyncAction, gqlClient, dispatch, network, varsState]
    );

    // auto-fetch na mount / změnu varsState (ale ne při každém renderu díky shallowEqual)
    useEffect(() => {
        if (!deferred && network) {
            run();
        }
    }, [deferred, network, run]);

    return {
        loading: state.loading,
        error: state.error,
        data: state.data,
        entity, // item z ItemSlice, pokud máme id
        run,
    };
};

/**
 * Vytvoří "lokální" dispatch pro thunk akce, bez Redux storu.
 *
 * @param {() => any} [getState]  - funkce, která vrací "stav" (default prázdný objekt)
 * @param {any} [extra]           - volitelný extraArg pro thunky (3. argument)
 *
 * @returns {(actionOrThunk: any) => Promise<any>}
 */
const createThunkDispatch = (getState = () => ({}), extra = undefined) => {
    // dispatch je rekurzivní, aby šlo z thunků volat dispatch znovu
    const dispatch = (actionOrThunk) => {
        // thunk: funkce (dispatch, getState, extra) => Promise/any
        if (typeof actionOrThunk === "function") {
            return Promise.resolve(actionOrThunk(dispatch, getState, extra));
        }

        // plain action (object, string, cokoliv) – tady s ním nic neděláme,
        // jen ho vrátíme zabalený v Promise, aby signatura seděla.
        return Promise.resolve(actionOrThunk);
    };

    return dispatch;
};

const mockDispatch = createThunkDispatch()
const useMockDispatch = () => mockDispatch;
const noOpSelector = () => null;

export const useAsyncThunkAction = useAsyncThunkActionFactory(useDispatch, useSelector)
export const useAsync = useAsyncThunkActionFactory(useMockDispatch, noOpSelector)

