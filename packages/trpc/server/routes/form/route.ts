import FormService from "@repo/services/form";
import FormFieldService from "@repo/services/form-field";
import FormSubmissionService from "@repo/services/form-submission";

import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFieldInputModel,
  createFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  getFormByIdInputModel,
  getFormByIdOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  getFieldInputModel,
  getFieldOutputModel,
  getFormSubmissionsInputModel,
  getFormSubmissionsOutputModel,
  listFieldsByFormIdInputModel,
  listFieldsByFormIdOutputModel,
  listFormsByUserIdInputModel,
  listFormsByUserIdOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

const formService = new FormService();
const formFieldService = new FormFieldService();
const formSubmissionService = new FormSubmissionService();

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;
      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user?.id,
      });
      return { id };
    }),

  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormById"),
        tags: TAGS,
        protect: false,
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input }) => {
      return await formService.getFormById(input);
    }),

  getForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getForm"),
        tags: TAGS,
        protect: false,
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input }) => {
      return await formService.getFormById(input);
    }),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
        protect: false,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      return await formSubmissionService.submitForm(input);
    }),

  getFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormSubmissions"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input, ctx }) => {
      return await formSubmissionService.getFormSubmissions({
        ...input,
        userId: ctx.user.id,
      });
    }),

  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.createField(input);
      return { id };
    }),

  getField: authenticatedProcedure
    .meta({
      // this must be public
      openapi: {
        method: "POST",
        path: getPath("/getField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFieldInputModel)
    .output(getFieldOutputModel)
    .query(async ({ input }) => {
      return await formFieldService.getField(input);
    }),

  listFieldsByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listFieldsByFormId"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFieldsByFormIdInputModel)
    .output(listFieldsByFormIdOutputModel)
    .query(async ({ input, ctx }) => {
      return await formFieldService.listFieldsByFormId({ ...input, userId: ctx.user.id });
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.updateField(input);
      return { id };
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.deleteField(input);
      return { id };
    }),

  listFormsByUserId: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listFormsByUserId"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFormsByUserIdInputModel)
    .output(listFormsByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId({ userId: ctx.user.id });
      return forms;
    }),
});
