import {
      createBrowserRouter,
      RouterProvider
} from "react-router-dom";

// import { BaseUI } from "../../../packages/_template/src/Base";
import { BaseRouterSegments } from "../../../packages/_template/src/Base/Pages/RouterSegment";
// import { TemplateRouterSegments } from "../../../packages/_template/src/_Template/Pages/RouterSegment";
import { UserRouterSegments } from "../../../packages/_template/src/UserGQLModel/Pages/RouterSegment";
import { GroupRouterSegments } from "../../../packages/_template/src/GroupGQLModel2/Pages/RouterSegment";
import { RoleRouterSegments } from "../../../packages/_template/src/RoleGQLModel2/Pages/RouterSegment";
import { GroupTypeRouterSegments } from "../../../packages/_template/src/GroupType/Pages/RouterSegment";
import { RoleTypeRouterSegments } from "../../../packages/_template/src/RoleType/Pages";
// import { TemplateRouterSegments } from "../../../packages/_template/src/Template";

const Routes = [
    // UserRouterSegment
    ...BaseRouterSegments,
    // {
    //     path: "/typename/:typename/view/:id",
    //     element: <BaseUI.Page />
    // },
    // ...TemplateRouterSegments,
    ...UserRouterSegments,
    ...GroupRouterSegments,
    ...GroupTypeRouterSegments,
    ...RoleRouterSegments,
    ...RoleTypeRouterSegments

]
const router = createBrowserRouter(Routes);

export const AppRouter = () => <RouterProvider router={router} />