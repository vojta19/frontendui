// Import formulářové komponenty Input ze sdílené šablony.
// Používá se pro vytváření vstupních polí formuláře.
import { Input } from "../../../../_template/src/Base/FormControls/Input";

/**
 * Renders an editable form for a finance entity.
 *
 * The component provides form controls for editing the most commonly
 * modified properties of a finance record. It is primarily used inside
 * create and update dialogs.
 *
 * The edited values are propagated through the supplied event handlers.
 * Additional controls (such as Save or Cancel buttons) can be injected
 * through the `children` property.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity currently being edited.
 *
 * @param {string} [props.item.name]
 * Czech name of the finance entity.
 *
 * @param {string} [props.item.nameEn]
 * English name of the finance entity.
 *
 * @param {string} [props.item.description]
 * Description of the finance entity.
 *
 * @param {Function} [props.onChange]
 * Callback invoked whenever the value of an input field changes.
 *
 * @param {Function} [props.onBlur]
 * Callback invoked when an input field loses focus.
 *
 * @param {React.ReactNode} [props.children]
 * Optional additional controls rendered below the editable fields.
 *
 * @returns {JSX.Element}
 * Editable finance form.
 *
 * @example
 * <MediumEditableContent
 *     item={finance}
 *     onChange={handleChange}
 *     onBlur={handleBlur}
 * >
 *     <button className="btn btn-primary">
 *         Save
 *     </button>
 * </MediumEditableContent>
 */
export const MediumEditableContent = ({
    // Aktuálně editovaná finanční položka.
    item,

    // Funkce volaná při každé změně hodnoty formulářového pole.
    // Pokud není předána, použije se prázdná funkce.
    onChange = () => null,

    // Funkce volaná při opuštění formulářového pole.
    // Ve většině případů zde dochází k uložení změn.
    onBlur = () => null,

    // Volitelný obsah (například tlačítka Uložit nebo Zrušit).
    children
}) => {
    return (
        <>
            {/* Pole pro editaci českého názvu finanční položky. */}
            <Input
                // Identifikátor atributu, který se bude měnit.
                id="name"

                // Text zobrazený u vstupního pole.
                label="Jméno"

                // Bootstrap třída určující vzhled formulářového prvku.
                className="form-control"

                // Aktuální hodnota názvu.
                // Pokud není vyplněna, použije se prázdný řetězec.
                value={item?.name ?? ""}

                // Text zobrazený při prázdném poli.
                placeholder="Název"

                // Handler reagující na změnu hodnoty.
                onChange={onChange}

                // Handler reagující na opuštění pole.
                onBlur={onBlur}
            />

            {/* Pole pro editaci anglického názvu finanční položky. */}
            <Input
                // Identifikátor atributu v objektu finance.
                id="nameEn"

                // Popisek vstupního pole.
                label="EN název"

                // Bootstrap styl formulářového prvku.
                className="form-control"

                // Aktuální anglický název.
                value={item?.nameEn ?? ""}

                // Zástupný text při prázdné hodnotě.
                placeholder="English name"

                // Reakce na změnu hodnoty.
                onChange={onChange}

                // Reakce na opuštění pole.
                onBlur={onBlur}
            />

            {/* Pole pro editaci textového popisu finanční položky. */}
            <Input
                // Název atributu odpovídající objektu finance.
                id="description"

                // Text popisku formulářového pole.
                label="Popis"

                // Bootstrap vzhled vstupního pole.
                className="form-control"

                // Aktuální popis finance.
                value={item?.description ?? ""}

                // Zástupný text při prázdném popisu.
                placeholder="Popis"

                // Handler změny hodnoty.
                onChange={onChange}

                // Handler opuštění pole.
                onBlur={onBlur}
            />

            {/* Vykreslení případných dalších prvků formuláře,
                například tlačítek nebo doplňkových vstupů. */}
            {children}
        </>
    );
};