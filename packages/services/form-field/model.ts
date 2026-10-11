import { z } from "zod";

export const fieldTypeValues = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;

export const createFieldInput = z.object({
  formId: z.uuid().describe("ID of the form the field belongs to"),
  label: z.string().min(1).max(100).describe("Display label for the field"),
  labelKey: z.string().max(100).optional().describe("Stable slug identifier for the field"),
  description: z.string().max(2000).nullable().optional().describe("Optional field description"),
  placeholder: z.string().max(255).nullable().optional().describe("Optional field placeholder"),
  isRequired: z.boolean().default(false).describe("Whether the field is required"),
  index: z.coerce.number().describe("Fractional index used to sort fields in a form"),
  type: z.enum(fieldTypeValues).describe("Field type"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z.object({
  id: z.uuid().describe("ID of the field to update"),
  formId: z.uuid().optional().describe("Optional form ID when moving the field between forms"),
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
  type: z.enum(fieldTypeValues).optional().describe("Updated field type"),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const getFieldInput = z.object({
  id: z.uuid().describe("ID of the field to fetch"),
});

export type GetFieldInputType = z.infer<typeof getFieldInput>;

export const deleteFieldInput = z.object({
  id: z.uuid().describe("ID of the field to delete"),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const listFieldsByFormIdInput = z.object({
  formId: z.uuid().describe("ID of the form whose fields are listed"),
  userId: z.uuid().describe("ID of the user who owns the form"),
});

export type ListFieldsByFormIdInputType = z.infer<typeof listFieldsByFormIdInput>;
