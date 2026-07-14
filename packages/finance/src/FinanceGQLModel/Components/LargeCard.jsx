// Import vlastní finance varianty komponenty CardCapsule.
// Alias DefaultCardCapsule jasně označuje, že jde o výchozí komponentu,
// kterou lze případně nahradit přes props.
import {
    CardCapsule as DefaultCardCapsule
} from "./CardCapsule";

// Import výchozí komponenty pro zobrazení detailních údajů finance.
// Alias DefaultMediumContent opět rozlišuje výchozí implementaci
// od případné komponenty předané z nadřazené části aplikace.
import {
    MediumContent as DefaultMediumContent
} from "./MediumContent";

// Import panelu s dostupnými akcemi nad aktuální finanční položkou,
// například editací, vytvořením nebo odstraněním.
import {
    InteractiveMutations
} from "../Mutations/InteractiveMutations";

// Import řádkové layoutové komponenty ze sdílené šablony.
import {
    Row
} from "../../../../_template/src/Base/Components/Row";

// Import předpřipravených sloupců pro levý detailní panel
// a hlavní střední obsah stránky.
import {
    LeftColumn,
    MiddleColumn
} from "../../../../_template/src/Base/Components/Col";


/**
 * Displays the main two-column detail layout of a finance entity.
 *
 * The left column contains the finance details and available mutation
 * controls. The middle column is reserved for additional content such as
 * visualizations, scalar attributes or vector attributes.
 *
 * The default card and detail components can be replaced through component
 * properties, which allows the layout to be reused with custom rendering
 * implementations.
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
 * @param {React.ReactNode} [props.children]
 * Additional content rendered in the middle column.
 *
 * @param {React.ComponentType<Object>} [props.CardCapsule=DefaultCardCapsule]
 * Card component used to render the outer container and detail section.
 *
 * @param {React.ComponentType<Object>} [props.MediumContent=DefaultMediumContent]
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
    // Aktuální finanční entita zobrazovaná na detailní stránce.
    item,

    // Libovolný doplňkový obsah, který se vykreslí ve středním sloupci.
    children,

    // Výchozí obalová karta může být přepsána vlastní komponentou.
    CardCapsule = DefaultCardCapsule,

    // Výchozí detailní obsah může být rovněž nahrazen jinou implementací.
    MediumContent = DefaultMediumContent
}) => {
    // Vrací hlavní dvousloupcový layout detailu finance.
    return (
        // Vnější karta obaluje celý obsah stránky a pracuje s aktuálním itemem.
        <CardCapsule item={item}>

            {/* Row vytvoří vodorovné rozložení jednotlivých sloupců. */}
            <Row>

                {/* Levý sloupec je určen pro základní informace a ovládací prvky. */}
                <LeftColumn>

                    {/* Vnitřní karta s nadpisem Detail odděluje přehled atributů finance. */}
                    <CardCapsule
                        item={item}
                        title="Detail"
                    >
                        {/* Vykreslení detailních údajů aktuální finanční položky. */}
                        <MediumContent item={item} />
                    </CardCapsule>

                    {/* Panel s interaktivními akcemi nad aktuální financí. */}
                    <InteractiveMutations item={item} />
                </LeftColumn>

                {/* Střední sloupec slouží pro hlavní obsah,
                    například Sunburst diagram nebo tabulky. */}
                <MiddleColumn>

                    {/* Vykreslení obsahu předaného z rodičovské komponenty. */}
                    {children}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    );
};