import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionFieldReadPageAsyncAction } from "../Queries"
import { DigitalSubmissionFieldMediumCard } from "../Components"

/**
 * Visualizes a list of digitalsubmissionfield entities using DigitalSubmissionFieldMediumCard.
 *
 * This component receives an array of digitalsubmissionfield objects via the `items` prop
 * and renders a `DigitalSubmissionFieldMediumCard` for each item. Each card is keyed by the digitalsubmissionfield's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of digitalsubmissionfield entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of DigitalSubmissionFieldMediumCard components.
 *
 * @example
 * const digitalsubmissionfields = [
 *   { id: 1, name: "DigitalSubmissionField 1", ... },
 *   { id: 2, name: "DigitalSubmissionField 2", ... }
 * ];
 *
 * <DigitalSubmissionFieldVisualiser items={digitalsubmissionfields} />
 */
const DigitalSubmissionFieldVisualiser = ({items}) => {
    return (
        <>
            {items.map(digitalsubmissionfield => (
                <DigitalSubmissionFieldMediumCard key={digitalsubmissionfield.id} digitalsubmissionfield={digitalsubmissionfield} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of digitalsubmissionfield entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting digitalsubmissionfields using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=DigitalSubmissionFieldVisualiser] - 
 *   Optional component used to visualize the loaded digitalsubmissionfields. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized digitalsubmissionfields.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display digitalsubmissionfields filtered by a `where` clause passed in the URL, e.g.:
 * //   /digitalsubmissionfield?where={"name":"Example"}
 * <DigitalSubmissionFieldVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <DigitalSubmissionFieldVectorPage Visualiser={CustomDigitalSubmissionFieldList}>
 *   <Footer />
 * </DigitalSubmissionFieldVectorPage>
 */
export const DigitalSubmissionFieldVectorPage = ({children, Visualiser=DigitalSubmissionFieldVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for digitalsubmissionfield
            actionParams={actionParams} 
            asyncAction={DigitalSubmissionFieldReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}