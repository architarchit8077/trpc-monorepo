import { asc, db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formsFieldsTable } from "@repo/database/models/form-field";
import {
  type CreateFormInputType,
  type GetFormByIdInputType,
  type ListFormsByUserIdInputType,
  createFormInput,
  getFormByIdInput,
  listFormsByUserIdInput,
} from "./model";

class FormService {
  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload);
    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return forms;
  }

  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload);
    const result = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        field: {
          id: formsFieldsTable.id,
          formId: formsFieldsTable.formId,
          label: formsFieldsTable.label,
          labelKey: formsFieldsTable.labelKey,
          description: formsFieldsTable.description,
          placeholder: formsFieldsTable.placeholder,
          isRequired: formsFieldsTable.isRequired,
          index: formsFieldsTable.index,
          type: formsFieldsTable.type,
          createdAt: formsFieldsTable.createdAt,
          updatedAt: formsFieldsTable.updatedAt,
        },
      })
      .from(formsTable)
      .leftJoin(formsFieldsTable, eq(formsTable.id, formsFieldsTable.formId))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formsFieldsTable.index));

    const form = result[0];
    if (!form) return null;

    return {
      id: form.id,
      title: form.title,
      description: form.description,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      fields: result.flatMap((row) => (row.field ? [row.field] : [])),
    };
  }

  public async createForm(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);
    const result = await db
      .insert(formsTable)
      .values({ title, description, createdBy })
      .returning({ id: formsTable.id });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error("Something went wrong while creating form");

    return { id: result[0].id };
  }
}

export default FormService;
