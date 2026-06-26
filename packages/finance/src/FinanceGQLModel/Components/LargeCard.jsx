// import Row from "react-bootstrap/Row" // nepoužívaný import
import { MediumCard } from "./MediumCard" // komponenta střední karty
import { CardCapsule as CardCapsule_ } from "./CardCapsule" // kapsle karta komponenta
import { Row } from "../../../../_template/src/Base/Components/Row" // komponenta řádku pro layout
// import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared" // nepoužívané importy
import { MediumContent as MediumContent_ } from "./MediumContent" // komponenta středního obsahu
import { InteractiveMutations } from "../Mutations/InteractiveMutations" // komponenta interaktivních mutací
import { LeftColumn, MiddleColumn } from "../../../../_template/src/Base/Components/Col" // komponenty sloupců pro layout

/**
 * A large card component for displaying detailed content and layout for a finance entity.
 *
 * This component wraps a `CardCapsule` with a flexible two-column layout. It displays
 * detailed information in the left column and additional content in the middle column.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.item - The finance entity to display.
 * @param {string|number} props.item.id - The unique identifier for the entity.
 * @param {string} props.item.name - The name or label of the entity.
 * @param {React.ReactNode} [props.children] - Additional content for the middle column.
 * @param {Function} [props.CardCapsule] - Custom CardCapsule component override.
 * @param {Function} [props.MediumContent] - Custom MediumContent component override.
 *
 * @returns {JSX.Element} A large card layout with left and middle columns.
 *
 * @example
 * import { LargeCard } from './LargeCard';
 *
 * const item = { id: 123, name: "Finance Entry" };
 *
 * <LargeCard item={item}>
 *   <p>Additional content here.</p>
 * </LargeCard>
 */
export const LargeCard = ({
    item, // finance entita k zobrazení
    children, // obsah pro střední sloupec
    CardCapsule = CardCapsule_, // komponenta kapsle (s defaultem)
    MediumContent = MediumContent_, // komponenta obsahu (s defaultem)
}) => {
    // console.log("LargeCard.item", item) // debug log (zakomentované)

    return (
        <CardCapsule item={item}> {/* vnější kapsle karta s položkou */}
            <Row> {/* řádek pro layout */}
                <LeftColumn> {/* levý sloupec */}
                    <CardCapsule item={item} title="Detail"> {/* karta pro detaily */}
                        <MediumContent item={item} /> {/* obsah s detaily položky */}
                    </CardCapsule>
                    <InteractiveMutations item={item} /> {/* interaktivní mutace tlačítka */}
                </LeftColumn>
                <MiddleColumn> {/* střední sloupec */}
                    {children} {/* potomci z rodiče */}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    )
}

