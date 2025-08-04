import { RequestTypeURI } from "../Components/RequestTypeLink"
import { RequestTypeEditPage } from "./RequestTypeEditPage"
import { RequestTypePage } from "./RequestTypePage"
import { RequestTypeVectorPage } from "./RequestTypeVectorPage"

/**
 * Definice segmentů rout pro RequestType stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci requesttype entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `requesttype` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/requesttype/123"
 * {
 *   path: "/requesttype/:id",
 *   element: <RequestTypePage />
 * }
 *
 * // Editační route: "/requesttype/edit/123"
 * {
 *   path: "/requesttype/edit/:id",
 *   element: <RequestTypeEditPage />
 * }
 */
export const RequestTypeRouterSegments = [
    {
        path: `/${RequestTypeURI}:id`,
        element: (<RequestTypePage />),
    },
    {
        path: `/${RequestTypeURI}`,
        element: (<RequestTypeVectorPage />),
    },
    {
        path: `/${RequestTypeURI.replace('view', 'edit')}:id`,
        element: (<RequestTypeEditPage />),
    }
]