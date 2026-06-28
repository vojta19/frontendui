// Importujeme createSlice z Redux Toolkitu.
// createSlice nám umožní jednoduše vytvořit Redux slice,
// tedy část globálního Redux store.
import { createSlice } from "@reduxjs/toolkit";

// Počáteční stav slice.
// Na začátku nemáme žádné finanční transfery,
// proto je items prázdné pole.
const initialState = {
  items: [],
};

// Vytvoření slice pro finanční transfery.
// Slice obsahuje:
// - název části store,
// - počáteční stav,
// - reducery, které umí měnit stav.
const FinanceTransferSlice = createSlice({
  // Název slice.
  // Pod tímto názvem se bude část stavu ukládat ve Redux store.
  name: "financeTransfers",

  // Výchozí stav při inicializaci aplikace.
  initialState,

  // Reducery určují, jakými způsoby se může stav měnit.
  reducers: {
    // Reducer pro nastavení seznamu finančních transferů.
    // Používá se například po načtení transferů z backendu.
    financeTransfers_set: (state, action) => {
      // action.payload je hodnota, kterou do reduceru pošleme.
      // Očekáváme, že to bude pole transferů.
      //
      // Kontrola Array.isArray chrání aplikaci před tím,
      // že by přišla špatná data, například null, objekt nebo string.
      //
      // Pokud payload je pole, uloží se do state.items.
      // Pokud payload pole není, uloží se raději prázdné pole.
      state.items = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

    // Reducer pro vyčištění seznamu finančních transferů.
    // Použije se například při odhlášení, resetu stránky
    // nebo když chceme zahodit stará data.
    financeTransfers_clear: (state) => {
      state.items = [];
    },
  },
});

// Export všech akcí vytvořených tímto slicem.
// Redux Toolkit automaticky vytvoří akce podle názvů reducerů,
// tedy financeTransfers_set a financeTransfers_clear.
export const FinanceTransferActions = FinanceTransferSlice.actions;

// Export reduceru.
// Tento reducer se potom musí připojit do hlavního Redux store,
// aby Redux věděl, jak spravovat financeTransfers část stavu.
export const FinanceTransferReducer = FinanceTransferSlice.reducer;

// Selector pro pohodlné získání transferů ze store.
// Používá se například v komponentě přes useSelector(selectFinanceTransfers).
export const selectFinanceTransfers = (state) => {
  // state.financeTransfers?.items znamená:
  // zkus najít financeTransfers ve store
  // a z něj vytáhni items.
  //
  // Pokud financeTransfers nebo items neexistuje,
  // vrátí se prázdné pole.
  //
  // Díky tomu komponenta nespadne na chybě typu:
  // Cannot read properties of undefined.
  return state.financeTransfers?.items ?? [];
};