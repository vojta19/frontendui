import { RequestLargeCard } from "../Components"
import { RequestLargeContent } from "../Components/RequestLargeContent"
import { RequestPageNavbar } from "./RequestPageNavbar"

/**
 * Renders a page layout for a single request entity, including navigation and detailed view.
 *
 * This component wraps `RequestPageNavbar` and `RequestLargeCard` to provide a consistent
 * interface for displaying an individual request. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.request - The request entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a request.
 *
 * @example
 * const request = { id: 1, name: "Example Request" };
 * <RequestPageContent request={request}>
 *   <p>Additional info here.</p>
 * </RequestPageContent>
 */
export const RequestPageContent = ({request, children, ...props}) => {
    return (<>
        <RequestPageNavbar request={request} />
        <RequestLargeCard request={request} {...props} >
            <RequestLargeContent request={request} />
            Request {JSON.stringify(request)}
            {children}
        </RequestLargeCard>
    </>)
}