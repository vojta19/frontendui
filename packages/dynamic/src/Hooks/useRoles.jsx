import { useMemo } from "react";
import { useGQLClient } from "../Store";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AsyncStateIndicator } from "../../../_template/src/Base/Helpers/AsyncStateIndicator";
import { useContext } from "react";
import { createContext } from "react";

/**
 * Normalizace názvů rolí pro porovnávání.
 * - trim
 * - volitelně case-insensitive (zde zapnuto)
 */
const normalizeRoleName = (name) => {
    if (typeof name !== "string") return "";
    return name.trim().toLowerCase();
};

/**
 * Vrací true, pokud mají dvě kolekce alespoň jeden společný prvek.
 * Optimalizované přes Set (O(n+m)).
 *
 * @param {Iterable<string>} a
 * @param {Iterable<string>} b
 * @returns {boolean}
 */
export const hasIntersection = (a, b) => {
    if (!a || !b) return false;

    // vytvoř set z menší kolekce (mikro-optimalizace)
    const arrA = Array.isArray(a) ? a : Array.from(a);
    const arrB = Array.isArray(b) ? b : Array.from(b);

    const small = arrA.length <= arrB.length ? arrA : arrB;
    const large = arrA.length <= arrB.length ? arrB : arrA;

    const set = new Set(small);
    for (const x of large) {
        if (set.has(x)) return true;
    }
    return false;
};

/**
 * useRoles
 *
 * @param {Object} item
 * @param {string[]} oneOfRoles - role names, které povolují akci (stačí jedna)
 * @param {Object} [options]
 * @param {boolean} [options.caseInsensitive=true]
 * @returns {{ can: boolean, roleNames: string[] }}
 */
export const useItemRoles = ({ item = {}, oneOfRoles = [], caseInsensitive = false } = {}) => {
    const currentUserRoles = item?.rbacobject?.currentUserRoles;

    const roleNames = useMemo(() => {
        const roles = Array.isArray(currentUserRoles) ? currentUserRoles : [];
        const norm = (s) => {
            if (typeof s !== "string") return "";
            const t = s.trim();
            return caseInsensitive ? t.toLowerCase() : t;
        };
        return roles.map(r => r?.roletype?.name).map(norm).filter(Boolean);
    }, [currentUserRoles, caseInsensitive]);

    const can = useMemo(() => {
        if (!Array.isArray(currentUserRoles)) return false;
        if (!Array.isArray(oneOfRoles) || oneOfRoles.length === 0) return false;

        const norm = (s) => {
            if (typeof s !== "string") return "";
            const t = s.trim();
            return caseInsensitive ? t.toLowerCase() : t;
        };

        const userSet = new Set(roleNames);
        return oneOfRoles.some(r => userSet.has(norm(r)));
    }, [currentUserRoles, oneOfRoles, caseInsensitive, roleNames]);

    if (currentUserRoles == null) {
        console.error(`Nelze posoudit práva, data nejsou k dispozici.`, item)
    }
    // if (item?.__typename === "GroupGQLModel")
    //     console.log("useItemRoles.GroupGQLModel", can, item, currentUserRoles)
    const error = null
    // const error =
    //     currentUserRoles == null
    //         ? `Nelze posoudit práva, data nejsou k dispozici.\n${JSON.stringify(item?.rbacobject)}`
    //         : null;

    return { can, roleNames, loading: false, error };
};

export const ItemPermissionGate = ({
    item,
    oneOfRoles = [],
    deniedFallback = null,
    children,
}) => {
    if (!item)
        throw Error("(Item)PermissionGate must have item property it is missing now")

    const { can, loading, error } = useItemRoles({ item, oneOfRoles });
    const contextValue = {
        allowed: can, 
        loading, 
        error,
        oneOfRoles,
        item
    }
    // if (item?.__token)
    //     console.log("ItemPermissionGate.can", can, item)
    if (loading || error) {
        return (
            <PermissionGateContext.Provider value={contextValue}>
                <AsyncStateIndicator
                    loading={loading}
                    error={error}
                    text="Ověřuji oprávnění"
                />
            </PermissionGateContext.Provider>
        )}
    

    // if (can === false) return (<>{deniedFallback}</>); // default null

    // can === true (nebo když can vrací true/false a loading už je false)
    return (
        <PermissionGateContext.Provider value={contextValue}>
            {children}
        </PermissionGateContext.Provider>
    );
};

const cache = new Map(); // Map<string, CacheEntry<any>>

/**
 * Vrátí cached hodnotu s TTL. Deduplikuje paralelní volání pro stejný key.
 *
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fetcher
 * @param {{ ttlMs?: number, now?: () => number }} [options]
 * @returns {Promise<T>}
 */
export function getCached(key, fetcher, options = {}) {
    const ttlMs = options.ttlMs ?? 60_000;
    const now = options.now ?? (() => Date.now());
    const t = now();

    /** @type {CacheEntry<T> | undefined} */
    const entry = cache.get(key);

    if (entry && entry.value !== undefined && entry.expiresAt > t) {
        return Promise.resolve(entry.value);
    }

    if (entry && entry.promise && entry.expiresAt > t) {
        return entry.promise;
    }

    const expiresAt = t + ttlMs;
    const p = Promise.resolve()
        .then(fetcher)
        .then((val) => {
            cache.set(key, { value: val, expiresAt });
            return val;
        })
        .catch((err) => {
            cache.delete(key);
            throw err;
        });

    cache.set(key, { promise: p, expiresAt });
    return p;
}

