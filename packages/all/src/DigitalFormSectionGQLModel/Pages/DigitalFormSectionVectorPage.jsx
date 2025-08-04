import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormSectionReadPageAsyncAction } from "../Queries"
import { DigitalFormSectionMediumCard } from "../Components"

/**
 * Visualizes a list of digitalformsection entities using DigitalFormSectionMediumCard.
 *
 * This component receives an array of digitalformsection objects via the `items` prop
 * and renders a `DigitalFormSectionMediumCard` for each item. Each card is keyed by the digitalformsection's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of digitalformsection entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of DigitalFormSectionMediumCard components.
 *
 * @example
 * const digitalformsections = [
 *   { id: 1, name: "DigitalFormSection 1", ... },
 *   { id: 2, name: "DigitalFormSection 2", ... }
 * ];
 *
 * <DigitalFormSectionVisualiser items={digitalformsections} />
 */
const DigitalFormSectionVisualiser = ({items}) => {
    return (
        <>
            {items.map(digitalformsection => (
                <DigitalFormSectionMediumCard key={digitalformsection.id} digitalformsection={digitalformsection} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of digitalformsection entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting digitalformsections using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=DigitalFormSectionVisualiser] - 
 *   Optional component used to visualize the loaded digitalformsections. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized digitalformsections.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display digitalformsections filtered by a `where` clause passed in the URL, e.g.:
 * //   /digitalformsection?where={"name":"Example"}
 * <DigitalFormSectionVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <DigitalFormSectionVectorPage Visualiser={CustomDigitalFormSectionList}>
 *   <Footer />
 * </DigitalFormSectionVectorPage>
 */
export const DigitalFormSectionVectorPage = ({children, Visualiser=DigitalFormSectionVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for digitalformsection
            actionParams={actionParams} 
            asyncAction={DigitalFormSectionReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}