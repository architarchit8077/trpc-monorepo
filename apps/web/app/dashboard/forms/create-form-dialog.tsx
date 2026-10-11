"use client";

import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { LoaderCircle, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useCreateForm } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
};

export function CreateFormDialog() {
  const [open, setOpen] = useState(false);
  const { createForm, error, status } = useCreateForm();
  const isPending = status === "pending";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<CreateFormValues> = (values) => {
    createForm(
      {
        title: values.title.trim(),
        description: values.description.trim() || null,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create a form
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
          <DialogDescription>
            Add a title and an optional description for your form.
          </DialogDescription>
        </DialogHeader>
        <form id="create-form" className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="form-title">Title</Label>
            <Input
              id="form-title"
              autoFocus
              maxLength={55}
              aria-invalid={!!errors.title}
              {...register("title", {
                required: "Enter a title for your form.",
                maxLength: {
                  value: 55,
                  message: "The title must be 55 characters or fewer.",
                },
                validate: (value) => value.trim().length > 0 || "Enter a title for your form.",
              })}
            />
            {errors.title && (
              <p className="text-sm text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              maxLength={300}
              rows={4}
              aria-invalid={!!errors.description}
              {...register("description", {
                maxLength: {
                  value: 300,
                  message: "The description must be 300 characters or fewer.",
                },
              })}
            />
            {errors.description && (
              <p className="text-sm text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error.message}
            </p>
          )}
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-form" disabled={isPending}>
            {isPending && <LoaderCircle className="animate-spin" />}
            {isPending ? "Creating..." : "Create form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
