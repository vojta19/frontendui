import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const DigitalSubmissionFieldLinkFragment = createQueryStrLazy(`
fragment DigitalSubmissionFieldLinkFragment on DigitalSubmissionFieldGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  path
  value
  fieldId
  submissionId
  sectionId
  stateId
}
`);

export const DigitalSubmissionFieldMediumFragment = createQueryStrLazy(`
fragment DigitalSubmissionFieldMediumFragment on DigitalSubmissionFieldGQLModel {
  ...DigitalSubmissionFieldLinkFragment
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
  field {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    label
    labelEn
    description
    formSectionId
    formId
    required
    order
    computed
    formula
    typeId
    backendFormula
    flattenFormula
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
    userCan
  }
}
`, DigitalSubmissionFieldLinkFragment);

export const DigitalSubmissionFieldLargeFragment = createQueryStrLazy(`
fragment DigitalSubmissionFieldLargeFragment on DigitalSubmissionFieldGQLModel {
  ...DigitalSubmissionFieldMediumFragment
}
`, DigitalSubmissionFieldMediumFragment);
