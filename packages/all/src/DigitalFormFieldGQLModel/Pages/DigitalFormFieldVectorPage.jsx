import { useLocation } from "react-router"
import { InfiniteScroll, MyNavbar } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormFieldReadPageAsyncAction } from "../Queries"
import { DigitalFormFieldMediumCard } from "../Components"

/**
 * Visualizes a list of digitalformfield entities using DigitalFormFieldMediumCard.
 *
 * This component receives an array of digitalformfield objects via the `items` prop
 * and renders a `DigitalFormFieldMediumCard` for each item. Each card is keyed by the digitalformfield's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of digitalformfield entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of DigitalFormFieldMediumCard components.
 *
 * @example
 * const digitalformfields = [
 *   { id: 1, name: "DigitalFormField 1", ... },
 *   { id: 2, name: "DigitalFormField 2", ... }
 * ];
 *
 * <DigitalFormFieldVisualiser items={digitalformfields} />
 */
const DigitalFormFieldVisualiser = ({items}) => {
    return (
        <>
            {items.map(digitalformfield => (
                <DigitalFormFieldMediumCard key={digitalformfield.id} digitalformfield={digitalformfield} />
            ))}
        </>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of digitalformfield entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting digitalformfields using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=DigitalFormFieldVisualiser] - 
 *   Optional component used to visualize the loaded digitalformfields. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized digitalformfields.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display digitalformfields filtered by a `where` clause passed in the URL, e.g.:
 * //   /digitalformfield?where={"name":"Example"}
 * <DigitalFormFieldVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <DigitalFormFieldVectorPage Visualiser={CustomDigitalFormFieldList}>
 *   <Footer />
 * </DigitalFormFieldVectorPage>
 */
export const DigitalFormFieldVectorPage = ({children, Visualiser=DigitalFormFieldVisualiser}) => {
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
            preloadedItems={[]} // No preloaded items for digitalformfield
            actionParams={actionParams} 
            asyncAction={DigitalFormFieldReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}