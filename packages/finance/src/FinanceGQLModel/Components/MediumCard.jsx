// Import ikony osoby, která se zobrazuje v záhlaví detailní karty finance.
import { PersonFill } from "react-bootstrap-icons";

// Import vlastní obalové komponenty karty používané v modulu financí.
import { CardCapsule } from "./CardCapsule";

// Import komponenty zobrazující základní a detailní údaje finanční entity.
import { MediumContent } from "./MediumContent";

// Import lokální komponenty Link pro vytvoření odkazu na detail aktuální finance.
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
    // Aktuální finanční entita zobrazená v detailní kartě.
    item,

    // Volitelný obsah vložený rodičovskou komponentou
    // před standardní detailní informace.
    children
}) => {

    // Vykreslení výsledné detailní karty finance.
    return (
        <CardCapsule
            // Vlastní záhlaví karty tvoří ikona a odkaz na aktuální finance.
            title={
                <>
                    {/* Vizuální ikona v záhlaví detailní karty */}
                    <PersonFill />

                    {/* Mezera mezi ikonou a textem odkazu */}
                    {" "}

                    {/* Odkaz na detail aktuální finanční položky */}
                    <Link item={item} />
                </>
            }
        >
            {/* Volitelný obsah předaný z nadřazené komponenty.
                Může jít například o diagram, tlačítka nebo doplňující informace. */}
            {children}

            {/* Standardní detailní výpis vlastností aktuální finance */}
            <MediumContent item={item} />
        </CardCapsule>
    );
};