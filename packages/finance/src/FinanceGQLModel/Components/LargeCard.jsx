import {
    CardCapsule as DefaultCardCapsule
} from "./CardCapsule";

import {
    MediumContent as DefaultMediumContent
} from "./MediumContent";

import {
    InteractiveMutations
} from "../Mutations/InteractiveMutations";

import {
    Row
} from "../../../../_template/src/Base/Components/Row";

import {
    LeftColumn,
    MiddleColumn
} from "../../../../_template/src/Base/Components/Col";


/**
 * Displays the main two-column detail layout of a finance entity.
 *
 * The left column contains the finance details and available mutation
 * controls. The middle column is reserved for additional content such as
 * visualizations, scalar attributes or vector attributes.
 *
 * The default card and detail components can be replaced through component
 * properties, which allows the layout to be reused with custom rendering
 * implementations.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity displayed by the layout.
 *
 * @param {string} [props.item.id]
 * Unique identifier of the finance entity.
 *
 * @param {string} [props.item.name]
 * Display name of the finance entity.
 *
 * @param {React.ReactNode} [props.children]
 * Additional content rendered in the middle column.
 *
 * @param {React.ComponentType<Object>} [props.CardCapsule=DefaultCardCapsule]
 * Card component used to render the outer container and detail section.
 *
 * @param {React.ComponentType<Object>} [props.MediumContent=DefaultMediumContent]
 * Component used to render the finance detail attributes.
 *
 * @returns {JSX.Element}
 * Two-column finance detail layout.
 *
 * @example
 * <LargeCard item={finance}>
 *     <FinanceTransferSunburst item={finance} />
 * </LargeCard>
 */
export const LargeCard = ({
    item,
    children,
    CardCapsule = DefaultCardCapsule,
    MediumContent = DefaultMediumContent
}) => {
    return (
        <CardCapsule item={item}>
            <Row>
                <LeftColumn>
                    <CardCapsule
                        item={item}
                        title="Detail"
                    >
                        <MediumContent item={item} />
                    </CardCapsule>

                    <InteractiveMutations item={item} />
                </LeftColumn>

                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    );
};