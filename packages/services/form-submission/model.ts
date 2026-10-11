import { z } from "zod";

export const submitFormInput = z.object({
  formId: z.uuid(),
  values: z.array(
    z.object({
      formFieldId: z.uuid(),
      value: z.string().max(10000),
    }),
  ),
});

export type SubmitFormInputType = z.infer<typeof submitFormInput>;

export const getFormSubmissionsInput = z.object({
  formId: z.uuid(),
  userId: z.uuid(),
});

export type GetFormSubmissionsInputType = z.infer<typeof getFormSubmissionsInput>;
