import { MegaphoneFill, PencilFill } from "react-bootstrap-icons"
import { SimpleCardCapsuleRightCorner } from "../../Base/Components"
import { ReadItemURI } from "../Components"
import { UpdateLink } from "../Mutations/Update"
import { ReadAsyncAction } from "../Queries"
import { UserMembershipsTable } from "../Vectors/UserMemberships"
import { PageReadItem } from "./PageReadItem"
import { UserRolesTable } from "../Vectors/UserRoles"

export const UserMembershipsURI = ReadItemURI.replace("view", "memberships")

export const PageReadUserMemberships = ({ 
    queryAsyncAction=ReadAsyncAction
}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={UserMembershipsTableSubPage}/>
)

const UserMembershipsTableSubPage = ({ item }) => (
    <UserMembershipsTable item={item}>
        <SimpleCardCapsuleRightCorner>
            <UpdateLink item={item} className="btn btn-sm btn-link">
                <PencilFill />
            </UpdateLink>
        </SimpleCardCapsuleRightCorner>
    </UserMembershipsTable>
)

export const UserRolesURI = ReadItemURI.replace("view", "roles")

export const PageReadUserRoles = ({ 
    queryAsyncAction=ReadAsyncAction
}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={UserRolesTableSubPage}/>
)

const UserRolesTableSubPage = ({ item }) => (
    <UserRolesTable item={item}>
        <SimpleCardCapsuleRightCorner>
            <UpdateLink item={item} className="btn btn-sm btn-link">
                <PencilFill />
            </UpdateLink>
        </SimpleCardCapsuleRightCorner>
    </UserRolesTable>
)