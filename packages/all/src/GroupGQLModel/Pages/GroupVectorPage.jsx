import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { GroupReadPageAsyncAction } from "../Queries"
import { GroupMediumCard } from "../Components"

/**
 * Visualizes a list of group entities using GroupMediumCard.
 *
 * This component receives an array of group objects via the `items` prop
 * and renders a `GroupMediumCard` for each item. Each card is keyed by the group's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of group entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of GroupMediumCard components.
 *
 * @example
 * const groups = [
 *   { id: 1, name: "Group 1", ... },
 *   { id: 2, name: "Group 2", ... }
 * ];
 *
 * <GroupVisualiser items={groups} />
 */
const GroupVisualiser = ({items}) => {
    return (
        <>
            {items.map(group => (
                <GroupMediumCard key={group.id} group={group} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of group entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting groups using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=GroupVisualiser] - 
 *   Optional component used to visualize the loaded groups. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized groups.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display groups filtered by a `where` clause passed in the URL, e.g.:
 * //   /group?where={"name":"Example"}
 * <GroupVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <GroupVectorPage Visualiser={CustomGroupList}>
 *   <Footer />
 * </GroupVectorPage>
 */
export const GroupVectorPage = ({children, Visualiser=GroupVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for group
            actionParams={actionParams} 
            asyncAction={GroupReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}