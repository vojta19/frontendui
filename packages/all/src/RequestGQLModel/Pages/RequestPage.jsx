import { useParams } from "react-router"
import { RequestPageContentLazy } from "./RequestPageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a request entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `request` object, and passes it to the `RequestPageContentLazy` component.
 * The `RequestPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `request`: the fetched request entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { request: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `RequestPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the request entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/request/:id" element={<RequestPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/request/:id"
 *   element={
 *     <RequestPage>
 *       {({ request, onChange, onBlur }) => (
 *         <input value={request.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </RequestPage>
 *   }
 * />
 */

export const RequestPage = ({children}) => {
    const {id} = useParams()
    const request = {id}
    return (
        <RequestPageContentLazy request={request}>
            {children}
        </RequestPageContentLazy>
    )
}