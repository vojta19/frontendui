import { URIRoot } from "../../uriroot";

import { registerLink } from "../../../../_template/src/Base/Components/Link";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";


const modelURI = `${URIRoot}/FinanceGQLModel`;

export const ListURI = `${modelURI}/list/`;
export const CreateURI = `${modelURI}/create/`;
export const ReadURI = `${modelURI}/view/`;
export const UpdateURI = `${modelURI}/edit/`;
export const DeleteURI = `${modelURI}/delete/`;

export const LinkURI = ReadURI;
export const VectorItemsURI = ListURI;

const idParam = ":id";

export const ReadItemURI = `${LinkURI}${idParam}`;
export const UpdateItemURI = `${UpdateURI}${idParam}`;
export const DeleteItemURI = `${DeleteURI}${idParam}`;


/**
 * Renders a navigation link to a Finance entity.
 *
 * The component automatically constructs the destination URL from the
 * configured route and the entity identifier. By default it navigates to
 * the detail page, but any supported action (such as edit or delete) can
 * be selected through the `action` property.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity used to build the target URL.
 *
 * @param {string} [props.LinkURI=LinkURI]
 * Base URI used when constructing the navigation path.
 *
 * @param {string} [props.action="view"]
 * Target action appended to the generated route
 * (e.g. `view`, `edit`, `delete`).
 *
 * @param {React.ReactNode} [props.children]
 * Optional custom link content. When omitted, the component displays
 * `fullname`, `name`, `id` or a fallback text.
 *
 * @returns {JSX.Element}
 * Navigation link pointing to the selected finance entity.
 *
 * @example
 * <Link item={finance} />
 *
 * @example
 * <Link item={finance} action="edit">
 *     Upravit
 * </Link>
 */
export const Link = ({
    item,
    LinkURI: LinkURI_ = LinkURI,
    action = "view",
    children,
    ...props
}) => {

    const targetURI = LinkURI_.replace("view", action);

    return (
        <ProxyLink
            to={targetURI + item?.id}
            {...props}
        >
            {children || item?.fullname || item?.name || item?.id || "Nevím"}
        </ProxyLink>
    );
};


registerLink("FinanceGQLModel", Link);