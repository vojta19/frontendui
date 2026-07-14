import { RootProviders } from "../../../../dynamic/src/Store";
import { financeStore } from "./Store";

const DEFAULT_GQL_ENDPOINT = "/api/gql";

export const FinanceRootProviders = ({ children, clientOptions = {} }) => {
  const finalClientOptions = {
    ...clientOptions,
    endpoint: clientOptions?.endpoint || DEFAULT_GQL_ENDPOINT,
  };

  return (
    <RootProviders store={financeStore} clientOptions={finalClientOptions}>
      {children}
    </RootProviders>
  );
};