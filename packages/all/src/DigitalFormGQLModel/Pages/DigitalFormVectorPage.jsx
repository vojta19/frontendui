import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormReadPageAsyncAction } from "../Queries"
import { DigitalFormMediumCard } from "../Components"

/**
 * Visualizes a list of digitalform entities using DigitalFormMediumCard.
 *
 * This component receives an array of digitalform objects via the `items` prop
 * and renders a `DigitalFormMediumCard` for each item. Each card is keyed by the digitalform's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of digitalform entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of DigitalFormMediumCard components.
 *
 * @example
 * const digitalforms = [
 *   { id: 1, name: "DigitalForm 1", ... },
 *   { id: 2, name: "DigitalForm 2", ... }
 * ];
 *
 * <DigitalFormVisualiser items={digitalforms} />
 */
const DigitalFormVisualiser = ({items}) => {
    return (
        <>
            {items.map(digitalform => (
                <DigitalFormMediumCard key={digitalform.id} digitalform={digitalform} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of digitalform entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting digitalforms using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=DigitalFormVisualiser] - 
 *   Optional component used to visualize the loaded digitalforms. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized digitalforms.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display digitalforms filtered by a `where` clause passed in the URL, e.g.:
 * //   /digitalform?where={"name":"Example"}
 * <DigitalFormVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <DigitalFormVectorPage Visualiser={CustomDigitalFormList}>
 *   <Footer />
 * </DigitalFormVectorPage>
 */
export const DigitalFormVectorPage = ({children, Visualiser=DigitalFormVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for digitalform
            actionParams={actionParams} 
            asyncAction={DigitalFormReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}