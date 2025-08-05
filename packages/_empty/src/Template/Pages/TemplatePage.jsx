import { useParams } from "react-router"
import { TemplatePageContentLazy } from "./TemplatePageContentLazy"
import { TemplateLargeContent } from "../Components/TemplateLargeContent"

/**
 * A page component for displaying lazy-loaded content of a template entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs a `template` object, and passes it to the `TemplatePageContentLazy` component.
 * The `TemplatePageContentLazy` handles fetching and rendering of the entity's data.
 *
 * The `children` prop can be a render function that receives:
 * - `template`: the fetched template entity,
 * - `onChange`: a callback for change events,
 * - `onBlur`: a callback for blur events.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(params: { template: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function that will be passed to `TemplatePageContentLazy`.
 *
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the template entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/template/:id" element={<TemplatePage />} />
 *
 * // Or using children as a render function:
 * <Route
 *   path="/template/:id"
 *   element={
 *     <TemplatePage>
 *       {({ template, onChange, onBlur }) => (
 *         <input value={template.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </TemplatePage>
 *   }
 * />
 */

export const TemplatePage = ({children}) => {
    const {id} = useParams()
    const template = {id}
    return (
        <TemplatePageContentLazy template={template}>
            {/* the parameters `template={template}` are injected in `TemplatePageContentLazy` */}
            <TemplateLargeContent /> 
            {children}
        </TemplatePageContentLazy>
    )
}