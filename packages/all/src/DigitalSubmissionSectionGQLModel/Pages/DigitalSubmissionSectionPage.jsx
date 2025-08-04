import { useParams } from "react-router"
import { DigitalSubmissionSectionPageContentLazy } from "./DigitalSubmissionSectionPageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a digitalsubmissionsection entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `digitalsubmissionsection` object, and passes it to the `DigitalSubmissionSectionPageContentLazy` component.
 * The `DigitalSubmissionSectionPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `digitalsubmissionsection`: the fetched digitalsubmissionsection entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { digitalsubmissionsection: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `DigitalSubmissionSectionPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the digitalsubmissionsection entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/digitalsubmissionsection/:id" element={<DigitalSubmissionSectionPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/digitalsubmissionsection/:id"
 *   element={
 *     <DigitalSubmissionSectionPage>
 *       {({ digitalsubmissionsection, onChange, onBlur }) => (
 *         <input value={digitalsubmissionsection.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalSubmissionSectionPage>
 *   }
 * />
 */

export const DigitalSubmissionSectionPage = ({children}) => {
    const {id} = useParams()
    const digitalsubmissionsection = {id}
    return (
        <DigitalSubmissionSectionPageContentLazy digitalsubmissionsection={digitalsubmissionsection}>
            {children}
        </DigitalSubmissionSectionPageContentLazy>
    )
}