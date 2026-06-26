// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Importuje funkce pro transformaci storu (přepis prvků a redukci na první entitu) z dynamického úložiště Reduxu
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

// Definuje tělo samotné GraphQL mutace pro aktualizaci finančního záznamu včetně chybového fragmentu
const UpdateMutationStr = `
mutation financeUpdate
( $id: UUID!, 
  $lastchange: DateTime!, 
  $name: String, 
  $nameEn: String,
  $description: String
)
{
  financeUpdate
  (finance: { id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn, description: $description }) 
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
`; // Konec definice řetězce GraphQL mutace

// Sestavuje finální GraphQL dotaz spojením textu mutace a definice LargeFragmentu pomocí lazy generátoru
const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment);

// Vytváří a exportuje asynchronní akci (thunk) spojením mutace, aktualizačního procesoru a redukce výsledku na první entitu
export const UpdateAsyncAction = createAsyncGraphQLAction2(
    UpdateMutation, // Registrovaný GraphQL dotaz mutace
    updateItemsFromGraphQLResult, // Funkce zajišťující aktualizaci dotčených prvků v Redux storu
    reduceToFirstEntity // Redukční funkce omezující výsledek na primární zpracovávanou entitu
); // Konec definice asynchronní akce UpdateAsyncAction