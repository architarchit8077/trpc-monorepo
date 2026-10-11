import { and, db, desc, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formsFieldsTable } from "@repo/database/models/form-field";
import { formsSubmissionsTable } from "@repo/database/models/form-submission";
import {
  type GetFormSubmissionsInputType,
  type SubmitFormInputType,
  getFormSubmissionsInput,
  submitFormInput,
} from "./model";

class FormSubmissionService {
  public async getFormSubmissions(payload: GetFormSubmissionsInputType) {
    const { formId, userId } = await getFormSubmissionsInput.parseAsync(payload);
    const form = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
      .limit(1);

    if (!form.length) throw new Error("Form not found");

    return await db
      .select({
        id: formsSubmissionsTable.id,
        formId: formsSubmissionsTable.formId,
        values: formsSubmissionsTable.values,
        createdAt: formsSubmissionsTable.createdAt,
        updatedAt: formsSubmissionsTable.updatedAt,
      })
      .from(formsSubmissionsTable)
      .where(eq(formsSubmissionsTable.formId, formId))
      .orderBy(desc(formsSubmissionsTable.createdAt));
  }

  public async submitForm(payload: SubmitFormInputType) {
    const { formId, values } = await submitFormInput.parseAsync(payload);
    const form = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.id, formId))
      .limit(1);

    if (!form.length) throw new Error("Form not found");

    const fields = await db
      .select({ id: formsFieldsTable.id, isRequired: formsFieldsTable.isRequired })
      .from(formsFieldsTable)
      .where(eq(formsFieldsTable.formId, formId));
    const fieldIds = new Set(fields.map((field) => field.id));
    const submittedIds = new Set(values.map((entry) => entry.formFieldId));

    if (
      submittedIds.size !== values.length ||
      values.some((entry) => !fieldIds.has(entry.formFieldId))
    ) {
      throw new Error("Submission contains invalid form fields");
    }

    const submittedValues = new Map(values.map((entry) => [entry.formFieldId, entry.value]));
    if (fields.some((field) => field.isRequired && !submittedValues.get(field.id)?.trim())) {
      throw new Error("Please complete all required fields");
    }

    const result = await db
      .insert(formsSubmissionsTable)
      .values({ formId, values })
      .returning({ id: formsSubmissionsTable.id });

    if (!result[0]?.id) throw new Error("Something went wrong while submitting the form");

    return { id: result[0].id };
  }
}

export default FormSubmissionService;
