import { PersonFill } from "react-bootstrap-icons" // ikonka pro záhlaví karty
import { Link } from "./Link" // komponenta místního odkazu pro zobrazení položky
import { CardCapsule as CardCapsule_ } from "../../../../_template/src/Base/Components" // základní kard komponenta

/**
 * A specialized card component that renders a title and encapsulates children content.
 *
 * This component wraps the base `CardCapsule` component and provides a default title
 * that includes an icon plus a link rendered from the provided `item`.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.item - The object representing the item entity.
 * @param {string|number} props.item.id - The unique identifier for the item.
 * @param {string} props.item.name - The display name for the item.
 * @param {React.ReactNode} [props.children=null] - Content rendered inside the card body.
 * @param {JSX.Element|null} [props.title=null] - Custom title element, overrides default title.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * import { CardCapsule } from './CardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const item = { id: 123, name: "Example Entity" };
 *
 * <CardCapsule item={item}>
 *   <Button variant="primary">Click Me</Button>
 * </CardCapsule>
 */
export const CardCapsule = ({ item, children, title = null }) => { // komponenta přijímá položku, potomky a volitelný titul
    if (!title) { // pokud není poskytnut vlastní titul, vytvoříme výchozí
        title = (
            <> {/* fragment pro kombinaci ikonky a odkazu */}
                <PersonFill /> {/* ikona osoby v titulku */}
                <Link item={item} /> {/* lokální odkaz na položku */}
            </>
        )
    }

    return (
        <CardCapsule_ title={title}> {/* render základní kapsle s titulkem */}
            {children} {/* obsah karty předaný z rodiče */}
        </CardCapsule_>
    )
}
