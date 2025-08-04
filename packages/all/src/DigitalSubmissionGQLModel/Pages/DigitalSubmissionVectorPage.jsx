import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionReadPageAsyncAction } from "../Queries"
import { DigitalSubmissionMediumCard } from "../Components"

/**
 * Visualizes a list of digitalsubmission entities using DigitalSubmissionMediumCard.
 *
 * This component receives an array of digitalsubmission objects via the `items` prop
 * and renders a `DigitalSubmissionMediumCard` for each item. Each card is keyed by the digitalsubmission's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of digitalsubmission entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of DigitalSubmissionMediumCard components.
 *
 * @example
 * const digitalsubmissions = [
 *   { id: 1, name: "DigitalSubmission 1", ... },
 *   { id: 2, name: "DigitalSubmission 2", ... }
 * ];
 *
 * <DigitalSubmissionVisualiser items={digitalsubmissions} />
 */
const DigitalSubmissionVisualiser = ({items}) => {
    return (
        <>
            {items.map(digitalsubmission => (
                <DigitalSubmissionMediumCard key={digitalsubmission.id} digitalsubmission={digitalsubmission} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of digitalsubmission entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting digitalsubmissions using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=DigitalSubmissionVisualiser] - 
 *   Optional component used to visualize the loaded digitalsubmissions. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized digitalsubmissions.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display digitalsubmissions filtered by a `where` clause passed in the URL, e.g.:
 * //   /digitalsubmission?where={"name":"Example"}
 * <DigitalSubmissionVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <DigitalSubmissionVectorPage Visualiser={CustomDigitalSubmissionList}>
 *   <Footer />
 * </DigitalSubmissionVectorPage>
 */
export const DigitalSubmissionVectorPage = ({children, Visualiser=DigitalSubmissionVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for digitalsubmission
            actionParams={actionParams} 
            asyncAction={DigitalSubmissionReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}