import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { RequestTypeReadPageAsyncAction } from "../Queries"
import { RequestTypeMediumCard } from "../Components"

/**
 * Visualizes a list of requesttype entities using RequestTypeMediumCard.
 *
 * This component receives an array of requesttype objects via the `items` prop
 * and renders a `RequestTypeMediumCard` for each item. Each card is keyed by the requesttype's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of requesttype entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of RequestTypeMediumCard components.
 *
 * @example
 * const requesttypes = [
 *   { id: 1, name: "RequestType 1", ... },
 *   { id: 2, name: "RequestType 2", ... }
 * ];
 *
 * <RequestTypeVisualiser items={requesttypes} />
 */
const RequestTypeVisualiser = ({items}) => {
    return (
        <>
            {items.map(requesttype => (
                <RequestTypeMediumCard key={requesttype.id} requesttype={requesttype} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of requesttype entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting requesttypes using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=RequestTypeVisualiser] - 
 *   Optional component used to visualize the loaded requesttypes. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized requesttypes.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display requesttypes filtered by a `where` clause passed in the URL, e.g.:
 * //   /requesttype?where={"name":"Example"}
 * <RequestTypeVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <RequestTypeVectorPage Visualiser={CustomRequestTypeList}>
 *   <Footer />
 * </RequestTypeVectorPage>
 */
export const RequestTypeVectorPage = ({children, Visualiser=RequestTypeVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for requesttype
            actionParams={actionParams} 
            asyncAction={RequestTypeReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}