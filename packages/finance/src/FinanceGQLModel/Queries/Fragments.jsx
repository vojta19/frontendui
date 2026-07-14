// Importuje helper pro vytvoření lazily vyhodnocovaného GraphQL fragmentu.
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";


/**
 * GraphQL fragment containing the basic finance entity information.
 *
 * The fragment represents the minimum dataset required for displaying
 * finance entities throughout the application. Besides the basic scalar
 * properties, it also loads references to related entities such as the
 * parent finance, associated project, finance type and direct subfinances.
 *
 * This fragment serves as the foundation for all higher-level finance
 * fragments.
 *
 * @constant
 * @type {string}
 */
// Definuje text základního fragmentu pro finance entity.
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
  masterfinance 
  {
    __typename
    id
    name
    projectId
    project {
      __typename
      id
      name
      subprojects 
      {
        __typename
        id
        name
        nameEn
      }
    }
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
 * GraphQL fragment extending the basic finance entity with RBAC data.
 *
 * In addition to the fields provided by the `Link` fragment, this fragment
 * also loads RBAC information describing the roles assigned to the current
 * user. It is primarily used by pages where available actions depend on
 * user permissions.
 *
 * @constant
 * @type {string}
 */
// Definuje text fragmentu pro finance data s RBAC informacemi.
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
 * The fragment extends the `Medium` fragment by recursively loading direct
 * child finance entities. It provides all information required for detail
 * pages, finance hierarchy visualization and Sunburst diagrams.
 *
 * @constant
 * @type {string}
 */
// Definuje text komplexního fragmentu pro kompletní finance data.
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
 * The fragment contains metadata about a role together with references to
 * the associated user, role type and assigned group.
 *
 * It is primarily used by RBAC-related queries.
 *
 * @constant
 * @type {string}
 */
// Definuje text fragmentu pro popis role.
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
 * GraphQL fragment describing RBAC information.
 *
 * The fragment loads the roles assigned to the currently authenticated user,
 * including role types and group hierarchy. It is used for permission
 * evaluation throughout the finance module.
 *
 * @constant
 * @type {string}
 */
// Definuje text fragmentu pro RBAC informace.
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
 * Lazily generated GraphQL fragment describing user roles.
 *
 * The fragment is converted into an executable GraphQL fragment that can be
 * reused by other queries and mutations.
 *
 * @constant
 */
// Vytvoří exportovatelný fragment pro role.
export const RoleFragment =
    createQueryStrLazy(RoleFragmentStr);


/**
 * Lazily generated GraphQL fragment describing RBAC information.
 *
 * The fragment provides role information required for permission checking.
 *
 * @constant
 */
// Vytvoří exportovatelný fragment pro RBAC data.
export const RBACFragment =
    createQueryStrLazy(RBACFragmentStr);


/**
 * Lazily generated GraphQL fragment containing the basic finance entity.
 *
 * This fragment is used as the base dependency for other finance fragments.
 *
 * @constant
 */
// Vytvoří exportovatelný fragment pro základní finance data.
export const LinkFragment =
    createQueryStrLazy(LinkFragmentStr);


/**
 * Lazily generated GraphQL fragment containing finance data together with
 * RBAC information.
 *
 * Dependencies:
 * - LinkFragment
 * - RBACFragment
 *
 * @constant
 */
// Vytvoří exportovatelný fragment pro finance data rozšířené o oprávnění.
export const MediumFragment =
    createQueryStrLazy(
        MediumFragmentStr,
        LinkFragment,
        RBACFragment
    );


/**
 * Lazily generated GraphQL fragment representing the complete finance entity.
 *
 * Besides the data contained in `MediumFragment`, this fragment also loads
 * direct subfinances recursively, making it suitable for detailed finance
 * views and hierarchical visualizations.
 *
 * Dependencies:
 * - MediumFragment
 *
 * @constant
 */
// Vytvoří exportovatelný fragment pro kompletní finance data.
export const LargeFragment =
    createQueryStrLazy(
        LargeFragmentStr,
        MediumFragment
    );