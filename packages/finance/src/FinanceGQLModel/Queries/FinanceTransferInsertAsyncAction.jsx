import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"

const FinanceTransferInsertMutationStr = `
mutation financeTransferInsert(
  $financeTransfer_financeSourceId: UUID!
  $financeTransfer_financeDestinationId: UUID!
  $financeTransfer_name: String
  $financeTransfer_amount: Float
  $financeTransfer_id: UUID
) {
  financeTransferInsert(
    financeTransfer: {
      financeSourceId: $financeTransfer_financeSourceId
      financeDestinationId: $financeTransfer_financeDestinationId
      name: $financeTransfer_name
      amount: $financeTransfer_amount
      id: $financeTransfer_id
    }
  ) {
    ... on FinanceTransferGQLModel {
      ...FinanceTransfer
    }

    ... on FinanceTransferGQLModelInsertError {
      ...FinanceTransferGQLModelInsertError
    }
  }
}

fragment User on UserGQLModel {
  __typename
  id
  studies { id }
  invitations { id }
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { id }
  changedby { id }
  rbacobject { id }
  name
  givenname
  middlename
  email
  firstname
  surname
  valid
  startdate
  enddate
  typeId
  memberships { id }
  roles { id }
  isThisMe
  rolesOn { id }
  gdpr
  fullname
  memberOf { id }
}

fragment RBACObject on RBACObjectGQLModel {
  __typename
  id
  roles { id }
  currentUserRoles { id }
}

fragment Finance on FinanceGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { id }
  changedby { id }
  rbacobject { id }
  path
  name
  nameEn
  value
  description
  financeTypeId
  masterfinanceId
  masterfinance { id }
  subfinances { id }
  type { id }
  projectId
  project { id }
}

fragment FinanceTransfer on FinanceTransferGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId

  createdby {
    ...User
  }

  changedby {
    ...User
  }

  rbacobject {
    ...RBACObject
  }

  name
  financeSourceId
  financeDestinationId
  amount
  startdate

  financeSource {
    ...Finance
  }

  financeDestination {
    ...Finance
  }
}

fragment FinanceTransferGQLModelInsertError on FinanceTransferGQLModelInsertError {
  __typename

  Entity {
    ...FinanceTransfer
  }

  msg
  failed
  code
  location
  input
}
`

const FinanceTransferInsertMutation = createQueryStrLazy(
    `${FinanceTransferInsertMutationStr}`
)

export const FinanceTransferInsertAsyncAction =
    createAsyncGraphQLAction2(FinanceTransferInsertMutation)