import React, { useMemo, useRef, useState, useCallback } from "react";

import { UpdateBody } from "../Mutations/Update"
import { PageItemBase } from "./PageBase"
import { SimpleCardCapsule, SimpleCardCapsuleRightCorner } from "../../../../_template/src/Base/Components";
import { Input } from "../../../../_template/src/Base/FormControls/Input";
import { Row } from "../../../../_template/src/Base/Components/Row";
import { Col } from "../../../../_template/src/Base/Components/Col";
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog";
import { DesignButton } from "../../DigitalFormFieldGQLModel/Mutations/Design";


// const index = {
//   1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
//   2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
//   3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
//   4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
//   5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
//   6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
// };

// const UpdateFormSection = ({ item, data, level=2, index=0 }) => {
//     const {sections=[]} = item || {}
//     const {sections:s_sections=[{}]} = data || {}

//     const {fields=[]} = item || {}
//     const {field:s_fields=[{}]} = data || {}
//     const Heading = index[level] || index[6]
//     return (
//         <div className={"H"+level}>
//             {(index === 0) && <div>
//                 Form Section
//                 <Heading>{item?.label}/{item?.labelEn}({item?.name})</Heading>
//                 {item?.repeatableMin}-{item?.repeatableMax}, {item?.order}<br/>
//                 {item?.description}<br/>
//             </div>}
//             <div>
//                 Submission Sections
//                 {sections.map((s,i)=>(
//                     <UpdateFormSection key={s?.id} item={s} data={s_sections} index={i} level={level+1}/>
//                 ))}
//             </div>
//             <div>
//                 Submission Fields
//                 {fields.map(f => (
//                     <UpdateFieldWrap item={f} data={s_fields} />
//                 ))}
//             </div>
//         </div>
//     )
// }

// const UpdateField = ({ item, data={} }) => {
//     return (
//         <div>
//             {item?.label} / {item?.labelEn} ({item?.name}) [{item?.typeId}]<br/>
//             {data?.value}  <br/>
//         </div>
//     )
// }

// const UpdateFieldWrap = ({ item, data=[] }) => {
//     const filtered = data?.find(f => f?.sectionId === item?.id) || {}
//     return <UpdateField item={item} data={filtered} />
// }

// const UpdateSectionWrap = ({ item, data, index=0, level=2 }) => {
//     const filtered = data?.filter(s=>s?.formSection?.id === item?.id) || []
//     return (
//         <UpdateFormSection item={item} data={filtered} index={index} level={level} />
//     )
// }

// export const UpdateForm = ({ item, submission }) => {
//     const {sections=[]} = item || {}
//     const {sections: s_sections=[]} = submission || {}
//     return (<>
//         <h1>{item?.label}({item?.name})</h1>
//         {sections.map(s=><UpdateSectionWrap key={s?.id} item={s} data={s_sections} />)}
//     </>)
// }


/** =============================================================================
 *  Support utilities
 * ============================================================================= */

const DeleteButton = ({ className, onClick = () => null, children, ...props }) => {
    const [state, setState] = useState(0)
    const handleCancel = () => setState(prev => 0)
    const handleProgress = () => setState(prev => 1)
    const handleConfirm = () => {
        setState(prev => 0)
        onClick()
    }
    return (<>
        {(state === 0) && (
            <button
                {...props}
                className={className ? className + " btn-outline-primary" : "btn btn-sm btn-outline-primary"}
                onClick={handleProgress}
            >
                {children}
            </button>
        )}
        {(state === 1) && (
            <button
                {...props}
                className={className ? className + " btn-warning" : "btn btn-sm btn-warning"}
                onClick={handleCancel}
            >
                {children}
            </button>
        )}
        {(state === 1) && (
            <button
                {...props}
                className={className ? className + " btn-danger" : "btn btn-sm btn-danger"}
                onClick={handleConfirm}
            >
                {children}
            </button>
        )}
    </>)
}

