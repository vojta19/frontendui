import { DigitalFormFieldURI } from "../Components/DigitalFormFieldLink"
import { DigitalFormFieldEditPage } from "./DigitalFormFieldEditPage"
import { DigitalFormFieldPage } from "./DigitalFormFieldPage"
import { DigitalFormFieldVectorPage } from "./DigitalFormFieldVectorPage"

/**
 * Definice segmentů rout pro DigitalFormField stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci digitalformfield entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `digitalformfield` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/digitalformfield/123"
 * {
 *   path: "/digitalformfield/:id",
 *   element: <DigitalFormFieldPage />
 * }
 *
 * // Editační route: "/digitalformfield/edit/123"
 * {
 *   path: "/digitalformfield/edit/:id",
 *   element: <DigitalFormFieldEditPage />
 * }
 */
export const DigitalFormFieldRouterSegments = [
    {
        path: `/${DigitalFormFieldURI}:id`,
        element: (<DigitalFormFieldPage />),
    },
    {
        path: `/${DigitalFormFieldURI}`,
        element: (<DigitalFormFieldVectorPage />),
    },
    {
        path: `/${DigitalFormFieldURI.replace('view', 'edit')}:id`,
        element: (<DigitalFormFieldEditPage />),
    }
]