import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const DigitalSubmissionSectionLinkFragment = createQueryStrLazy(`
fragment DigitalSubmissionSectionLinkFragment on DigitalSubmissionSectionGQLModel {
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
`);

export const DigitalSubmissionSectionMediumFragment = createQueryStrLazy(`
fragment DigitalSubmissionSectionMediumFragment on DigitalSubmissionSectionGQLModel {
  ...DigitalSubmissionSectionLinkFragment
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
  section {
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
  formSection {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    path
    label
    labelEn
    description
    parentId
    order
    repatableMin
    repatableMax
    repeatable
  }
  submission {
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
`, DigitalSubmissionSectionLinkFragment);

export const DigitalSubmissionSectionLargeFragment = createQueryStrLazy(`
fragment DigitalSubmissionSectionLargeFragment on DigitalSubmissionSectionGQLModel {
  ...DigitalSubmissionSectionMediumFragment
}
`, DigitalSubmissionSectionMediumFragment);
