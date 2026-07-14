// Import ikony osoby z knihovny react-bootstrap-icons.
// Ikona je použita jako výchozí symbol v záhlaví karty.
import { PersonFill } from "react-bootstrap-icons";

// Import lokální komponenty Link, která vytváří odkaz na detail finance.
import { Link } from "./Link";

// Import základní komponenty CardCapsule ze sdílené šablony.
// Komponenta je přejmenována na CardCapsule_, aby nedošlo ke kolizi názvů
// s komponentou definovanou v tomto souboru.
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
    // Aktuální finanční položka zobrazená v kartě.
    item,

    // Obsah, který bude vykreslen uvnitř těla karty.
    children,

    // Volitelný vlastní nadpis karty.
    // Pokud není předán, vytvoří se automaticky.
    title = null
}) => {

    // Pokud volající nepředal vlastní záhlaví,
    // vytvoří se výchozí záhlaví obsahující ikonu a odkaz na finance.
    if (!title) {
        title = (
            <>
                {/* Ikona použitá jako vizuální označení finanční položky */}
                <PersonFill />

                {/* Odkaz na detail aktuální finanční entity */}
                <Link item={item} />
            </>
        );
    }

    // Vykreslení základní sdílené komponenty CardCapsule.
    // Do záhlaví je předán připravený title a do těla veškerý obsah children.
    return (
        <CardCapsule_ title={title}>
            {children}
        </CardCapsule_>
    );
};