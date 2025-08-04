import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionSectionReadPageAsyncAction } from "../Queries"
import { DigitalSubmissionSectionMediumCard } from "../Components"

/**
 * Visualizes a list of digitalsubmissionsection entities using DigitalSubmissionSectionMediumCard.
 *
 * This component receives an array of digitalsubmissionsection objects via the `items` prop
 * and renders a `DigitalSubmissionSectionMediumCard` for each item. Each card is keyed by the digitalsubmissionsection's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of digitalsubmissionsection entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of DigitalSubmissionSectionMediumCard components.
 *
 * @example
 * const digitalsubmissionsections = [
 *   { id: 1, name: "DigitalSubmissionSection 1", ... },
 *   { id: 2, name: "DigitalSubmissionSection 2", ... }
 * ];
 *
 * <DigitalSubmissionSectionVisualiser items={digitalsubmissionsections} />
 */
const DigitalSubmissionSectionVisualiser = ({items}) => {
    return (
        <>
            {items.map(digitalsubmissionsection => (
                <DigitalSubmissionSectionMediumCard key={digitalsubmissionsection.id} digitalsubmissionsection={digitalsubmissionsection} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of digitalsubmissionsection entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting digitalsubmissionsections using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=DigitalSubmissionSectionVisualiser] - 
 *   Optional component used to visualize the loaded digitalsubmissionsections. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized digitalsubmissionsections.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display digitalsubmissionsections filtered by a `where` clause passed in the URL, e.g.:
 * //   /digitalsubmissionsection?where={"name":"Example"}
 * <DigitalSubmissionSectionVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <DigitalSubmissionSectionVectorPage Visualiser={CustomDigitalSubmissionSectionList}>
 *   <Footer />
 * </DigitalSubmissionSectionVectorPage>
 */
export const DigitalSubmissionSectionVectorPage = ({children, Visualiser=DigitalSubmissionSectionVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for digitalsubmissionsection
            actionParams={actionParams} 
            asyncAction={DigitalSubmissionSectionReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}