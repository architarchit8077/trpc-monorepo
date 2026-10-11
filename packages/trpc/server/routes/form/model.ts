import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("Title of the form"),
  description: z.string().max(300).describe("Description of the form").nullable().optional(),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the created form"),
});

export const getFormByIdInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form to fetch"),
});

export const getFormByIdOutputModel = z
  .object({
    id: z.string().describe("ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    createdAt: z.date().nullable().describe("Form creation timestamp"),
    updatedAt: z.date().nullable().describe("Form update timestamp"),
    fields: z.array(
      z.object({
        id: z.string().describe("ID of the field"),
        formId: z.string().nullable().describe("ID of the parent form"),
        label: z.string().describe("Display label for the field"),
        labelKey: z.string().describe("Stable slug identifier for the field"),
        description: z.string().nullable().describe("Optional field description"),
        placeholder: z.string().nullable().describe("Optional field placeholder"),
        isRequired: z.boolean().describe("Whether the field is required"),
        index: z.union([z.string(), z.number()]).describe("Fractional sort index"),
        type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]),
        createdAt: z.date().nullable().describe("Field creation timestamp"),
        updatedAt: z.date().nullable().describe("Field update timestamp"),
      }),
    ),
  })
  .nullable();

export const submitFormInputModel = z.object({
  formId: z.string().uuid(),
  values: z.array(
    z.object({
      formFieldId: z.string().uuid(),
      value: z.string().max(10000),
    }),
  ),
});

export const submitFormOutputModel = z.object({
  id: z.string().uuid().describe("ID of the created submission"),
});

export const getFormSubmissionsInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form whose submissions are listed"),
});

export const getFormSubmissionsOutputModel = z.array(
  z.object({
    id: z.string().uuid(),
    formId: z.string().uuid().nullable(),
    values: z
      .array(
        z.object({
          formFieldId: z.string().uuid(),
          value: z.string(),
        }),
      )
      .nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  }),
);

export const createFieldInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form the field belongs to"),
  label: z.string().min(1).max(100).describe("Display label for the field"),
  labelKey: z.string().max(100).optional().describe("Stable slug identifier for the field"),
  description: z.string().max(2000).nullable().optional().describe("Optional field description"),
  placeholder: z.string().max(255).nullable().optional().describe("Optional field placeholder"),
  isRequired: z.boolean().default(false).describe("Whether the field is required"),
  index: z.coerce.number().describe("Fractional index used to sort fields in a form"),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type"),
});

export const createFieldOutputModel = z.object({
  id: z.string().describe("ID of the created field"),
});

export const getFieldInputModel = z.object({
  id: z.string().uuid().describe("ID of the field to fetch"),
});

export const getFieldOutputModel = z.object({
  id: z.string().describe("ID of the field"),
  formId: z.string().nullable().describe("ID of the parent form"),
  label: z.string().describe("Display label for the field"),
  labelKey: z.string().describe("Stable slug identifier for the field"),
  description: z.string().nullable().describe("Optional field description"),
  placeholder: z.string().nullable().describe("Optional field placeholder"),
  isRequired: z.boolean().describe("Whether the field is required"),
  index: z.union([z.string(), z.number()]).describe("Fractional sort index"),
  type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]).describe("Field type"),
  createdAt: z.date().nullable().describe("Field creation timestamp"),
  updatedAt: z.date().nullable().describe("Field update timestamp"),
});

export const listFieldsByFormIdInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form whose fields are listed"),
});

export const listFieldsByFormIdOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the field"),
    formId: z.string().nullable().describe("ID of the parent form"),
    label: z.string().describe("Display label for the field"),
    labelKey: z.string().describe("Stable slug identifier for the field"),
    description: z.string().nullable().describe("Optional field description"),
    placeholder: z.string().nullable().describe("Optional field placeholder"),
    isRequired: z.boolean().describe("Whether the field is required"),
    index: z.union([z.string(), z.number()]).describe("Fractional sort index"),
    type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  }),
);

export const updateFieldInputModel = z.object({
  id: z.string().uuid().describe("ID of the field to update"),
  formId: z
    .string()
    .uuid()
    .optional()
    .describe("Optional form ID when moving the field between forms"),
  label: z.string().min(1).max(100).optional().describe("Updated display label"),
  labelKey: z
    .string()
    .max(100)
    .optional()
    .describe("Stable slug identifier; preserve it unless explicitly changed"),
  description: z.string().max(2000).nullable().optional().describe("Updated field description"),
  placeholder: z.string().max(255).nullable().optional().describe("Updated field placeholder"),
  isRequired: z.boolean().optional().describe("Updated required state"),
  index: z.coerce.number().optional().describe("Updated fractional sort index"),
  type: z
    .enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"])
    .optional()
    .describe("Updated field type"),
});

export const updateFieldOutputModel = z.object({
  id: z.string().describe("ID of the updated field"),
});

export const deleteFieldInputModel = z.object({
  id: z.string().uuid().describe("ID of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("ID of the deleted field"),
});

export const listFormsByUserIdInputModel = z.undefined();

export const listFormsByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    createdAt: z.date().nullable().describe("Form creation timestamp"),
    updatedAt: z.date().nullable().describe("Form update timestamp"),
  }),
);
