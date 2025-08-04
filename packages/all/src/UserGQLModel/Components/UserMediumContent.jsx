import { Col, Row } from "react-bootstrap"
import { UserRolesOnAttributeLazy } from "../Vectors/UserRolesOnsAttribute"
import { UserRolesAttributeLazy } from "../Vectors/UserRolesAttribute"

/**
 * A component that displays medium-level content for an user entity.
 *
 * This component renders a label "UserMediumContent" followed by a serialized representation of the `user` object
 * and any additional child content. It is designed to handle and display information about an user entity object.
 *
 * @component
 * @param {Object} props - The properties for the UserMediumContent component.
 * @param {Object} props.user - The object representing the user entity.
 * @param {string|number} props.user.id - The unique identifier for the user entity.
 * @param {string} props.user.name - The name or label of the user entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `user` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const userEntity = { id: 123, name: "Sample Entity" };
 * 
 * <UserMediumContent user={userEntity}>
 *   <p>Additional information about the entity.</p>
 * </UserMediumContent>
 */
export const UserMediumContent = ({user, children}) => {
    return (
        <>
            {user?.email && <Row>
                <Col>E-mail</Col>
                <Col><a href={`mailto:${user.email}`}>{user.email}</a></Col>
            </Row>}
            {/* <hr />
            <UserRolesAttributeLazy user={user} />
            <hr />
            Nadřízení <br/>
            <UserRolesOnAttributeLazy user={user} />
            
            <hr /> */}
            {/* $UserMediumContent$ <br />
            {JSON.stringify(user)}
            $UserMediumContent$ */}
            {children}
        </>
    )
}
