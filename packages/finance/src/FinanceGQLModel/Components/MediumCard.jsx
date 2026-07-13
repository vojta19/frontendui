import { PersonFill } from "react-bootstrap-icons";

import { CardCapsule } from "./CardCapsule";
import { MediumContent } from "./MediumContent";
import { Link } from "./Link";


/**
 * Displays the detail card of a finance entity.
 *
 * The component combines the finance-specific `CardCapsule` with the
 * `MediumContent` component to provide a complete detail view. The card
 * header contains an icon together with a navigation link to the current
 * finance entity, while any child components are rendered before the
 * standard detail section.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity displayed inside the card.
 *
 * @param {React.ReactNode} [props.children]
 * Optional custom content rendered before the standard finance details.
 *
 * @returns {JSX.Element}
 * Rendered finance detail card.
 *
 * @example
 * <MediumCard item={finance}>
 *     <FinanceTransferSunburst item={finance} />
 * </MediumCard>
 */
export const MediumCard = ({
    item,
    children
}) => {

    return (
        <CardCapsule
            title={
                <>
                    <PersonFill />
                    {" "}
                    <Link item={item} />
                </>
            }
        >
            {children}

            <MediumContent item={item} />
        </CardCapsule>
    );
};