import { configureStore } from "@reduxjs/toolkit";
import { ItemReducer } from "../../../../dynamic/src/Store/ItemSlice";
import { FinanceTransferReducer } from "./FinanceTransferSlice";

export const createFinanceStore = (preloadedState) =>
  configureStore({
    reducer: {
      items: ItemReducer,
      financeTransfers: FinanceTransferReducer,
    },
    preloadedState,
  });

export const financeStore = createFinanceStore();