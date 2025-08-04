import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { RequestReadPageAsyncAction } from "../Queries"
import { RequestMediumCard } from "../Components"

/**
 * Visualizes a list of request entities using RequestMediumCard.
 *
 * This component receives an array of request objects via the `items` prop
 * and renders a `RequestMediumCard` for each item. Each card is keyed by the request's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of request entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of RequestMediumCard components.
 *
 * @example
 * const requests = [
 *   { id: 1, name: "Request 1", ... },
 *   { id: 2, name: "Request 2", ... }
 * ];
 *
 * <RequestVisualiser items={requests} />
 */
const RequestVisualiser = ({items}) => {
    return (
        <>
            {items.map(request => (
                <RequestMediumCard key={request.id} request={request} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of request entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting requests using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=RequestVisualiser] - 
 *   Optional component used to visualize the loaded requests. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized requests.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display requests filtered by a `where` clause passed in the URL, e.g.:
 * //   /request?where={"name":"Example"}
 * <RequestVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <RequestVectorPage Visualiser={CustomRequestList}>
 *   <Footer />
 * </RequestVectorPage>
 */
export const RequestVectorPage = ({children, Visualiser=RequestVisualiser}) => {
    const { search } = useLocation();
    let actionParams = { skip: 0, limit: 10};
    try {
        const params = new URLSearchParams(search);
        const where = params.get('where');        
        actionParams.where = where ? JSON.parse(where) : undefined;
    } catch (e) {
        console.warn("Invalid 'where' query parameter!", e);
    }
    return (<>
        <MyNavbar onSearchChange={onSearchChange} />
        <InfiniteScroll
            preloadedItems={[]} // No preloaded items for request
            actionParams={actionParams} 
            asyncAction={RequestReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}