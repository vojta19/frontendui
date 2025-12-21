import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useGQLClient } from "../Store";

const mergeArraysById = (array1 = [], array2 = []) => {
    const mergedMap = new Map();
    array1.forEach((item) => item?.id != null && mergedMap.set(item.id, item));
    array2.forEach((item) => item?.id != null && mergedMap.set(item.id, item));
    return Array.from(mergedMap.values());
};

const defaultCalculateNewFilter = (oldfilter) => {
    const newFilter = ({
        ...oldfilter,
        skip: (oldfilter.skip || 0) + (oldfilter.limit || 10),
        limit: oldfilter.limit || 10,
    });
    console.log("newFilter", newFilter)
    return newFilter
}

const extractArrayFromThunkResult = (thunkResult) => {
    // očekáváš { data: { something: [...] } } nebo podobně
    const root = thunkResult?.data ? thunkResult.data : thunkResult;
    const values = root ? Object.values(root) : [];

    // 1) přímo první hodnota
    let candidate = values?.[0];
    if (Array.isArray(candidate)) return candidate;

    // 2) najdi první pole uvnitř
    candidate = values.find((v) => Array.isArray(v));
    if (Array.isArray(candidate)) return candidate;

    // 3) fallback
    return [];
};

const isVisibleInViewport = (node) => {
    if (!node) return false;
    const r = node.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
};

const dummy = () => null;
/**
 * useInfiniteScroll
 *
 * @param {Object} args
 * @param {Array<Object>} [args.preloadedItems]
 * @param {Object} args.actionParams  - { skip, limit, ... }
 * @param {(params:any)=>any} args.asyncAction - redux thunk (dispatch(asyncAction(params)))
 * @param {(oldFilter:any)=>any} [args.calculateNewFilter]
 * @param {number} [args.reset] - změna hodnoty provede reset stránkování (např. filtr změněn)
 * @param {()=>void} [args.onAll] - zavolá se, když už není co načítat
 * @param {boolean} [args.enabled] - možnost scroll vypnout
 */
export const useInfiniteScroll = ({
    preloadedItems,
    actionParams,
    asyncAction,
    calculateNewFilter = defaultCalculateNewFilter,
    reset = 0,
    onAll = dummy,
    enabled = true,
    autoload = true,
} = {}) => {
    const dispatch = useDispatch();
    const gqlClient = useGQLClient();

    const initialFilter = useMemo(() => ({ ...(actionParams || {}) }), [actionParams]);

    const [state, setState] = useState(() => ({
        filter: initialFilter,
        loading: false,
        hasMore: true,
        error: null,
        items: preloadedItems,
        result: null,
    }));

    // refs pro stabilní přístup v async kódu
    const stateRef = useRef(state);
    useEffect(() => { stateRef.current = state; }, [state]);

    const filterRef = useRef(initialFilter);
    useEffect(() => { filterRef.current = state.filter; }, [state.filter]);

    const enabledRef = useRef(enabled);
    useEffect(() => { enabledRef.current = enabled; }, [enabled]);

    // preloaded items update
    useEffect(() => {
        setState((prev) => ({ ...prev, items: preloadedItems }));
    }, [preloadedItems]);

    // reset
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            filter: { ...(actionParams || {}) },
            loading: false,
            hasMore: true,
            error: null,
            // dle potřeby: items: []
            items: prev.items,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);

    const loadMore = useCallback(async () => {
        if (!enabledRef.current) return null;

        const snap = stateRef.current;
        if (snap.loading || !snap.hasMore) return null;

        setState((prev) => ({ ...prev, loading: true, error: null }));

        const params = filterRef.current;

        try {
            console.log("calling with", params)
            const result = await dispatch(asyncAction(params, gqlClient));
            const fetched = extractArrayFromThunkResult(result);

            setState((prev) => {
                const nextItems = mergeArraysById(prev.items, fetched);
                const limit = params?.limit;

                if (limit == null) {
                    const hasMore = fetched.length > 0;
                    if (!hasMore) onAll();
                    return {
                        ...prev,
                        items: nextItems,
                        filter: hasMore ? calculateNewFilter(prev.filter) : prev.filter,
                        hasMore,
                        loading: false,
                        result,
                    };
                }

                const hasMore = fetched.length === limit;
                if (!hasMore) onAll();

                return {
                    ...prev,
                    items: nextItems,
                    filter: hasMore ? calculateNewFilter(prev.filter) : prev.filter,
                    hasMore,
                    loading: false,
                    result,
                };
            });

            return result;
        } catch (e) {
            setState((prev) => ({
                ...prev,
                loading: false,
                hasMore: false,
                error: e,
            }));
            return null;
        }
    }, [dispatch, asyncAction, gqlClient, calculateNewFilter, onAll]);

    // sentinel node
    const sentinelNodeRef = useRef(null);
    const sentinelRef = useCallback((node) => {
        sentinelNodeRef.current = node;
    }, []);

    // IO + robustní "prefill", když je sentinel už vidět
    useEffect(() => {
        const node = sentinelNodeRef.current;
        if (!enabled || !node) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && enabledRef.current) {
                loadMore();
            }
        });

        observer.observe(node);

        let cancelled = false;

        const prefill = async () => {
            if (!autoload) return;

            // nech doběhnout layout
            await new Promise((r) => requestAnimationFrame(r));
            await new Promise((r) => setTimeout(r, 0));

            // pokud je sentinel už vidět, načítej dokud se neodsune mimo viewport nebo není hasMore
            while (!cancelled && enabledRef.current) {
                const s = stateRef.current;
                if (s.loading || !s.hasMore) break;

                if (!isVisibleInViewport(node)) break;

                await loadMore();

                // render tick
                await new Promise((r) => requestAnimationFrame(r));
            }
        };

        prefill();

        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [enabled, autoload, loadMore, reset]);

    return {
        items: state.items,
        loading: state.loading,
        error: state.error,
        hasMore: state.hasMore,
        filter: state.filter,
        result: state.result,

        loadMore,
        sentinelRef,
    };
};