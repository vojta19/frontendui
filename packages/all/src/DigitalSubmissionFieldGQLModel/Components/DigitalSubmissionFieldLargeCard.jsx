import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionFieldCardCapsule } from "./DigitalSubmissionFieldCardCapsule"
import { DigitalSubmissionFieldMediumCard } from "./DigitalSubmissionFieldMediumCard"

/**
 * A large card component for displaying detailed content and layout for an digitalsubmissionfield entity.
 *
 * This component wraps an `DigitalSubmissionFieldCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalSubmissionFieldMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionFieldLargeCard component.
 * @param {Object} props.digitalsubmissionfield - The object representing the digitalsubmissionfield entity.
 * @param {string|number} props.digitalsubmissionfield.id - The unique identifier for the digitalsubmissionfield entity.
 * @param {string} props.digitalsubmissionfield.name - The name or label of the digitalsubmissionfield entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionfieldEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionFieldLargeCard digitalsubmissionfield={digitalsubmissionfieldEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalSubmissionFieldLargeCard>
 */
export const DigitalSubmissionFieldLargeCard = ({digitalsubmissionfield, children}) => {
    return (
        <DigitalSubmissionFieldCardCapsule digitalsubmissionfield={digitalsubmissionfield} >
            <Row>
                <LeftColumn>
                    <DigitalSubmissionFieldMediumCard digitalsubmissionfield={digitalsubmissionfield}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </DigitalSubmissionFieldCardCapsule>
    )
}
