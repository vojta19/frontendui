import { DigitalSubmissionSectionURI } from "../Components/DigitalSubmissionSectionLink"
import { DigitalSubmissionSectionEditPage } from "./DigitalSubmissionSectionEditPage"
import { DigitalSubmissionSectionPage } from "./DigitalSubmissionSectionPage"
import { DigitalSubmissionSectionVectorPage } from "./DigitalSubmissionSectionVectorPage"

/**
 * Definice segmentů rout pro DigitalSubmissionSection stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci digitalsubmissionsection entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `digitalsubmissionsection` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/digitalsubmissionsection/123"
 * {
 *   path: "/digitalsubmissionsection/:id",
 *   element: <DigitalSubmissionSectionPage />
 * }
 *
 * // Editační route: "/digitalsubmissionsection/edit/123"
 * {
 *   path: "/digitalsubmissionsection/edit/:id",
 *   element: <DigitalSubmissionSectionEditPage />
 * }
 */
export const DigitalSubmissionSectionRouterSegments = [
    {
        path: `/${DigitalSubmissionSectionURI}:id`,
        element: (<DigitalSubmissionSectionPage />),
    },
    {
        path: `/${DigitalSubmissionSectionURI}`,
        element: (<DigitalSubmissionSectionVectorPage />),
    },
    {
        path: `/${DigitalSubmissionSectionURI.replace('view', 'edit')}:id`,
        element: (<DigitalSubmissionSectionEditPage />),
    }
]