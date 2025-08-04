import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { RequestCardCapsule } from "./RequestCardCapsule"
import { RequestMediumCard } from "./RequestMediumCard"
import { DigitalSubmissionLargeContent } from "../../DigitalSubmissionGQLModel/Components/DigitalSubmissionLargeContent"

/**
 * A large card component for displaying detailed content and layout for an request entity.
 *
 * This component wraps an `RequestCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `RequestMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the RequestLargeCard component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestLargeCard request={requestEntity}>
 *   <p>Additional content for the middle column.</p>
 * </RequestLargeCard>
 */
export const RequestLargeContent = ({request, children}) => {
    const { activeSubmission } = request
    return (
        <>
            {activeSubmission && <DigitalSubmissionLargeContent digitalsubmission={activeSubmission} />}
            {!activeSubmission && <div>Neni pripojen formular, toto je chybovy stav</div>}
            {children}
        </>
    )
}
