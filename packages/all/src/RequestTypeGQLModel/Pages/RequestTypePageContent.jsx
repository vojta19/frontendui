import { RequestTypeLargeCard } from "../Components"
import { RequestTypeLargeContent } from "../Components/RequestTypeLargeContent"
import { RequestTypePageNavbar } from "./RequestTypePageNavbar"

/**
 * Renders a page layout for a single requesttype entity, including navigation and detailed view.
 *
 * This component wraps `RequestTypePageNavbar` and `RequestTypeLargeCard` to provide a consistent
 * interface for displaying an individual requesttype. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.requesttype - The requesttype entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a requesttype.
 *
 * @example
 * const requesttype = { id: 1, name: "Example RequestType" };
 * <RequestTypePageContent requesttype={requesttype}>
 *   <p>Additional info here.</p>
 * </RequestTypePageContent>
 */
export const RequestTypePageContent = ({requesttype, children, ...props}) => {
    return (<>
        <RequestTypePageNavbar requesttype={requesttype} />
        <RequestTypeLargeCard requesttype={requesttype} {...props} >
            {/* RequestType {JSON.stringify(requesttype)} */}
            <RequestTypeLargeContent requesttype={requesttype} />
            {children}
        </RequestTypeLargeCard>
    </>)
}