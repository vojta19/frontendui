import { useParams } from "react-router"
import { DigitalSubmissionPageContentLazy } from "./DigitalSubmissionPageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a digitalsubmission entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `digitalsubmission` object, and passes it to the `DigitalSubmissionPageContentLazy` component.
 * The `DigitalSubmissionPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `digitalsubmission`: the fetched digitalsubmission entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { digitalsubmission: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `DigitalSubmissionPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the digitalsubmission entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/digitalsubmission/:id" element={<DigitalSubmissionPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/digitalsubmission/:id"
 *   element={
 *     <DigitalSubmissionPage>
 *       {({ digitalsubmission, onChange, onBlur }) => (
 *         <input value={digitalsubmission.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalSubmissionPage>
 *   }
 * />
 */

export const DigitalSubmissionPage = ({children}) => {
    const {id} = useParams()
    const digitalsubmission = {id}
    return (
        <DigitalSubmissionPageContentLazy digitalsubmission={digitalsubmission}>
            {children}
        </DigitalSubmissionPageContentLazy>
    )
}