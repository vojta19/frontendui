import { PersonFill } from "react-bootstrap-icons";

import { Link } from "./Link";

import {
    CardCapsule as CardCapsule_
} from "../../../../_template/src/Base/Components";


/**
 * Card container used throughout the finance module.
 *
 * The component extends the shared `CardCapsule` by automatically generating
 * a finance-specific header containing an icon and a link to the current
 * finance entity. A custom title may be provided to replace the default
 * header.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity displayed by the card.
 *
 * @param {React.ReactNode} [props.children]
 * Content rendered inside the card body.
 *
 * @param {React.ReactNode|null} [props.title=null]
 * Optional custom card title. When omitted, a default header containing
 * a finance icon and entity link is displayed.
 *
 * @returns {JSX.Element}
 * Rendered finance card.
 *
 * @example
 * <CardCapsule item={finance}>
 *     <FinanceDetails />
 * </CardCapsule>
 */
export const CardCapsule = ({
    item,
    children,
    title = null
}) => {

    if (!title) {
        title = (
            <>
                <PersonFill />
                <Link item={item} />
            </>
        );
    }

    return (
        <CardCapsule_ title={title}>
            {children}
        </CardCapsule_>
    );
};