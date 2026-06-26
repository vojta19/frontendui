// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro bezpečné skládání závislých fragmentů
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Definuje řetězec základního fragmentu "Link" pro model FinanceGQLModel obsahující primární skaláry a vazby na projekt a subfinance
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
`; // Konec definice fragmentu Link

// Definuje řetězec středního fragmentu "Medium", který rozšiřuje základní "Link" o RBAC kontrolu rolí uživatele
const MediumFragmentStr = `
fragment Medium on FinanceGQLModel {
  ...Link
  rbacobject {
    ...RBRoles
  }
}
`; // Konec definice fragmentu Medium

// Definuje řetězec velkého fragmentu "Large", který rekurzivně aplikuje fragment "Medium" i na všechny podřízené subfinance
const LargeFragmentStr = `
fragment Large on FinanceGQLModel {
  ...Medium
  subfinances {
    ...Medium
  }
}
`; // Konec definice fragmentu Large

// Definuje řetězec fragmentu "Role" popisující model jedné uživatelské role (RoleGQLModel) včetně typu, uživatele a skupiny
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
`; // Konec definice fragmentu Role

// Definuje řetězec fragmentu "RBRoles" (RBAC), který zjišťuje role aktuálně přihlášeného uživatele vůči danému objektu a jejich typy/skupiny
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
`; // Konec definice fragmentu RBRoles

// Sestavuje a exportuje samostatný lazy fragment pro model role
export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`);

// Sestavuje a exportuje samostatný lazy fragment pro strukturu RBAC oprávnění (RBRoles)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`);

// Sestavuje a exportuje základní finanční lazy fragment Link
export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`);

// Sestavuje a exportuje střední finanční lazy fragment Medium s provázáním na závislosti LinkFragment a RBACFragment
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment);

// Sestavuje a exportuje velký finanční lazy fragment Large s provázáním na závislý MediumFragment
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment);