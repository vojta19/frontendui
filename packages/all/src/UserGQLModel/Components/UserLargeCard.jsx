import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { UserCardCapsule } from "./UserCardCapsule"
import { UserMediumCard } from "./UserMediumCard"
import { UserRolesAttributeLazy } from "../Vectors/UserRolesAttribute"
import { UserRolesOnAttributeLazy } from "../Vectors/UserRolesOnsAttribute"

/**
 * A large card component for displaying detailed content and layout for an user entity.
 *
 * This component wraps an `UserCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `UserMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the UserLargeCard component.
 * @param {Object} props.user - The object representing the user entity.
 * @param {string|number} props.user.id - The unique identifier for the user entity.
 * @param {string} props.user.name - The name or label of the user entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const userEntity = { id: 123, name: "Sample Entity" };
 * 
 * <UserLargeCard user={userEntity}>
 *   <p>Additional content for the middle column.</p>
 * </UserLargeCard>
 */
export const UserLargeCard = ({user, children}) => {
    return (
        <UserCardCapsule user={user} >
            <Row>
                <LeftColumn>
                    <UserMediumCard user={user}>
                        <hr />
                        <UserRolesAttributeLazy user={user} />
                        <hr />
                        Nadřízení <br/>
                        <UserRolesOnAttributeLazy user={user} />
                        <hr />
                    </UserMediumCard>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </UserCardCapsule>
    )
}
