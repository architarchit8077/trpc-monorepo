import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(55).describe("Title of the form"),
  description: z.string().max(300).describe("Description of the form").nullable().optional(),
  createdBy: z.uuid().nullable().optional().describe("User ID of the form creator"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormsByUserIdInput = z.object({
  userId: z.uuid().describe("ID of the user whose forms are listed"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;

export const getFormByIdInput = z.object({
  formId: z.uuid().describe("ID of the form to fetch"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;
