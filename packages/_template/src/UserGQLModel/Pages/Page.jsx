import { useParams } from "react-router"
import { PageContent } from "./PageContent"
import { ReadAsyncAction } from "../Queries"
import { MediumCardVectors } from "../Vectors/VectorAttribute"
import { MediumCardScalars } from "../Scalars/ScalarAttribute"
import { PlaceChild } from "../../Template/Utils/PlaceChild"
import { LiveEdit } from "../Components/LiveEdit"
import { ConfirmEdit } from "../Components/ConfirmEdit"
import { AsyncActionProvider } from "../../Template/Utils/GQLEntityProvider"

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
export const PageWrap = ({ children }) => {
    // const {id} = useParams()
    const id = "51d101a0-81f1-44ca-8366-6cf51432e8d6";
    const item = {id}
    return (
        // <div>Hello</div>
        <AsyncActionProvider item={item} queryAsyncAction={ReadAsyncAction}>
            <PageContent>
                {children}
            </PageContent>
            {/* {children} */}
        </AsyncActionProvider>
    )
}



export const Page = () => {
    return (
        // <div>Hello</div>
        <PageWrap>
            <PlaceChild Component={MediumCardScalars} />
            <PlaceChild Component={MediumCardVectors} />
        </PageWrap>
    )
}

export const PageEdit = () => {
    return (
        // <div>Hello</div>
        <PageWrap>
            <PlaceChild Component={LiveEdit} />
            <hr />
            <PlaceChild Component={ConfirmEdit} />
        </PageWrap>
    )
}

