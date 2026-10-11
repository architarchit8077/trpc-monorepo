"use client";

import { useState } from "react";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ArrowLeft, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import {
  useCreateField,
  useDeleteField,
  useListFieldsByFormId,
  useListFormsByUserId,
  useUpdateField,
} from "~/hooks/api/form";

type CreateFieldValues = {
  label: string;
  type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
  description: string;
  placeholder: string;
  isRequired: boolean;
};

export function FormBuilder({ formId }: { formId: string }) {
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldToDelete, setFieldToDelete] = useState<{ id: string; label: string } | null>(null);
  const { forms, error, isLoading } = useListFormsByUserId();
  const { fields, error: fieldsError, isLoading: areFieldsLoading } = useListFieldsByFormId(formId);
  const { createField, error: createFieldError, status: createFieldStatus } = useCreateField();
  const { updateField, error: updateFieldError, status: updateFieldStatus } = useUpdateField();
  const { deleteField, error: deleteFieldError, status: deleteFieldStatus } = useDeleteField();
  const isSavingField = createFieldStatus === "pending" || updateFieldStatus === "pending";
  const fieldSaveError = editingFieldId ? updateFieldError : createFieldError;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: fieldErrors },
  } = useForm<CreateFieldValues>({
    defaultValues: {
      label: "",
      type: "TEXT",
      description: "",
      placeholder: "",
      isRequired: false,
    },
  });

  const onSaveField: SubmitHandler<CreateFieldValues> = (values) => {
    const fieldValues = {
      label: values.label.trim(),
      type: values.type,
      description: values.description.trim() || null,
      placeholder: values.placeholder.trim() || null,
      isRequired: values.isRequired,
    };

    if (editingFieldId) {
      updateField(
        { id: editingFieldId, ...fieldValues },
        {
          onSuccess: () => {
            reset();
            setEditingFieldId(null);
          },
        },
      );
      return;
    }

    const nextIndex =
      (fields?.reduce((maxIndex, field) => Math.max(maxIndex, Number(field.index)), 0) ?? 0) + 1;

    createField(
      {
        formId,
        ...fieldValues,
        index: nextIndex,
      },
      {
        onSuccess: () => {
          reset();
          setIsAddingField(false);
        },
      },
    );
  };

  const onDeleteField = () => {
    if (!fieldToDelete) return;

    deleteField({ id: fieldToDelete.id }, { onSuccess: () => setFieldToDelete(null) });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 py-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="mx-auto w-full max-w-5xl py-6 text-sm text-destructive" role="alert">
        {error.message}
      </p>
    );
  }

  const form = forms?.find((item) => item.id === formId);

  if (!form) {
    return (
      <Empty className="mx-auto my-6 w-full max-w-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconClipboardText />
          </EmptyMedia>
          <EmptyTitle>Form not found</EmptyTitle>
          <EmptyDescription>
            This form may have been removed or may not belong to your account.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild variant="outline">
          <Link href="/dashboard/forms">
            <ArrowLeft />
            Back to forms
          </Link>
        </Button>
      </Empty>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 py-4">
      <div className="flex flex-col gap-4">
        <Button asChild className="w-fit px-0" size="sm" variant="ghost">
          <Link href="/dashboard/forms">
            <ArrowLeft />
            All forms
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Form builder</p>
          <h2 className="mt-1 text-2xl font-semibold">{form.title}</h2>
          {form.description && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{form.description}</p>
          )}
        </div>
      </div>

      <section className="overflow-hidden rounded-md border">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <h3 className="font-medium">Form fields</h3>
          {!isAddingField && !editingFieldId && (
            <Button type="button" size="sm" onClick={() => setIsAddingField(true)}>
              <Plus />
              Add field
            </Button>
          )}
        </div>
        {(isAddingField || editingFieldId) && (
          <form className="space-y-5 border-b p-5" onSubmit={handleSubmit(onSaveField)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="field-label">Field label</Label>
                <Input
                  id="field-label"
                  autoFocus
                  maxLength={100}
                  aria-invalid={!!fieldErrors.label}
                  {...register("label", {
                    required: "Enter a label for this field.",
                    maxLength: {
                      value: 100,
                      message: "The label must be 100 characters or fewer.",
                    },
                    validate: (value) => value.trim().length > 0 || "Enter a label for this field.",
                  })}
                />
                {fieldErrors.label && (
                  <p className="text-sm text-destructive" role="alert">
                    {fieldErrors.label.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="field-type">Field type</Label>
                <select
                  id="field-type"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  {...register("type")}
                >
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="EMAIL">Email</option>
                  <option value="YES_NO">Yes / No</option>
                  <option value="PASSWORD">Password</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="field-description">Description</Label>
                <Textarea
                  id="field-description"
                  maxLength={2000}
                  rows={2}
                  {...register("description")}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input id="field-placeholder" maxLength={255} {...register("placeholder")} />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  {...register("isRequired")}
                />
                Required field
              </label>
            </div>
            {fieldSaveError && (
              <p className="text-sm text-destructive" role="alert">
                {fieldSaveError.message}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSavingField}
                onClick={() => {
                  reset();
                  setIsAddingField(false);
                  setEditingFieldId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingField}>
                {isSavingField ? <LoaderCircle className="animate-spin" /> : null}
                {isSavingField ? "Saving..." : editingFieldId ? "Save changes" : "Add field"}
              </Button>
            </div>
          </form>
        )}
        {fieldsError ? (
          <p className="p-5 text-sm text-destructive" role="alert">
            {fieldsError.message}
          </p>
        ) : areFieldsLoading ? (
          <div className="space-y-3 p-5" aria-label="Loading fields">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : fields?.length ? (
          <ol className="divide-y">
            {fields.map((field) => (
              <li
                key={field.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{field.label}</p>
                  {field.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{field.description}</p>
                  )}
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {field.type.replace("_", " / ")}
                  {field.isRequired ? " · Required" : " · Optional"}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title={`Edit ${field.label}`}
                    aria-label={`Edit ${field.label}`}
                    onClick={() => {
                      reset({
                        label: field.label,
                        type: field.type,
                        description: field.description ?? "",
                        placeholder: field.placeholder ?? "",
                        isRequired: field.isRequired,
                      });
                      setIsAddingField(false);
                      setEditingFieldId(field.id);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title={`Delete ${field.label}`}
                    aria-label={`Delete ${field.label}`}
                    onClick={() => setFieldToDelete({ id: field.id, label: field.label })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <Empty className="min-h-64 border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconClipboardText />
              </EmptyMedia>
              <EmptyTitle>No fields added</EmptyTitle>
              <EmptyDescription>Add a field to start building your form.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
      <AlertDialog
        open={!!fieldToDelete}
        onOpenChange={(open) => {
          if (!open && deleteFieldStatus !== "pending") setFieldToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete field?</AlertDialogTitle>
            <AlertDialogDescription>
              {fieldToDelete
                ? `"${fieldToDelete.label}" will be permanently removed from this form.`
                : "This field will be permanently removed from this form."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteFieldError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteFieldError.message}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFieldStatus === "pending"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteFieldStatus === "pending"}
              onClick={(event) => {
                event.preventDefault();
                onDeleteField();
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteFieldStatus === "pending" && <LoaderCircle className="animate-spin" />}
              {deleteFieldStatus === "pending" ? "Deleting..." : "Delete field"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
