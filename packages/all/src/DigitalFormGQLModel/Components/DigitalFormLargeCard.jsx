import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormCardCapsule } from "./DigitalFormCardCapsule"
import { DigitalFormMediumCard } from "./DigitalFormMediumCard"

/**
 * A large card component for displaying detailed content and layout for an digitalform entity.
 *
 * This component wraps an `DigitalFormCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalFormMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormLargeCard component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform entity.
 * @param {string} props.digitalform.name - The name or label of the digitalform entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormLargeCard digitalform={digitalformEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalFormLargeCard>
 */
export const DigitalFormLargeCard = ({digitalform, children}) => {
    return (
        <DigitalFormCardCapsule digitalform={digitalform} >
            <Row>
                <LeftColumn>
                    <DigitalFormMediumCard digitalform={digitalform}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </DigitalFormCardCapsule>
    )
}
