// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Importuje funkce pro transformaci storu (přepis prvků a redukci na první entitu) z dynamického úložiště Reduxu
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

/**
 * GraphQL mutation used for updating a finance entity.
 *
 * The mutation updates the selected finance entity and returns either
 * the updated entity represented by the `Large` GraphQL fragment or
 * an update error containing the current entity state.
 *
 * @constant
 * @type {string}
 */
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

/**
 * Lazily generated GraphQL mutation used for updating finance entities.
 *
 * The mutation string is converted into an executable GraphQL request.
 * All fragment dependencies required by the `Large` fragment are
 * included automatically.
 *
 * @constant
 */
// Sestavuje finální GraphQL dotaz spojením textu mutace a definice LargeFragmentu pomocí lazy generátoru
const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment);

/**
 * Asynchronous GraphQL action responsible for updating a finance entity.
 *
 * The action executes the prepared GraphQL mutation, updates the
 * corresponding entities stored in the application state and returns
 * the updated finance entity.
 *
 * The GraphQL response is processed by:
 * - `updateItemsFromGraphQLResult` to synchronize the Redux store,
 * - `reduceToFirstEntity` to return the updated finance entity.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     UpdateAsyncAction({
 *         id: "30000000-0000-0000-0000-000000000001",
 *         lastchange: "2026-07-14T10:30:00Z",
 *         name: "Rozpočet WP2",
 *         nameEn: "WP2 Budget",
 *         description: "Updated description"
 *     })
 * );
 */
// Vytváří a exportuje asynchronní akci (thunk) spojením mutace, aktualizačního procesoru a redukce výsledku na první entitu
export const UpdateAsyncAction = createAsyncGraphQLAction2(
    UpdateMutation, // Registrovaný GraphQL dotaz mutace
    updateItemsFromGraphQLResult, // Funkce zajišťující aktualizaci dotčených prvků v Redux storu
    reduceToFirstEntity // Redukční funkce omezující výsledek na primární zpracovávanou entitu
); // Konec definice asynchronní akce UpdateAsyncAction