import { DigitalSubmissionFieldURI } from "../Components/DigitalSubmissionFieldLink"
import { DigitalSubmissionFieldEditPage } from "./DigitalSubmissionFieldEditPage"
import { DigitalSubmissionFieldPage } from "./DigitalSubmissionFieldPage"
import { DigitalSubmissionFieldVectorPage } from "./DigitalSubmissionFieldVectorPage"

/**
 * Definice segmentů rout pro DigitalSubmissionField stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci digitalsubmissionfield entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `digitalsubmissionfield` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/digitalsubmissionfield/123"
 * {
 *   path: "/digitalsubmissionfield/:id",
 *   element: <DigitalSubmissionFieldPage />
 * }
 *
 * // Editační route: "/digitalsubmissionfield/edit/123"
 * {
 *   path: "/digitalsubmissionfield/edit/:id",
 *   element: <DigitalSubmissionFieldEditPage />
 * }
 */
export const DigitalSubmissionFieldRouterSegments = [
    {
        path: `/${DigitalSubmissionFieldURI}:id`,
        element: (<DigitalSubmissionFieldPage />),
    },
    {
        path: `/${DigitalSubmissionFieldURI}`,
        element: (<DigitalSubmissionFieldVectorPage />),
    },
    {
        path: `/${DigitalSubmissionFieldURI.replace('view', 'edit')}:id`,
        element: (<DigitalSubmissionFieldEditPage />),
    }
]