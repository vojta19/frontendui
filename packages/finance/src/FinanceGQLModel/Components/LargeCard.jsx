// Importuje výchozí komponentu obalové karty pro zobrazení finance.
import {
    CardCapsule as DefaultCardCapsule
} from "./CardCapsule";

// Importuje výchozí komponentu zobrazující detailní informace o finance.
import {
    MediumContent as DefaultMediumContent
} from "./MediumContent";

// Importuje panel s interaktivními akcemi (vytvoření, editace, mazání).
import {
    InteractiveMutations
} from "../Mutations/InteractiveMutations";

// Importuje komponentu řádku Bootstrap-like mřížky.
import {
    Row
} from "../../../../_template/src/Base/Components/Row";

// Importuje levý a prostřední sloupec rozvržení stránky.
import {
    LeftColumn,
    MiddleColumn
} from "../../../../_template/src/Base/Components/Col";


/**
 * Displays the main two-column detail layout of a finance entity.
 *
 * The left column contains the finance details together with the available
 * mutation controls. The middle column is intended for additional content
 * such as visualizations, scalar attributes or vector attributes.
 *
 * The default card and detail components can be replaced through component
 * properties, allowing the layout to be reused with custom implementations.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity displayed by the layout.
 *
 * @param {string} [props.item.id]
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Display name of the finance entity.
 *
 * @param {*} [props.children]
 * Additional content rendered in the middle column.
 *
 * @param {Function} [props.CardCapsule=DefaultCardCapsule]
 * Component used to render the outer card and detail section.
 *
 * @param {Function} [props.MediumContent=DefaultMediumContent]
 * Component used to render the finance detail attributes.
 *
 * @returns {JSX.Element}
 * Two-column finance detail layout.
 *
 * @example
 * <LargeCard item={finance}>
 *     <FinanceTransferSunburst item={finance} />
 * </LargeCard>
 */
export const LargeCard = ({
    // Finance entita zobrazovaná na stránce.
    item,

    // Volitelný obsah vykreslený v pravém sloupci.
    children,

    // Komponenta použitá jako obalová karta.
    CardCapsule = DefaultCardCapsule,

    // Komponenta zobrazující detail finance.
    MediumContent = DefaultMediumContent
}) => {
    // Vykreslí dvousloupcové rozvržení detailu finance.
    return (
        <CardCapsule item={item}>
            {/* Hlavní řádek rozvržení stránky. */}
            <Row>

                {/* Levý sloupec s detailem a nástroji. */}
                <LeftColumn>

                    {/* Karta obsahující základní informace o finance. */}
                    <CardCapsule
                        item={item}
                        title="Detail"
                    >
                        {/* Zobrazí detailní atributy finance. */}
                        <MediumContent item={item} />
                    </CardCapsule>

                    {/* Vykreslí panel s dostupnými akcemi nad financí. */}
                    <InteractiveMutations item={item} />
                </LeftColumn>

                {/* Prostřední sloupec pro rozšiřující obsah. */}
                <MiddleColumn>
                    {/* Vykreslí obsah předaný rodičovskou komponentou. */}
                    {children}
                </MiddleColumn>

            </Row>
        </CardCapsule>
    );
};