import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useCreateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFieldAsync,
    mutate: createField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFieldAsync,
    createField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useGetField = (input?: { id: string }) => {
  const {
    data: field,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  } = trpc.form.getField.useQuery(input ?? { id: "" }, {
    enabled: !!input?.id,
  });

  return {
    field,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  };
};

export const useGetForm = (formId: string) => {
  const {
    data: form,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  } = trpc.form.getForm.useQuery({ formId }, { enabled: !!formId });

  return {
    form,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  };
};

export const useSubmitForm = () => {
  const {
    mutate: submitForm,
    error,
    isError,
    isPending,
    isSuccess,
  } = trpc.form.submitForm.useMutation();

  return { submitForm, error, isError, isPending, isSuccess };
};

export const useGetFormSubmissions = (formId: string, enabled = true) => {
  const {
    data: submissions,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  } = trpc.form.getFormSubmissions.useQuery({ formId }, { enabled: !!formId && enabled });

  return {
    submissions,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  };
};

export const useListFieldsByFormId = (formId: string) => {
  const {
    data: fields,
    error,
    isLoading,
    refetch,
  } = trpc.form.listFieldsByFormId.useQuery({ formId }, { enabled: !!formId });

  return { fields, error, isLoading, refetch };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFieldAsync,
    mutate: updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.updateField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    updateFieldAsync,
    updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFieldAsync,
    mutate: deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.deleteField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useListFormsByUserId = () => {
  const {
    data: forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  } = trpc.form.listFormsByUserId.useQuery();

  return {
    forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    status,
  };
};
