import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionCardCapsule } from "./DigitalSubmissionCardCapsule"
import { DigitalSubmissionMediumCard } from "./DigitalSubmissionMediumCard"
import { DigitalSubmissionFieldsAttribute } from "../Vectors/DigitalSubmissionFieldsAttribute"
import { DigitalSubmissionNameAttribute } from "../Attributes"
import { DigitalSubmissionSectionsAttribute } from "../Vectors/DigitalSubmissionSectionsAttribute"

/**
 * A large card component for displaying detailed content and layout for an digitalsubmission entity.
 *
 * This component wraps an `DigitalSubmissionCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalSubmissionMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionLargeCard component.
 * @param {Object} props.digitalsubmission - The object representing the digitalsubmission entity.
 * @param {string|number} props.digitalsubmission.id - The unique identifier for the digitalsubmission entity.
 * @param {string} props.digitalsubmission.name - The name or label of the digitalsubmission entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionLargeCard digitalsubmission={digitalsubmissionEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalSubmissionLargeCard>
 */
export const DigitalSubmissionLargeContent = ({digitalsubmission, children}) => {
    return (
        <>
            {/* <Row>
                <Col>Name</Col>
                <Col>
                    <DigitalSubmissionNameAttribute digitalsubmission={digitalsubmission} />
                </Col>
            </Row> */}
            <DigitalSubmissionNameAttribute digitalsubmission={digitalsubmission} /><br />
            <DigitalSubmissionFieldsAttribute digitalsubmission={digitalsubmission} />
            <DigitalSubmissionSectionsAttribute digitalsubmission={digitalsubmission} />
            {children}
        </>
    )
}
