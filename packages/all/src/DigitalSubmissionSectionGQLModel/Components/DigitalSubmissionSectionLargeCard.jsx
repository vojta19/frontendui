import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionSectionCardCapsule } from "./DigitalSubmissionSectionCardCapsule"
import { DigitalSubmissionSectionMediumCard } from "./DigitalSubmissionSectionMediumCard"

/**
 * A large card component for displaying detailed content and layout for an digitalsubmissionsection entity.
 *
 * This component wraps an `DigitalSubmissionSectionCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalSubmissionSectionMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionSectionLargeCard component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {string|number} props.digitalsubmissionsection.id - The unique identifier for the digitalsubmissionsection entity.
 * @param {string} props.digitalsubmissionsection.name - The name or label of the digitalsubmissionsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionSectionLargeCard digitalsubmissionsection={digitalsubmissionsectionEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalSubmissionSectionLargeCard>
 */
export const DigitalSubmissionSectionLargeCard = ({digitalsubmissionsection, children}) => {
    return (
        <DigitalSubmissionSectionCardCapsule digitalsubmissionsection={digitalsubmissionsection} >
            <Row>
                <LeftColumn>
                    <DigitalSubmissionSectionMediumCard digitalsubmissionsection={digitalsubmissionsection}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </DigitalSubmissionSectionCardCapsule>
    )
}
