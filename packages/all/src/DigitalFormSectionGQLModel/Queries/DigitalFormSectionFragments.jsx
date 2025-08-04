import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const DigitalFormSectionLinkFragment = createQueryStrLazy(`
fragment DigitalFormSectionLinkFragment on DigitalFormSectionGQLModel {
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
  formId
  sectionId
  order
  repatableMin
  repatableMax
  repeatable
}
`);

export const DigitalFormSectionMediumFragment = createQueryStrLazy(`
fragment DigitalFormSectionMediumFragment on DigitalFormSectionGQLModel {
  ...DigitalFormSectionLinkFragment
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
}
`, DigitalFormSectionLinkFragment);

export const DigitalFormSectionLargeFragment = createQueryStrLazy(`
fragment DigitalFormSectionLargeFragment on DigitalFormSectionGQLModel {
  ...DigitalFormSectionMediumFragment
}
`, DigitalFormSectionMediumFragment);
