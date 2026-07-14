// Importuje ikonu osoby používanou ve výchozím záhlaví karty.
import { PersonFill } from "react-bootstrap-icons";

// Importuje komponentu pro vytvoření odkazu na detail finance.
import { Link } from "./Link";

// Importuje obecnou komponentu CardCapsule a přejmenuje ji kvůli odlišení od lokální komponenty.
import {
    CardCapsule as CardCapsule_
} from "../../../../_template/src/Base/Components";


/**
 * Renders a finance-specific card container.
 *
 * This component wraps the shared `CardCapsule` and automatically creates
 * a default header containing a finance icon together with a navigation
 * link to the current finance entity. A custom title may be supplied to
 * replace the generated header.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity represented by the card.
 *
 * @param {*} [props.children]
 * Content rendered inside the card body.
 *
 * @param {*} [props.title=null]
 * Optional custom card title. If omitted, a default title consisting of
 * the finance icon and entity link is displayed.
 *
 * @returns {JSX.Element}
 * Finance card container.
 *
 * @example
 * <CardCapsule item={finance}>
 *     <FinanceDetails />
 * </CardCapsule>
 */
export const CardCapsule = ({
    // Finance entita reprezentovaná kartou.
    item,

    // Obsah vykreslený uvnitř těla karty.
    children,

    // Volitelný vlastní titulek karty.
    title = null
}) => {

    // Pokud nebyl zadán vlastní titulek, vytvoří výchozí záhlaví.
    if (!title) {
        title = (
            <>
                {/* Zobrazí ikonu osoby. */}
                <PersonFill />

                {/* Přidá odkaz na detail aktuální finance. */}
                <Link item={item} />
            </>
        );
    }

    // Vykreslí obecnou CardCapsule s připraveným titulkem.
    return (
        <CardCapsule_ title={title}>
            {/* Vykreslí obsah vložený do karty. */}
            {children}
        </CardCapsule_>
    );
};