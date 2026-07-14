import {
    CardCapsule,
    VectorItemsURI
} from "../Components";

import { CreateButton } from "./Create";

import {
    UpdateButton,
    UpdateLink
} from "./Update";

import { DeleteButton } from "./Delete";

import {
    ProxyLink
} from "../../../../_template/src/Base/Components/ProxyLink";


/**
 * Renders a navigation link to the main finance collection page.
 *
 * The link uses the configured `VectorItemsURI` and can optionally preserve
 * the current URL hash and query string.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {React.ReactNode} props.children
 * Content rendered inside the navigation link.
 *
 * @param {boolean} [props.preserveHash=true]
 * Determines whether the current URL hash should be preserved.
 *
 * @param {boolean} [props.preserveSearch=true]
 * Determines whether the current query string should be preserved.
 *
 * @returns {JSX.Element}
 * Navigation link to the finance list page.
 *
 * @example
 * <PageLink className="btn btn-outline-success">
 *     Stránka
 * </PageLink>
 */
export const PageLink = ({
    children,
    preserveHash = true,
    preserveSearch = true,
    ...props
}) => {
    return (
        <ProxyLink
            to={VectorItemsURI}
            preserveHash={preserveHash}
            preserveSearch={preserveSearch}
            {...props}
        >
            {children}
        </ProxyLink>
    );
};


/**
 * Displays the interactive mutation controls for a finance entity.
 *
 * The component groups the primary finance actions into a single tools card.
 * Available operations include:
 *
 * - navigation to the finance list,
 * - opening the full edit page,
 * - opening the inline edit dialog,
 * - opening the create dialog,
 * - deleting the current finance entity.
 *
 * Permission handling for individual actions is delegated to the imported
 * mutation components.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity for which the mutation controls are displayed.
 *
 * @param {string} props.item.id
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Display name of the finance entity.
 *
 * @param {Object} [props.item.rbacobject]
 * RBAC object used by permission-aware mutation controls.
 *
 * @returns {JSX.Element}
 * Tools card containing finance navigation and mutation controls.
 *
 * @example
 * <InteractiveMutations
 *     item={{
 *         id: "30000000-0000-0000-0000-000000000003",
 *         name: "Rozpočet WP2"
 *     }}
 * />
 */
export const InteractiveMutations = ({
    item
}) => {
    return (
        <CardCapsule
            item={item}
            title="Nástroje"
        >
            <PageLink
                className="btn btn-outline-success"
            >
                Stránka
            </PageLink>

            <UpdateLink
                className="btn btn-outline-success"
                item={item}
            >
                Upravit
            </UpdateLink>

            <UpdateButton
                className="btn btn-outline-success"
                item={item}
            >
                Upravit dialog
            </UpdateButton>

            <CreateButton
                className="btn btn-outline-success"
                rbacitem={{}}
            >
                Vytvořit nový
            </CreateButton>

            <DeleteButton
                className="btn btn-outline-danger"
                item={item}
            >
                Odstranit
            </DeleteButton>
        </CardCapsule>
    );
};