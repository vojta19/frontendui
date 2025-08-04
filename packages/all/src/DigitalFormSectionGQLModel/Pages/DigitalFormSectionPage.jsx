import { useParams } from "react-router"
import { DigitalFormSectionPageContentLazy } from "./DigitalFormSectionPageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a digitalformsection entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `digitalformsection` object, and passes it to the `DigitalFormSectionPageContentLazy` component.
 * The `DigitalFormSectionPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `digitalformsection`: the fetched digitalformsection entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { digitalformsection: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `DigitalFormSectionPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the digitalformsection entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/digitalformsection/:id" element={<DigitalFormSectionPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/digitalformsection/:id"
 *   element={
 *     <DigitalFormSectionPage>
 *       {({ digitalformsection, onChange, onBlur }) => (
 *         <input value={digitalformsection.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalFormSectionPage>
 *   }
 * />
 */

export const DigitalFormSectionPage = ({children}) => {
    const {id} = useParams()
    const digitalformsection = {id}
    return (
        <DigitalFormSectionPageContentLazy digitalformsection={digitalformsection}>
            {children}
        </DigitalFormSectionPageContentLazy>
    )
}