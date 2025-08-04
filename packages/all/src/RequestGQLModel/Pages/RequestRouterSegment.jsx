import { RequestURI } from "../Components/RequestLink"
import { RequestEditPage } from "./RequestEditPage"
import { RequestPage } from "./RequestPage"
import { RequestVectorPage } from "./RequestVectorPage"

/**
 * Definice segmentů rout pro Request stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci request entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `request` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/request/123"
 * {
 *   path: "/request/:id",
 *   element: <RequestPage />
 * }
 *
 * // Editační route: "/request/edit/123"
 * {
 *   path: "/request/edit/:id",
 *   element: <RequestEditPage />
 * }
 */
export const RequestRouterSegments = [
    {
        path: `/${RequestURI}:id`,
        element: (<RequestPage />),
    },
    {
        path: `/${RequestURI}`,
        element: (<RequestVectorPage />),
    },
    {
        path: `/${RequestURI.replace('view', 'edit')}:id`,
        element: (<RequestEditPage />),
    }
]