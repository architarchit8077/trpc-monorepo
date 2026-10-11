import { and, asc, db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formsFieldsTable } from "@repo/database/models/form-field";
import {
  type CreateFieldInputType,
  type DeleteFieldInputType,
  type GetFieldInputType,
  type ListFieldsByFormIdInputType,
  type UpdateFieldInputType,
  createFieldInput,
  deleteFieldInput,
  getFieldInput,
  listFieldsByFormIdInput,
  updateFieldInput,
} from "./model";

const toSlug = (value: string) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

  return slug || "field";
};

class FormFieldService {
  public async listFieldsByFormId(payload: ListFieldsByFormIdInputType) {
    const { formId, userId } = await listFieldsByFormIdInput.parseAsync(payload);
    const form = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
      .limit(1);

    if (!form.length) throw new Error("Form not found");

    return await db
      .select()
      .from(formsFieldsTable)
      .where(eq(formsFieldsTable.formId, formId))
      .orderBy(asc(formsFieldsTable.index));
  }

  public async createField(payload: CreateFieldInputType) {
    const { formId, label, description, placeholder, isRequired, index, type, labelKey } =
      await createFieldInput.parseAsync(payload);

    const form = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.id, formId))
      .limit(1);

    if (!form.length) throw new Error("Form not found");

    const resolvedLabelKey = labelKey?.trim() || toSlug(label);

    const result = await db
      .insert(formsFieldsTable)
      .values({
        formId,
        label,
        labelKey: resolvedLabelKey,
        description: description ?? null,
        placeholder: placeholder ?? null,
        isRequired,
        index: index.toString(),
        type,
      })
      .returning({ id: formsFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while creating form field");

    return { id: result[0].id };
  }

  public async getField(payload: GetFieldInputType) {
    const { id } = await getFieldInput.parseAsync(payload);

    const field = await db
      .select()
      .from(formsFieldsTable)
      .where(eq(formsFieldsTable.id, id))
      .limit(1);

    if (!field.length) throw new Error("Field not found");

    return field[0]!;
  }

  public async updateField(payload: UpdateFieldInputType) {
    const parsed = await updateFieldInput.parseAsync(payload);

    const existingField = await db
      .select()
      .from(formsFieldsTable)
      .where(eq(formsFieldsTable.id, parsed.id))
      .limit(1);

    if (!existingField.length) throw new Error("Field not found");

    const currentField = existingField[0]!;
    const nextLabelKey = parsed.labelKey ?? currentField.labelKey ?? toSlug(currentField.label);

    const updates: Record<string, string | number | boolean | null | undefined> = {};

    if (parsed.formId !== undefined) updates.formId = parsed.formId;
    if (parsed.label !== undefined) updates.label = parsed.label;
    updates.labelKey = nextLabelKey;
    if (parsed.description !== undefined) updates.description = parsed.description ?? null;
    if (parsed.placeholder !== undefined) updates.placeholder = parsed.placeholder ?? null;
    if (parsed.isRequired !== undefined) updates.isRequired = parsed.isRequired;
    if (parsed.index !== undefined) updates.index = parsed.index.toString();
    if (parsed.type !== undefined) updates.type = parsed.type;

    const result = await db
      .update(formsFieldsTable)
      .set(updates)
      .where(eq(formsFieldsTable.id, parsed.id))
      .returning({ id: formsFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while updating form field");

    return { id: result[0].id };
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { id } = await deleteFieldInput.parseAsync(payload);

    const result = await db
      .delete(formsFieldsTable)
      .where(eq(formsFieldsTable.id, id))
      .returning({ id: formsFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while deleting form field");

    return { id: result[0].id };
  }
}

export default FormFieldService;
