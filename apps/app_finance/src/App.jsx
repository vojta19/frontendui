import 'bootstrap/dist/css/bootstrap.min.css';

import { AppRouter } from './AppRouter';
import { FinanceRootProviders } from "../../../packages/finance/src/FinanceGQLModel/Store";

export const GQLENDPOINT_ = "/api/gql";

export const App = ({ GQLENDPOINT = GQLENDPOINT_ }) => {
  return (
    <FinanceRootProviders clientOptions={{ endpoint: GQLENDPOINT || GQLENDPOINT_ }}>
      <AppRouter />
    </FinanceRootProviders>
  );
};