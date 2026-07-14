// Importuje ikonu osoby používanou v záhlaví karty.
import { PersonFill } from "react-bootstrap-icons";

// Importuje finance-specifický obal karty.
import { CardCapsule } from "./CardCapsule";

// Importuje komponentu zobrazující detailní údaje finance.
import { MediumContent } from "./MediumContent";

// Importuje odkaz na detail aktuální finance.
import { Link } from "./Link";


/**
 * Displays the detail card of a finance entity.
 *
 * The component combines `CardCapsule` and `MediumContent` to create
 * the standard finance detail view. The card header contains an icon
 * together with a navigation link to the current finance entity.
 *
 * Any content passed through `children` is rendered before the default
 * finance details, allowing the card to be extended with additional
 * visualizations or controls.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity displayed inside the card.
 *
 * @param {*} [props.children]
 * Optional content rendered before the standard finance details.
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
    // Finance entita zobrazená uvnitř karty.
    item,

    // Volitelný obsah vykreslený před standardním detailem finance.
    children
}) => {

    // Vykreslí kartu s vlastním záhlavím a obsahem.
    return (
        <CardCapsule
            // Sestavuje vlastní titulek karty z ikony a odkazu na finance.
            title={
                <>
                    {/* Ikona používaná jako vizuální označení entity. */}
                    <PersonFill />

                    {/* Vloží mezeru mezi ikonu a text odkazu. */}
                    {" "}

                    {/* Zobrazí název nebo ID finance jako odkaz na její detail. */}
                    <Link item={item} />
                </>
            }
        >
            {/* Vykreslí případný rozšiřující obsah před detailem finance. */}
            {children}

            {/* Zobrazí standardní detailní údaje finance. */}
            <MediumContent item={item} />
        </CardCapsule>
    );
};