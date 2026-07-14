// Importuje pomocnou funkci pro skládání GraphQL fragmentů se závislostmi.
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";


/**
 * GraphQL fragment containing the basic finance entity information.
 *
 * The fragment represents the minimum dataset required for displaying
 * finance entities in lists, tables and links. Besides scalar properties,
 * it also contains references to the parent finance, finance type,
 * associated project and direct subfinances.
 *
 * @constant
 * @type {string}
 */
// Definice základního GraphQL fragmentu používaného ve většině dotazů nad financemi.
const LinkFragmentStr = `
fragment Link on FinanceGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { id __typename fullname }
  changedby { id __typename fullname }
  rbacobject { id __typename }
  name
  nameEn
  value
  description
  financeTypeId
  masterfinanceId
  masterfinance {
    __typename
    id
    name
  }
  subfinances {
    __typename
    id
    name
    nameEn
    value
    description
    financeTypeId
    projectId
    project {
      __typename
      id
      name
    }
  }
  type { id name }
  projectId
  project {
    __typename
    id
    name
  }
}
`;


/**
 * GraphQL fragment extending the basic finance information with RBAC data.
 *
 * The fragment is primarily used by editable views where the current user's
 * permissions determine which actions are available.
 *
 * @constant
 * @type {string}
 */
// Rozšířený fragment doplňující základní data o RBAC oprávnění.
const MediumFragmentStr = `
fragment Medium on FinanceGQLModel {
  ...Link
  rbacobject {
    ...RBRoles
  }
}
`;


/**
 * GraphQL fragment containing the complete finance entity.
 *
 * Besides the medium-level data, this fragment recursively loads direct
 * subfinances using the `Medium` fragment. It is typically used by the
 * finance detail page and the Sunburst visualization.
 *
 * @constant
 * @type {string}
 */
// Největší fragment načítající finance včetně jejich podřízených financí.
const LargeFragmentStr = `
fragment Large on FinanceGQLModel {
  ...Medium
  subfinances {
    ...Medium
  }
}
`;


/**
 * GraphQL fragment describing a user role.
 *
 * The fragment contains role metadata together with references to the
 * associated user, role type and group.
 *
 * @constant
 * @type {string}
 */
// Fragment reprezentující jednu uživatelskou roli.
const RoleFragmentStr = `
fragment Role on RoleGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { id __typename }
  changedby { id __typename }
  rbacobject { id __typename }
  valid
  deputy
  startdate
  enddate
  roletypeId
  userId
  groupId
  roletype { __typename id }
  user { __typename id fullname }
  group { __typename id name }
}
`;


/**
 * GraphQL fragment describing RBAC information of a finance entity.
 *
 * The fragment provides information about the current user's roles,
 * including the assigned role type and group hierarchy.
 *
 * @constant
 * @type {string}
 */
// Fragment načítající oprávnění aktuálního uživatele k danému objektu.
const RBACFragmentStr = `
fragment RBRoles on RBACObjectGQLModel {
  __typename
  id
  currentUserRoles {
    __typename
    id
    lastchange
    valid
    startdate
    enddate
    roletype {
      __typename
      id
      name
    }
    group {
      __typename
      id
      name
      grouptype {
        __typename
        id
        name
      }
    }
  }
}
`;


/**
 * Lazy GraphQL fragment describing a user role.
 *
 * @constant
 */
// Vytvoření lazy fragmentu pro RoleFragment.
export const RoleFragment =
    createQueryStrLazy(RoleFragmentStr);


/**
 * Lazy GraphQL fragment describing RBAC permissions.
 *
 * @constant
 */
// Vytvoření lazy fragmentu pro RBAC informace.
export const RBACFragment =
    createQueryStrLazy(RBACFragmentStr);


/**
 * Lazy GraphQL fragment containing the basic finance entity.
 *
 * @constant
 */
// Vytvoření lazy fragmentu obsahujícího základní informace o financích.
export const LinkFragment =
    createQueryStrLazy(LinkFragmentStr);


/**
 * Lazy GraphQL fragment containing finance data together with RBAC
 * permissions.
 *
 * Depends on:
 * - LinkFragment
 * - RBACFragment
 *
 * @constant
 */
// Sestavení středního fragmentu včetně všech jeho závislostí.
export const MediumFragment =
    createQueryStrLazy(
        MediumFragmentStr,
        LinkFragment,
        RBACFragment
    );


/**
 * Lazy GraphQL fragment representing the complete finance entity,
 * including direct subfinances.
 *
 * Depends on:
 * - MediumFragment
 *
 * @constant
 */
// Nejvyšší fragment používaný pro detail finance a Sunburst diagram.
export const LargeFragment =
    createQueryStrLazy(
        LargeFragmentStr,
        MediumFragment
    );