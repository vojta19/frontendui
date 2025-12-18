import { TemplateUI } from "../../Template"
import { CardCapsule } from "./CardCapsule"
import { MediumContent } from "./MediumContent"


/**
 * A large card component for displaying detailed content and layout for an template entity.
 *
 * This component wraps an `TemplateCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `TemplateMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the TemplateLargeCard component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateLargeCard template={templateEntity}>
 *   <p>Additional content for the middle column.</p>
 * </TemplateLargeCard>
 */
export const LargeCard = ({ item, children }) => <TemplateUI.LargeCard item={item} children={children} CardCapsule={CardCapsule} MediumContent={MediumContent}/>
