import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const DigitalFormLinkFragment = createQueryStrLazy(`
fragment DigitalFormLinkFragment on DigitalFormGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  nameEn
  description
  stateId
  parentId
  typeId
}
`);

export const DigitalFormMediumFragment = createQueryStrLazy(`
fragment DigitalFormMediumFragment on DigitalFormGQLModel {
  ...DigitalFormLinkFragment
  createdby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
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
    isThisMe
    gdpr
    fullname
  }
  changedby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
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
    isThisMe
    gdpr
    fullname
  }
  rbacobject {
    __typename
    id
  }
  state {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
    statemachineId
    writerslistId
    readerslistId
    order

  }
  type {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
    description
    parentId
  }
}
`, DigitalFormLinkFragment);

export const DigitalFormLargeFragment = createQueryStrLazy(`
fragment DigitalFormLargeFragment on DigitalFormGQLModel {
  ...DigitalFormMediumFragment
}
`, DigitalFormMediumFragment);
