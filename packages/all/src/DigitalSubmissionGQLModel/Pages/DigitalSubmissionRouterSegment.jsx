import { DigitalSubmissionURI } from "../Components/DigitalSubmissionLink"
import { DigitalSubmissionEditPage } from "./DigitalSubmissionEditPage"
import { DigitalSubmissionPage } from "./DigitalSubmissionPage"
import { DigitalSubmissionVectorPage } from "./DigitalSubmissionVectorPage"

/**
 * Definice segmentů rout pro DigitalSubmission stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci digitalsubmission entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `digitalsubmission` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/digitalsubmission/123"
 * {
 *   path: "/digitalsubmission/:id",
 *   element: <DigitalSubmissionPage />
 * }
 *
 * // Editační route: "/digitalsubmission/edit/123"
 * {
 *   path: "/digitalsubmission/edit/:id",
 *   element: <DigitalSubmissionEditPage />
 * }
 */
export const DigitalSubmissionRouterSegments = [
    {
        path: `/${DigitalSubmissionURI}:id`,
        element: (<DigitalSubmissionPage />),
    },
    {
        path: `/${DigitalSubmissionURI}`,
        element: (<DigitalSubmissionVectorPage />),
    },
    {
        path: `/${DigitalSubmissionURI.replace('view', 'edit')}:id`,
        element: (<DigitalSubmissionEditPage />),
    }
]