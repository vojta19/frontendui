import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const DigitalSubmissionLinkFragment = createQueryStrLazy(`
fragment DigitalSubmissionLinkFragment on DigitalSubmissionGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  nameEn
  stateId
  formId
  parentId
}
`);

export const DigitalSubmissionMediumFragment = createQueryStrLazy(`
fragment DigitalSubmissionMediumFragment on DigitalSubmissionGQLModel {
  ...DigitalSubmissionLinkFragment
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
    userCanWithState
    userCanWithoutState
  }
  form {
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
  parent {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
    stateId
    formId
    parentId
  }
}
`, DigitalSubmissionLinkFragment);

export const DigitalSubmissionLargeFragment = createQueryStrLazy(`
fragment DigitalSubmissionLargeFragment on DigitalSubmissionGQLModel {
  ...DigitalSubmissionMediumFragment
  submittedSectionsAll {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    path
    index
    stateId
    sectionId
    formSectionId
    submissionId
  }
}
`, DigitalSubmissionMediumFragment);
