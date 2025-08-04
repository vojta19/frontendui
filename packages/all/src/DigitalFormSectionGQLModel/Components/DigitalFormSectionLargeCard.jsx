import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormSectionCardCapsule } from "./DigitalFormSectionCardCapsule"
import { DigitalFormSectionMediumCard } from "./DigitalFormSectionMediumCard"

/**
 * A large card component for displaying detailed content and layout for an digitalformsection entity.
 *
 * This component wraps an `DigitalFormSectionCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalFormSectionMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormSectionLargeCard component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the digitalformsection entity.
 * @param {string} props.digitalformsection.name - The name or label of the digitalformsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormSectionLargeCard digitalformsection={digitalformsectionEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalFormSectionLargeCard>
 */
export const DigitalFormSectionLargeCard = ({digitalformsection, children}) => {
    return (
        <DigitalFormSectionCardCapsule digitalformsection={digitalformsection} >
            <Row>
                <LeftColumn>
                    <DigitalFormSectionMediumCard digitalformsection={digitalformsection}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </DigitalFormSectionCardCapsule>
    )
}
