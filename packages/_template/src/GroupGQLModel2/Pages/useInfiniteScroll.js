import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useGQLClient } from "../../../../dynamic/src/Store";

const mergeArraysById = (array1 = [], array2 = []) => {
    const mergedMap = new Map();
    array1.forEach((item) => item?.id != null && mergedMap.set(item.id, item));
    array2.forEach((item) => item?.id != null && mergedMap.set(item.id, item));
    return Array.from(mergedMap.values());
};

const defaultCalculateNewFilter = (oldfilter) => ({
    ...oldfilter,
    skip: (oldfilter.skip || 0) + (oldfilter.limit || 10),
    limit: oldfilter.limit || 10,
});

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
    rootRef,
    reset = 0,
    onAll = dummy,
    enabled = true,
} = {}) => {
    const dispatch = useDispatch();
    const gqlClient = useGQLClient();

    const observerRef = useRef(null);

    const initialFilter = useMemo(() => ({ ...(actionParams || {}) }), [actionParams]);

    const [state, setState] = useState(() => ({
        filter: initialFilter,
        loading: false,
        hasMore: true,
        error: null,
        items: preloadedItems,
    }));

    // Když se změní preloadedItems (např. store dorazil), můžeš je převzít
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            items: preloadedItems,
        }));
    }, [preloadedItems]);

    // Reset (typicky změna filtru)
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            filter: { ...(actionParams || {}) },
            loading: false,
            hasMore: true,
            error: null,
            // nechávám items, ať se ti tabulka “nezhroutí”; kdybys chtěl vymazat, dej items: []
            items: prev.items,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);


    const filterRef = useRef(initialFilter);
    useEffect(() => { filterRef.current = state.filter; }, [state.filter]);

    const stateRef = useRef(state);
    useEffect(() => { stateRef.current = state; }, [state]);

    const loadMore = useCallback(async () => {
        if (!enabled) return null;

        // guard proti paralelním fetchům / konci
        const snap = stateRef.current;
        if (snap.loading || !snap.hasMore) return null;

        // okamžitě nastav loading
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const params = filterRef.current;

        try {
            const result = await dispatch(asyncAction(params, gqlClient));
            const fetched = extractArrayFromThunkResult(result);

            setState((prev) => {
                const nextItems = mergeArraysById(prev.items, fetched);
                const limit = params?.limit;

                // bez limitu: hasMore = přišlo něco
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
    }, [dispatch, asyncAction, gqlClient, enabled, calculateNewFilter, onAll]);

    useEffect(() => {
        // načti první stránku hned
        loadMore();
    }, [loadMore]);

    // Ref callback pro sentinel element
    const sentinelRef = useCallback(
        (node) => {
            console.log("sentinelRef", node);
            if (!enabled) return;

            // odpoj starý observer
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }

            if (!node) return;

            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        // loadMore si hlídá loading/hasMore
                        loadMore();
                    }
                },
                { threshold: 0, root: rootRef?.current ?? null }
            );

            observerRef.current.observe(node);
        },
        [loadMore, enabled]
    );

    return {
        items: state.items,
        loading: state.loading,
        error: state.error,
        hasMore: state.hasMore,
        filter: state.filter,
        result: state.result,

        loadMore,
        sentinelRef,

        // utility
        setItems: (updater) =>
            setState((prev) => ({
                ...prev,
                items: typeof updater === "function" ? updater(prev.items) : updater,
            })),
        resetTo: (nextParams) =>
            setState((prev) => ({
                ...prev,
                filter: { ...(nextParams || {}) },
                loading: false,
                hasMore: true,
                error: null,
            })),
    };
};