const TextDialog = ({ onOk = (value) => null, onCancel = () => null, value = "", ...props }) => {
    const [lastValue, SetLastValue] = useState(value)
    const handleCancel = () => {
        onCancel()
    }
    const handleOk = () => {
        onOk(lastValue)
    }
    const onChange = (e) => {
        const newValue = e?.target?.value
        console.log(newValue)
        SetLastValue(prev => newValue)
    }
    return (
        <Dialog {...props} onCancel={handleCancel} onOk={handleOk}>
            <Input className="form-control" value={lastValue} onChange={onChange} />
        </Dialog>
    )
}

const WrapWithDialog = ({
    children,
    id, name, value,
    onChange = (id, name, value) => null
}) => {
    const [state, setState] = useState(0)
    const handleClick = () => {
        setState(prev => 1)
    }
    const handleOk = (value) => {
        onChange(id, name, value)
        setState(prev => 0)
    }
    const handleCancel = () => {
        setState(prev => 0)
    }
    return (<>
        {(state === 1) && (
            <TextDialog value={value} onOk={handleOk} onCancel={handleCancel} />
        )}
        <span onClick={handleClick}>
            {children}
        </span>
    </>)
}

/** ---------- Headings ---------- */
const headingIndex = {
    1: (p) => <h1 {...p} />,
    2: (p) => <h2 {...p} />,
    3: (p) => <h3 {...p} />,
    4: (p) => <h4 {...p} />,
    5: (p) => <h5 {...p} />,
    6: (p) => <h6 {...p} />,
};
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** ---------- IDs ---------- */
const makeClientId = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random()
        .toString(36)
        .slice(2)}`;
};

/** ---------- Safe clone ----------
 *  Uses structuredClone if available; falls back to JSON clone.
 *  For your GQL models (plain objects) this is ok.
 */
const deepClone = (obj) => {
    if (typeof structuredClone === "function") return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
};

/** ---------- Debounce (for persistence) ---------- */
const useDebouncedCallback = (fn, delay = 600) => {
    const t = useRef(null);
    return useCallback(
        (...args) => {
            if (t.current) clearTimeout(t.current);
            t.current = setTimeout(() => fn(...args), delay);
        },
        [fn, delay]
    );
};

/** ---------- Model helpers ---------- */
const getFormSectionIdFromSubmissionSection = (ss) =>
    ss?.formSectionId ?? ss?.formSection?.id ?? null;

const getFieldIdFromSubmissionField = (sf) => sf?.fieldId ?? sf?.field?.id ?? null;

const getSectionIdFromSubmissionField = (sf) => sf?.sectionId ?? sf?.section?.id ?? null;

/** =============================================================================
 *  Selectors / builders
 * ============================================================================= */

/** Find submission section instances for a given form section definition.
 *  If none exist and dummy=true, create 1 (or repeatableMin for repeatable).
 */
const selectSubmissionSections = (submission, formSectionDef, dummy = false) => {
    const all = submission?.sections ?? [];
    const formSectionId = formSectionDef?.id ?? null;

    const found = all.filter((ss) => getFormSectionIdFromSubmissionSection(ss) === formSectionId);

    if (found.length > 0) return found;
    if (!dummy) return [];

    const min = formSectionDef?.repeatableMin ?? 0;
    const max = formSectionDef?.repeatableMax ?? 1;
    const repeatable = formSectionDef?.repeatable ?? (max > 1);

    const count = repeatable ? Math.max(1, min) : 1;

    return Array.from({ length: count }, () => ({
        __typename: "DigitalSubmissionSectionGQLModel",
        id: makeClientId(),
        formSectionId,
        fields: [],
        _dummy: true,
    }));
};

/** Prefer nested sectionInstance.fields, fallback to submission.fields */
const selectSubmissionField = (submission, sectionInstance, fieldDef) => {
    const all = sectionInstance?.fields ?? submission?.fields ?? [];
    const fieldId = fieldDef?.id ?? null;
    const sectionId = sectionInstance?.id ?? null;

    return all.find(
        (sf) => getFieldIdFromSubmissionField(sf) === fieldId && getSectionIdFromSubmissionField(sf) === sectionId
    );
};

/** Ensure the section instance exists in submission.sections and has an id. */
const ensureSectionInstanceInSubmission = (submission, sectionInstance, formSectionDef) => {
    const ensured = sectionInstance?.id
        ? sectionInstance
        : { ...sectionInstance, id: makeClientId() };

    const formSectionId = getFormSectionIdFromSubmissionSection(ensured) ?? formSectionDef?.id;

    const normalized = {
        __typename: "DigitalSubmissionSectionGQLModel",
        ...(ensured ?? {}),
        id: ensured?.id ?? makeClientId(),
        formSectionId,
        fields: ensured?.fields ?? [],
        _dummy: false,
    };

    const sections = submission?.sections ?? [];
    const idx = sections.findIndex((s) => s?.id === normalized.id);
    const nextSections = idx >= 0 ? sections.map((s, i) => (i === idx ? normalized : s)) : [...sections, normalized];

    return { nextSubmission: { ...submission, sections: nextSections }, ensuredSection: normalized };
};

/** Upsert a field value into BOTH:
 *  - submission.fields (global normalized)
 *  - submission.sections[].fields (nested, per your requirement)
 */
const upsertSubmissionFieldValue = (submission, sectionInstance, fieldDef, nextValue) => {
    const sectionId = sectionInstance?.id;
    const fieldId = fieldDef?.id;
    if (!sectionId || !fieldId) return submission;

    const globalFields = submission?.fields ?? [];
    const gIdx = globalFields.findIndex(
        (sf) => getSectionIdFromSubmissionField(sf) === sectionId && getFieldIdFromSubmissionField(sf) === fieldId
    );

    const nextField = {
        __typename: "DigitalSubmissionFieldGQLModel",
        ...(gIdx >= 0 ? globalFields[gIdx] : {}),
        id: gIdx >= 0 ? globalFields[gIdx]?.id : makeClientId(),
        sectionId,
        fieldId,
        value: nextValue,
        _dummy: false,
    };

    const nextGlobalFields =
        gIdx >= 0 ? globalFields.map((f, i) => (i === gIdx ? nextField : f)) : [...globalFields, nextField];

    // nested fields for the section
    const nextSections = (submission?.sections ?? []).map((s) => {
        if (s?.id !== sectionId) return s;
        const secFields = s?.fields ?? [];
        const sIdx = secFields.findIndex((sf) => getFieldIdFromSubmissionField(sf) === fieldId);
        const nextSecFields =
            sIdx >= 0 ? secFields.map((f, i) => (i === sIdx ? nextField : f)) : [...secFields, nextField];
        return { ...s, fields: nextSecFields };
    });

    return { ...submission, fields: nextGlobalFields, sections: nextSections };
};

/** =============================================================================
 *  Form definition tree helpers (designer actions)
 * ============================================================================= */

/** Walk formDef.sections tree and apply mutator when predicate matches */
const mutateSectionTree = (sections, predicate, mutator) => {
    if (!Array.isArray(sections)) return sections;
    return sections.map((s) => {
        const next = { ...s };
        if (predicate(next)) mutator(next);
        next.sections = mutateSectionTree(next.sections ?? [], predicate, mutator);
        return next;
    });
};

/** Remove a section from tree by id (recursively) */
const removeSectionFromTree = (sections, removeId) => {
    if (!Array.isArray(sections)) return [];
    return sections
        .filter((s) => s?.id !== removeId)
        .map((s) => ({ ...s, sections: removeSectionFromTree(s.sections ?? [], removeId) }));
};

/** Remove a field from all sections by field id */
const removeFieldFromTree = (sections, fieldId) => {
    if (!Array.isArray(sections)) return [];
    return sections.map((s) => ({
        ...s,
        fields: (s.fields ?? []).filter((f) => f?.id !== fieldId),
        sections: removeFieldFromTree(s.sections ?? [], fieldId),
    }));
};

/** Collect all descendant sectionDef ids from a sectionDef node (including itself) */
const collectSectionDefIds = (sectionDef) => {
    const out = new Set();
    const walk = (node) => {
        if (!node?.id) return;
        out.add(node.id);
        (node.sections ?? []).forEach(walk);
    };
    walk(sectionDef);
    return out;
};

/** Find a sectionDef node by id in the tree */
const findSectionDefById = (sections, id) => {
    for (const s of sections ?? []) {
        if (s?.id === id) return s;
        const child = findSectionDefById(s?.sections ?? [], id);
        if (child) return child;
    }
    return null;
};

/** =============================================================================
 *  Components: UpdateField, UpdateFormSection, UpdateForm
 * ============================================================================= */

export const UpdateField = ({
    sectionDef,
    sectionInstance,
    fieldDef,
    submission,
    onFieldValueChange,
    onRemoveField,
    handleFormItemDefChange = (prev) => null,
    mode = "design"
}) => {
    const submissionField = selectSubmissionField(submission, sectionInstance, fieldDef);
    const value = submissionField?.value ?? "";
    // const handleFieldDefChange = useCallback(())
    return (
        <SimpleCardCapsule
            title={<>
                <strong>
                    <WrapWithDialog
                        id={fieldDef?.id}
                        name="label"
                        value={fieldDef?.label}
                        onChange={handleFormItemDefChange}
                    >
                        {fieldDef?.label ?? "------------"}
                    </WrapWithDialog>
                </strong>{" "}
                {(mode === "design") && <small>
                    <WrapWithDialog
                        id={fieldDef?.id}
                        name="name"
                        value={fieldDef?.name}
                        onChange={handleFormItemDefChange}
                    >
                        {fieldDef?.name ?? "------------"}
                    </WrapWithDialog>
                </small>}{" "}
                {fieldDef?.required ? <strong>*</strong> : null}
            </>}
        >
            {(mode === "design") &&
                <SimpleCardCapsuleRightCorner>
                    <DesignButton 
                        className="btn btn-sm btn-outline-primary border-0"
                        item={fieldDef}
                    >
                        PencilFill
                    </DesignButton>
                    <DeleteButton className="btn btn-sm border-0" type="button" onClick={() => onRemoveField(fieldDef?.id)} title="Remove field">
                        🗑
                    </DeleteButton>
                </SimpleCardCapsuleRightCorner>
            }
            <Input
                className="form-control" value={value}
                onChange={(e) => onFieldValueChange(sectionDef, sectionInstance, fieldDef, e.target.value)}
                placeholder="Enter value…"
            />
        </SimpleCardCapsule>

    );
};

export const UpdateFormSection = ({
    formSectionDef,
    submission,
    level = 2,
    dummy = true,
    mode = "design",
    // value events
    onFieldValueChange,

    // design events
    onAddSubSection,
    onRemoveSection,
    onAddField,
    onRemoveField,
    handleFormItemDefChange
}) => {
    const sectionInstances = useMemo(
        () => selectSubmissionSections(submission, formSectionDef, dummy),
        [submission, formSectionDef, dummy]
    );

    const max = formSectionDef?.repeatableMax ?? 1;
    const repeatable = formSectionDef?.repeatable ?? (max > 1);
    const isErrorSingle = repeatable === false && sectionInstances.length > 1;

    const H = headingIndex[clamp(level, 1, 6)] ?? headingIndex[6];

    return (
        <SimpleCardCapsule title={<>
            {(mode === "design") && (<>{formSectionDef?.label ?? formSectionDef?.name}{" "}</>)}
            {(mode === "design") && <small>({formSectionDef?.name})</small>}
        </>} style={{ paddingLeft: 12, borderLeft: "2px solid #e02222ff" }}>
            {(mode === "design") &&
                <SimpleCardCapsuleRightCorner>
                    

                    <DeleteButton className="btn btn-sm border-0" type="button" onClick={() => onAddSubSection(formSectionDef?.id)} title="Add subsection">
                        + sekce
                    </DeleteButton>
                    <DeleteButton className="btn btn-sm border-0" type="button" onClick={() => onAddField(formSectionDef?.id)} title="Add field">
                        + field
                    </DeleteButton>
                    <DeleteButton className="btn btn-sm border-0" type="button" onClick={() => onRemoveSection(formSectionDef?.id)} title="Remove section">
                        🗑
                    </DeleteButton>
                </SimpleCardCapsuleRightCorner>
            }
            <div>
                <H>
                    <WrapWithDialog
                        id={formSectionDef?.id}
                        name="label"
                        value={formSectionDef?.label}
                        onChange={handleFormItemDefChange}
                    >
                        {formSectionDef?.label ?? "------------"}
                    </WrapWithDialog>
                    {(mode === "design") &&
                        <small>
                            <WrapWithDialog
                                id={formSectionDef?.id}
                                name="name"
                                value={formSectionDef?.name}
                                onChange={handleFormItemDefChange}
                            >
                                {formSectionDef?.name ?? "------------"}
                            </WrapWithDialog>
                        </small>
                    }
                </H>
                <div>
                    repeat: {formSectionDef?.repeatableMin ?? "undef"}-
                    {formSectionDef?.repeatableMax ?? "undef"} ({repeatable ? "repeatable" : "single"})
                </div>
                <WrapWithDialog
                    id={formSectionDef?.id}
                    name="description"
                    value={formSectionDef?.description}
                    onChange={handleFormItemDefChange}
                >
                    {formSectionDef?.description ?? "------------"}
                </WrapWithDialog>

                <div>
                    {sectionInstances.map((inst, i) => (
                        <div
                            key={inst?.id ?? `${formSectionDef?.id}:${i}`}
                        >
                            <div>
                                <strong>Instance #{i + 1}</strong> {inst?._dummy ? <em>(dummy)</em> : null}
                            </div>

                            {/* Fields (nested in this section definition) */}
                            <div>
                                {(formSectionDef?.fields ?? []).length === 0 ? (
                                    <div style={{ opacity: 0.7 }}>— no fields —</div>
                                ) : (
                                    (formSectionDef?.fields ?? []).map((fieldDef) => (
                                        <UpdateField
                                            key={fieldDef?.id}
                                            sectionDef={formSectionDef}
                                            sectionInstance={inst}
                                            fieldDef={fieldDef}
                                            mode={mode}
                                            submission={submission}
                                            onFieldValueChange={onFieldValueChange}
                                            onRemoveField={onRemoveField}
                                            handleFormItemDefChange={handleFormItemDefChange}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Child sections recursion */}
                            <div>
                                {(formSectionDef?.sections ?? []).map((childDef) => (
                                    <UpdateFormSection
                                        key={childDef?.id}
                                        formSectionDef={childDef}
                                        submission={submission}
                                        level={level + 1}
                                        dummy={dummy}
                                        mode={mode}
                                        onFieldValueChange={onFieldValueChange}
                                        onAddSubSection={onAddSubSection}
                                        onRemoveSection={onRemoveSection}
                                        onAddField={onAddField}
                                        onRemoveField={onRemoveField}
                                        handleFormItemDefChange={handleFormItemDefChange}
                                    />
                                ))}
                            </div>

                            {/* TODO: repeatable UI (add/remove instances) */}
                        </div>
                    ))}
                </div>
            </div>
        </SimpleCardCapsule>
    );
};

export const UpdateForm = ({
    item: initialFormDef,
    submission: initialSubmission,
    dummy = true,
    debug = true,

    /** Event hooks for your GraphQL mutations */
    onFormDefinitionChange = () => { }, // (nextFormDef, meta) => void
    onSubmissionChange = () => { }, // (nextSubmission, meta) => void
    onPersist = () => { }, // ({formDef, submission, meta}) => void (debounced)
}) => {
    // Master states
    const [formDef, setFormDef] = useState(() => deepClone(initialFormDef ?? {}));
    const [mode, setMode] = useState("design")
    const [submission, setSubmission] = useState(() => ({
        ...(deepClone(initialSubmission ?? {})),
        sections: initialSubmission?.sections ?? [],
        fields: initialSubmission?.fields ?? [],
    }));

    const persistDebounced = useDebouncedCallback((nextFormDef, nextSubmission, meta) => {
        onPersist({ formDef: nextFormDef, submission: nextSubmission, meta });
    }, 700);

    /** ---------------------------
     *  Value changes (filling)
     * --------------------------- */
    const handleFieldValueChange = (sectionDef, sectionInstance, fieldDef, nextValue) => {
        setSubmission((prev) => {
            // ensure section instance exists in submission and has an id
            const { nextSubmission, ensuredSection } = ensureSectionInstanceInSubmission(prev, sectionInstance, sectionDef);

            // upsert field value into normalized + nested
            const next = upsertSubmissionFieldValue(nextSubmission, ensuredSection, fieldDef, nextValue);

            const meta = {
                kind: "submission.fieldValueChanged",
                formSectionId: sectionDef?.id,
                submissionSectionId: ensuredSection?.id,
                fieldId: fieldDef?.id,
                value: nextValue,
            };

            onSubmissionChange(next, meta);
            persistDebounced(formDef, next, meta);
            return next;
        });
    };

    /** ---------------------------
     *  Designer changes (structure)
     * --------------------------- */

    // Add subsection under a section definition (by id)
    const handleAddSubSection = (parentSectionDefId) => {
        setFormDef((prev) => {
            const next = deepClone(prev);

            next.sections = mutateSectionTree(
                next.sections ?? [],
                (s) => s?.id === parentSectionDefId,
                (s) => {
                    s.sections = s.sections ?? [];
                    s.sections.push({
                        __typename: "DigitalFormSectionGQLModel",
                        id: makeClientId(),
                        name: "NewSection",
                        label: "Nová sekce",
                        labelEn: null,
                        description: null,
                        sections: [],
                        fields: [],
                        repeatableMin: 0,
                        repeatableMax: 1,
                        repeatable: false,
                        order: (s.sections?.length ?? 0) + 1,
                    });
                }
            );

            const meta = { kind: "form.sectionAdded", parentSectionId: parentSectionDefId };
            onFormDefinitionChange(next, meta);
            persistDebounced(next, submission, meta);
            return next;
        });
    };

    // Add field into a section definition (by id)
    const handleAddField = (sectionDefId) => {
        setFormDef((prev) => {
            const next = deepClone(prev);

            next.sections = mutateSectionTree(
                next.sections ?? [],
                (s) => s?.id === sectionDefId,
                (s) => {
                    s.fields = s.fields ?? [];
                    s.fields.push({
                        __typename: "DigitalFormFieldGQLModel",
                        id: makeClientId(),
                        name: "NewField",
                        label: "Nové pole",
                        labelEn: null,
                        description: null,
                        required: false,
                        typeId: "text",
                        order: (s.fields?.length ?? 0) + 1,
                    });
                }
            );

            const meta = { kind: "form.fieldAdded", sectionId: sectionDefId };
            onFormDefinitionChange(next, meta);
            persistDebounced(next, submission, meta);
            return next;
        });
    };

    // Remove section definition (and cleanup submission linked to that sectionDef and descendants)
    const handleRemoveSection = (sectionDefId) => {
        // Find the section node first to know descendants
        const sectionNode = findSectionDefById(formDef?.sections ?? [], sectionDefId);
        const idsToRemove = sectionNode ? collectSectionDefIds(sectionNode) : new Set([sectionDefId]);

        setFormDef((prev) => {
            const next = deepClone(prev);
            // remove only the root id; descendants removed automatically by subtree removal
            next.sections = removeSectionFromTree(next.sections ?? [], sectionDefId);

            const meta = { kind: "form.sectionRemoved", sectionId: sectionDefId, descendantSectionIds: Array.from(idsToRemove) };
            onFormDefinitionChange(next, meta);
            // persist will happen after submission cleanup too, but ok to call here as well
            persistDebounced(next, submission, meta);
            return next;
        });

        // cleanup submission: remove section instances whose formSectionId is in idsToRemove, plus their fields
        setSubmission((prev) => {
            const prevSections = prev.sections ?? [];
            const removedSectionInstanceIds = new Set(
                prevSections.filter((ss) => idsToRemove.has(getFormSectionIdFromSubmissionSection(ss))).map((ss) => ss.id)
            );

            const nextSections = prevSections.filter((ss) => !idsToRemove.has(getFormSectionIdFromSubmissionSection(ss)));

            const nextFields = (prev.fields ?? []).filter((sf) => !removedSectionInstanceIds.has(getSectionIdFromSubmissionField(sf)));

            const next = { ...prev, sections: nextSections, fields: nextFields };

            const meta = {
                kind: "submission.cleanedAfterSectionRemoved",
                removedFormSectionIds: Array.from(idsToRemove),
                removedSubmissionSectionIds: Array.from(removedSectionInstanceIds),
            };
            onSubmissionChange(next, meta);
            persistDebounced(formDef, next, meta);
            return next;
        });
    };

    // Remove field definition (and cleanup submission field values for that field)
    const handleRemoveField = (fieldDefId) => {
        setFormDef((prev) => {
            const next = deepClone(prev);
            next.sections = removeFieldFromTree(next.sections ?? [], fieldDefId);

            const meta = { kind: "form.fieldRemoved", fieldId: fieldDefId };
            onFormDefinitionChange(next, meta);
            persistDebounced(next, submission, meta);
            return next;
        });

        setSubmission((prev) => {
            const nextFields = (prev.fields ?? []).filter((sf) => getFieldIdFromSubmissionField(sf) !== fieldDefId);
            const nextSections = (prev.sections ?? []).map((ss) => ({
                ...ss,
                fields: (ss.fields ?? []).filter((sf) => getFieldIdFromSubmissionField(sf) !== fieldDefId),
            }));

            const next = { ...prev, fields: nextFields, sections: nextSections };
            const meta = { kind: "submission.cleanedAfterFieldRemoved", fieldId: fieldDefId };
            onSubmissionChange(next, meta);
            persistDebounced(formDef, next, meta);
            return next;
        });
    };


    const handleFormItemDefChange = (id, attributeName, attributeValue) => {
        setFormDef((prev) => {
            const seen = new WeakSet();

            const traverse = (node) => {
                // primitives / null
                if (node == null || typeof node !== "object") return node;

                // guard against cycles (just in case)
                if (seen.has(node)) return node;
                seen.add(node);

                // arrays
                if (Array.isArray(node)) {
                    let changed = false;
                    const nextArr = node.map((child) => {
                        const nextChild = traverse(child);
                        if (nextChild !== child) changed = true;
                        return nextChild;
                    });
                    return changed ? nextArr : node;
                }

                // objects
                if (node.id === id) {
                    // no-op -> keep same ref
                    if (node[attributeName] === attributeValue) return node;
                    return { ...node, [attributeName]: attributeValue };
                }

                // traverse object properties; only clone if something changed
                let changed = false;
                let nextObj = node;

                for (const key of Object.keys(node)) {
                    const child = node[key];
                    const nextChild = traverse(child);
                    if (nextChild !== child) {
                        if (!changed) {
                            changed = true;
                            nextObj = { ...node }; // clone lazily
                        }
                        nextObj[key] = nextChild;
                    }
                }

                return nextObj;
            };

            return traverse(prev);
        });
    };

    /** ---------------------------
     *  Render
     * --------------------------- */
    return (
        <Row>
            <Col>
                <SimpleCardCapsule title={<>
                    {formDef?.name ?? "Form"}
                </>}>
                    <SimpleCardCapsuleRightCorner>

                        <DeleteButton
                            className="btn btn-sm border-0"
                            type="button"
                            onClick={() => {
                                // add top-level section
                                const newId = makeClientId();
                                setFormDef((prev) => {
                                    const next = deepClone(prev);
                                    next.sections = next.sections ?? [];
                                    next.sections.push({
                                        __typename: "DigitalFormSectionGQLModel",
                                        id: newId,
                                        name: "NewTopSection",
                                        label: "Nová top sekce",
                                        labelEn: null,
                                        description: null,
                                        sections: [],
                                        fields: [],
                                        repeatableMin: 0,
                                        repeatableMax: 1,
                                        repeatable: false,
                                        order: (next.sections?.length ?? 0) + 1,
                                    });

                                    const meta = { kind: "form.topSectionAdded", sectionId: newId };
                                    onFormDefinitionChange(next, meta);
                                    persistDebounced(next, submission, meta);
                                    return next;
                                });
                            }}
                        >
                            + top sekce
                        </DeleteButton>
                        <button className="btn btn-success btn-sm border-0" onClick={() => setMode(prev => prev==='design'?'view':'design')}>
                            {mode==='design'?'design':'view'}
                        </button>
                    </SimpleCardCapsuleRightCorner>

                    <h1>
                        <WrapWithDialog
                            id={formDef?.id}
                            name="name"
                            value={formDef?.name}
                            onChange={handleFormItemDefChange}
                        >
                            {formDef?.name ?? "Form"}
                        </WrapWithDialog>
                    </h1>

                    {formDef?.description && (<div>
                        <WrapWithDialog
                            id={formDef?.id}
                            name="description"
                            value={formDef?.description}
                            onChange={handleFormItemDefChange}
                        >
                            {formDef.description}
                        </WrapWithDialog>
                    </div>)}

                    <div>
                        {(formDef?.sections ?? []).map((secDef) => (
                            <UpdateFormSection
                                key={secDef?.id}
                                formSectionDef={secDef}
                                submission={submission}
                                level={2}
                                dummy={dummy}
                                mode={mode}
                                onFieldValueChange={handleFieldValueChange}
                                onAddSubSection={handleAddSubSection}
                                onRemoveSection={handleRemoveSection}
                                onAddField={handleAddField}
                                onRemoveField={handleRemoveField}
                                handleFormItemDefChange={handleFormItemDefChange}
                            />
                        ))}
                    </div>


                </SimpleCardCapsule>
            </Col>
            {debug && (
                <Col>
                    <SimpleCardCapsule title="Draft submission">
                        {/* <h3>Draft submission</h3> */}
                        <pre>{JSON.stringify(submission, null, 2)}</pre>
                    </SimpleCardCapsule>

                    <pre>{JSON.stringify(initialFormDef, null, 2)}</pre>
                </Col>)}
            {debug && (
                <Col>
                    <SimpleCardCapsule title="Draft form definition">
                        {/* <h3>Draft form definition</h3> */}
                        <pre>{JSON.stringify(formDef, null, 2)}</pre>
                    </SimpleCardCapsule>

                </Col>
            )}
        </Row>

    );
};





export const PageUpdateItem = ({
    SubPage = UpdateForm,
    ...props
}) => {
    return (
        <PageItemBase
            SubPage={SubPage}
            {...props}
        />
    )
}