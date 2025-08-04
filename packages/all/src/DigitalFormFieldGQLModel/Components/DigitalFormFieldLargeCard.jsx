import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormFieldCardCapsule } from "./DigitalFormFieldCardCapsule"
import { DigitalFormFieldMediumCard } from "./DigitalFormFieldMediumCard"

/**
 * A large card component for displaying detailed content and layout for an digitalformfield entity.
 *
 * This component wraps an `DigitalFormFieldCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalFormFieldMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormFieldLargeCard component.
 * @param {Object} props.digitalformfield - The object representing the digitalformfield entity.
 * @param {string|number} props.digitalformfield.id - The unique identifier for the digitalformfield entity.
 * @param {string} props.digitalformfield.name - The name or label of the digitalformfield entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalformfieldEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormFieldLargeCard digitalformfield={digitalformfieldEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalFormFieldLargeCard>
 */
export const DigitalFormFieldLargeCard = ({digitalformfield, children}) => {
    return (
        <DigitalFormFieldCardCapsule digitalformfield={digitalformfield} >
            <Row>
                <LeftColumn>
                    <DigitalFormFieldMediumCard digitalformfield={digitalformfield}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </DigitalFormFieldCardCapsule>
    )
}
