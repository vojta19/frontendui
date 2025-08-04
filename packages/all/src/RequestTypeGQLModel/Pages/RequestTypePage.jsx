import { useParams } from "react-router"
import { RequestTypePageContentLazy } from "./RequestTypePageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a requesttype entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `requesttype` object, and passes it to the `RequestTypePageContentLazy` component.
 * The `RequestTypePageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `requesttype`: the fetched requesttype entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { requesttype: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `RequestTypePageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the requesttype entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/requesttype/:id" element={<RequestTypePage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/requesttype/:id"
 *   element={
 *     <RequestTypePage>
 *       {({ requesttype, onChange, onBlur }) => (
 *         <input value={requesttype.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </RequestTypePage>
 *   }
 * />
 */

export const RequestTypePage = ({children}) => {
    const {id} = useParams()
    const requesttype = {id}
    return (
        <RequestTypePageContentLazy requesttype={requesttype}>
            {children}
        </RequestTypePageContentLazy>
    )
}