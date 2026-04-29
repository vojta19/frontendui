import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation financeUpdate
( $id: UUID!, 
  $lastchange: DateTime!, 
  $name: String, 
  $nameEn: String 
)
{
  financeUpdate
  (finance: {id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn}) 
  {
    
    ... on FinanceGQLModel { ...Large }
    ... on FinanceGQLModelUpdateError { ...Error }
  }
}

fragment Error on FinanceGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
  input
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)