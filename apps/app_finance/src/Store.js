// Importuje configureStore z Redux Toolkitu.
// configureStore slouží k vytvoření hlavního Redux store aplikace.
import { configureStore } from "@reduxjs/toolkit";

// Importuje reducer pro obecné položky / entity.
// Tento reducer spravuje část globálního stavu pod klíčem "items".
import { ItemReducer } from "../../../packages/dynamic/src/Store/ItemSlice";

// Importuje reducer pro finanční transfery.
// Tento reducer spravuje seznam transferů v Redux store.
import { FinanceTransferReducer } from "../../../packages/finance/src/FinanceGQLModel/Store/FinanceTransferSlice";

// Vytvoření hlavního Redux store aplikace.
// Store je jedno centrální místo, kde se drží globální stav aplikace.
export const store = configureStore({
  // Objekt reducer určuje, jaké části stavu aplikace Redux spravuje.
  reducer: {
    // Část state.items bude spravovaná pomocí ItemReducer.
    // Sem se ukládají obecná data načítaná přes dynamickou část aplikace.
    items: ItemReducer,

    // Část state.financeTransfers bude spravovaná pomocí FinanceTransferReducer.
    // Sem se ukládají finanční transfery načtené z backendu.
    //
    // Díky tomuto názvu musí selector vypadat například takto:
    // state.financeTransfers?.items
    financeTransfers: FinanceTransferReducer,
  },
});