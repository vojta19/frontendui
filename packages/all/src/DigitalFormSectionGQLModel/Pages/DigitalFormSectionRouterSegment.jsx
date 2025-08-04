import { DigitalFormSectionURI } from "../Components/DigitalFormSectionLink"
import { DigitalFormSectionEditPage } from "./DigitalFormSectionEditPage"
import { DigitalFormSectionPage } from "./DigitalFormSectionPage"
import { DigitalFormSectionVectorPage } from "./DigitalFormSectionVectorPage"

/**
 * Definice segmentů rout pro DigitalFormSection stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 *  - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci digitalformsection entity.
 *  - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 *   - `digitalformsection` — načtená entita podle `:id`
 *   - `onChange` — callback pro změnu hodnoty pole
 *   - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/digitalformsection/123"
 * {
 *   path: "/digitalformsection/:id",
 *   element: <DigitalFormSectionPage />
 * }
 *
 * // Editační route: "/digitalformsection/edit/123"
 * {
 *   path: "/digitalformsection/edit/:id",
 *   element: <DigitalFormSectionEditPage />
 * }
 */
export const DigitalFormSectionRouterSegments = [
    {
        path: `/${DigitalFormSectionURI}:id`,
        element: (<DigitalFormSectionPage />),
    },
    {
        path: `/${DigitalFormSectionURI}`,
        element: (<DigitalFormSectionVectorPage />),
    },
    {
        path: `/${DigitalFormSectionURI.replace('view', 'edit')}:id`,
        element: (<DigitalFormSectionEditPage />),
    }
]