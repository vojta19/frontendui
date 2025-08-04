import { useParams } from "react-router"
import { DigitalFormFieldPageContentLazy } from "./DigitalFormFieldPageContentLazy"

/**
 * A page component for displaying lazy-loaded content of a digitalformfield entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `digitalformfield` object, and passes it to the `DigitalFormFieldPageContentLazy` component.
 * The `DigitalFormFieldPageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `digitalformfield`: the fetched digitalformfield entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { digitalformfield: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `DigitalFormFieldPageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the digitalformfield entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/digitalformfield/:id" element={<DigitalFormFieldPage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/digitalformfield/:id"
 *   element={
 *     <DigitalFormFieldPage>
 *       {({ digitalformfield, onChange, onBlur }) => (
 *         <input value={digitalformfield.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalFormFieldPage>
 *   }
 * />
 */

export const DigitalFormFieldPage = ({children}) => {
    const {id} = useParams()
    const digitalformfield = {id}
    return (
        <DigitalFormFieldPageContentLazy digitalformfield={digitalformfield}>
            {children}
        </DigitalFormFieldPageContentLazy>
    )
}