export function invalidateCached(key) {
    cache.delete(key);
}

export function clearCache() {
    cache.clear();
}

export function pruneCache(now = Date.now) {
    const t = now();
    for (const [k, v] of cache.entries()) {
        if (v.expiresAt <= t) cache.delete(k);
    }
}

const queryMe = `
{
  me {
    roles(limit: 1000, where: {valid: {_eq: true}}) {
      roletype {
        __typename
        id
        name
      }
      user {
        __typename
        id
        fullname
      }
      group {
        __typename
        id
        name
      }
    }
  }
}`
/**
 * Načte absolutní role uživatele (z `me.roles.roletype.name`) a cacheuje je s TTL.
 * Vrací i boolean `allowed` podle toho, zda uživatel má alespoň jednu z rolí `oneOfRoles`.
 *
 * @param {string[]} [oneOfRoles=[]] seznam rolí, z nichž stačí mít jednu
 * @param {{ ttlMs?: number, enabled?: boolean, cacheKey?: string }} [options]
 * @returns {{ loading: boolean, allowed: boolean|null, roles: string[], error: any }}
 */
export function useAbsoluteRoles({ oneOfRoles = [], ...options }) {
    const gqlClient = useGQLClient();
    const enabled = options.enabled ?? true;
    const ttlMs = options.ttlMs ?? 60_000;

    // cacheKey můžeš přepsat; defaultně cacheujeme role me.
    const cacheKey = options.cacheKey ?? "me.roles";

    const fetcher = useCallback(async () => {
        const response = await gqlClient.query(queryMe);
        const roles = response?.data?.me?.roles ?? [];
        // unikátní názvy rolí
        const names = roles
            .map((r) => r?.roletype?.name)
            .filter(Boolean);

        return Array.from(new Set(names));
    }, [gqlClient]);

    const [state, setState] = useState(() => ({
        loading: !!enabled,
        allowed: /** @type {boolean|null} */ (null),
        roles: /** @type {string[]} */ ([]),
        error: /** @type {any} */ (null),
    }));

    const oneOfSet = useMemo(
        () => new Set((oneOfRoles ?? []).filter(Boolean)),
        [oneOfRoles]
    );

    useEffect(() => {
        let cancelled = false;

        if (!enabled) {
            setState({ loading: false, allowed: null, roles: [], error: null });
            return;
        }

        setState((s) => ({ ...s, loading: true, error: null }));

        getCached(cacheKey, fetcher, { ttlMs })
            .then((roles) => {
                if (cancelled) return;
                const allowed =
                    oneOfSet.size === 0
                        ? true // pokud nepředáš žádné oneOfRoles, beru to jako "nefiltruj"
                        : roles.some((r) => oneOfSet.has(r));

                setState({ loading: false, allowed, roles, error: null });
            })
            .catch((error) => {
                if (cancelled) return;
                setState({ loading: false, allowed: null, roles: [], error });
            });

        return () => {
            cancelled = true;
        };
    }, [enabled, ttlMs, cacheKey, fetcher, oneOfSet]);

    return state;
}

export const usePermissionRoles = ({
    mode = "absolute",
    item = {},
    oneOfRoles = [],
    ...options
}) => {
    const [firstMode] = useState(mode)
    if (firstMode !== mode)
        throw Error("Mode parameter of usePermissionRoles hook cannot be changed during lifetime")
    if (mode === "item")
        return useItemRoles({ item, oneOfRoles, ...options })
    if (mode === "absolute") {
        // allow skip the item parameter
        return useAbsoluteRoles({ oneOfRoles, ...options })
    }
    throw Error("Mode parameter of usePermissionRoles hook must be one of 'absolute' or 'item'")
}

const dummyRoles = []
const localDeniedFallback = (<>Nemáte dostatečná oprávnění</>)
export const AbsolutePermissionGate = ({
    oneOfRoles = dummyRoles,
    deniedFallback = localDeniedFallback,
    children,
}) => {
    const { loading, allowed, error } = useAbsoluteRoles({ oneOfRoles });

    return (
        <PermissionGateContext.Provider 
            value={{
                oneOfRoles,
                loading, 
                allowed, 
                error}}
        >
            <AsyncStateIndicator error={error} loading={loading} text="Ověřuji oprávnění" />
            {allowed === true && children}
            {allowed === false && deniedFallback}
        </PermissionGateContext.Provider>
    );
};

const PermissionGateContext = createContext(null);
export const usePermissionGateContext = () => {
    const result = useContext(PermissionGateContext)
    if (result == null)
        throw Error("usePermissionGateContext must be used within PermissionGate")
    return result
}

export const PermissionGate = ({ oneOfRoles, mode = "absolute", ...props }) => {
    if (!oneOfRoles) throw Error("PermissionGate.oneOfRoles must be specified");
    if (mode === "absolute") return <AbsolutePermissionGate oneOfRoles={oneOfRoles} {...props} />;
    if (mode === "item") return <ItemPermissionGate oneOfRoles={oneOfRoles} {...props} />;
    throw Error("PermissionGate.mode must be one of 'absolute' or 'item'");
};