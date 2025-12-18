import { ProxyLink } from "@hrbolek/uoisfrontend-shared";
import { useGQLEntityContext } from "../Helpers/GQLEntityProvider";
import { BoxArrowUpRight } from "react-bootstrap-icons";


const RegisterofLinks = {};
export const registerLink = (__typename, Link) => {
    const registeredLink = RegisterofLinks[__typename];
    if (!registeredLink) {
        RegisterofLinks[__typename] = Link;
    } else {
        // throw new Error(`Link for typename ${__typename} is already registered.`);
        console.warn(`Link for typename ${__typename} is already registered.`);
    }
}

export const Link = ({ item, action, children }) => {
    const { fetch } = useGQLEntityContext() || {};
    const registeredLink = item?.__typename ? RegisterofLinks[item.__typename] : null;
    if (registeredLink && registeredLink !== Link) {
        const SpecificLink = registeredLink;
        return <SpecificLink item={item} action={action}>{children}</SpecificLink>;
    }
    
    const label =
        children || item?.fullname || item?.name || item?.id || "Data Error";

    const onClick = async (e) => {
        e.preventDefault();
        if (!item?.__typename || !item?.id) return;
        await fetch(item);
    };

    const to = item?.__typename && item?.id
        ? `/typename/${item.__typename}/view/${item.id}`
        : "#";

    // když umíme "inline fetch", uděláme dvě akce:
    // - text: inline fetch
    // - ikona: navigace na detail routu
    if (fetch) {
        return (
            <span className="d-inline-flex align-items-center gap-2">
                <a
                    type="button"
                    className="btn btn-link p-0 align-baseline"
                    onClick={onClick}
                    href="#"
                >
                    {label}
                </a>

                <ProxyLink
                    to={to}
                    // className="btn btn-sm btn-outline-secondary py-0 px-1"
                    className="btn btn-link btn-sm p-0 align-baseline"
                    title="Otevřít detail"
                    aria-label={`Otevřít detail: ${item?.__typename ?? ""} ${item?.id ?? ""}`}
                >
                    <BoxArrowUpRight size={14} />
                </ProxyLink>
            </span>
        );
    }

    // fallback: jen navigace
    return <ProxyLink to={to}>{label}</ProxyLink>;
};
