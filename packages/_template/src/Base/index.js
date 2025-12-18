import { Attribute } from "./Components/Attribute";
import { CardCapsule } from "./Components/CardCapsule";
import { LargeCard } from "./Components/LargeCard";
import { Link } from "./Components/Link";
import { MediumCard } from "./Components/MediumCard";
import { MediumContent } from "./Components/MediumContent";
// import { Page } from "./Pages/Page";
import { Page2 } from "./Pages/Page2";
import { MediumCardScalars } from "./Scalars/ScalarAttribute";
import { MediumCardVectors } from "./Vectors/VectorAttribute";

export const BaseUI = {
    Link,
    Attribute,
    CardCapsule,
    MediumCard,
    MediumContent,
    MediumEditableContent: MediumContent,
    MediumCardScalars,
    MediumCardVectors,
    LargeCard,
    Page: Page2
}
