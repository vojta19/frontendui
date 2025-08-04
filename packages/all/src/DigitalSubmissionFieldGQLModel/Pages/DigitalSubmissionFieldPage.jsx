import { useParams } from "react-router"
import { DigitalSubmissionFieldPageContentLazy } from "./DigitalSubmissionFieldPageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a digitalsubmissionfield entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `digitalsubmissionfield` object, and passes it to the `DigitalSubmissionFieldPageContentLazy` component.
 * The `DigitalSubmissionFieldPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `digitalsubmissionfield`: the fetched digitalsubmissionfield entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { digitalsubmissionfield: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `DigitalSubmissionFieldPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the digitalsubmissionfield entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/digitalsubmissionfield/:id" element={<DigitalSubmissionFieldPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/digitalsubmissionfield/:id"
 *   element={
 *     <DigitalSubmissionFieldPage>
 *       {({ digitalsubmissionfield, onChange, onBlur }) => (
 *         <input value={digitalsubmissionfield.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalSubmissionFieldPage>
 *   }
 * />
 */

export const DigitalSubmissionFieldPage = ({children}) => {
    const {id} = useParams()
    const digitalsubmissionfield = {id}
    return (
        <DigitalSubmissionFieldPageContentLazy digitalsubmissionfield={digitalsubmissionfield}>
            {children}
        </DigitalSubmissionFieldPageContentLazy>
    )
}