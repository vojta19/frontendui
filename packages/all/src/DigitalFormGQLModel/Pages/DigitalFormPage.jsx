import { useParams } from "react-router"
import { DigitalFormPageContentLazy } from "./DigitalFormPageContentLazy"
import { DigitalFormLargeContent } from "../Components/DigitalFormLargeContent"

/**
 * A page component for displaying lazy-loaded content of a digitalform entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `digitalform` object, and passes it to the `DigitalFormPageContentLazy` component.
 * The `DigitalFormPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `digitalform`: the fetched digitalform entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { digitalform: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `DigitalFormPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the digitalform entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/digitalform/:id" element={<DigitalFormPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/digitalform/:id"
 *   element={
 *     <DigitalFormPage>
 *       {({ digitalform, onChange, onBlur }) => (
 *         <input value={digitalform.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalFormPage>
 *   }
 * />
 */

export const DigitalFormPage = ({children}) => {
    const {id} = useParams()
    const digitalform = {id}
    return (
        <DigitalFormPageContentLazy digitalform={digitalform}>
            <DigitalFormLargeContent />
            {children}
        </DigitalFormPageContentLazy>
    )
}