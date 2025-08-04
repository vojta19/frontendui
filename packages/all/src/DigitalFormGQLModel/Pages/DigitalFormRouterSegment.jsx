import { DigitalFormURI } from "../Components/DigitalFormLink"
import { DigitalFormEditPage } from "./DigitalFormEditPage"
import { DigitalFormPage } from "./DigitalFormPage"
import { DigitalFormVectorPage } from "./DigitalFormVectorPage"

/**
 * Definice segmentů rout pro DigitalForm stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci digitalform entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `digitalform` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/digitalform/123"
 * {
 *   path: "/digitalform/:id",
 *   element: <DigitalFormPage />
 * }
 *
 * // Editační route: "/digitalform/edit/123"
 * {
 *   path: "/digitalform/edit/:id",
 *   element: <DigitalFormEditPage />
 * }
 */
export const DigitalFormRouterSegments = [
    {
        path: `/${DigitalFormURI}:id`,
        element: (<DigitalFormPage />),
    },
    {
        path: `/${DigitalFormURI}`,
        element: (<DigitalFormVectorPage />),
    },
    {
        path: `/${DigitalFormURI.replace('view', 'edit')}:id`,
        element: (<DigitalFormEditPage />),
    }
]