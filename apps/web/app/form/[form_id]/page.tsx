"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useGetForm, useSubmitForm } from "~/hooks/api/form";

export default function PublicFormPage() {
  const params = useParams<{ form_id: string }>();
  const { form, error, isLoading } = useGetForm(params.form_id);
  const { submitForm, error: submitError, isPending, isError } = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    const formData = new FormData(event.currentTarget);
    const values = form.fields.map((field) => ({
      formFieldId: field.id,
      value: String(formData.get(field.id) ?? ""),
    }));

    submitForm({ formId: form.id, values }, { onSuccess: () => setSubmitted(true) });
  };

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-4 text-sm text-stone-600">
        <p role="status">Loading form...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-4 text-center">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">This form is unavailable</h1>
          <p className="mt-2 text-sm text-stone-600">We couldn&apos;t load this form.</p>
        </div>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-4 text-center">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">Form not found</h1>
          <p className="mt-2 text-sm text-stone-600">This form may have been removed.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-950 sm:py-16">
      <article className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="h-1.5 bg-emerald-700" />
        <div className="p-6 sm:p-10">
          <header className="border-b border-stone-200 pb-7">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {form.title}
            </h1>
            {form.description && (
              <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-stone-600">
                {form.description}
              </p>
            )}
          </header>

          {form.fields.length === 0 ? (
            <p className="py-8 text-sm text-stone-600">This form has no questions yet.</p>
          ) : (
            <form onSubmit={handleSubmit} className="pt-7">
              <div className="space-y-7">
                {form.fields.map((field) => {
                  const inputId = `field-${field.id}`;
                  const descriptionId = `${inputId}-description`;

                  return (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={inputId} className="block text-sm font-medium text-stone-900">
                        {field.label}
                        {field.isRequired && (
                          <span className="ml-1 text-rose-700" aria-label="required">
                            *
                          </span>
                        )}
                      </label>
                      {field.description && (
                        <p id={descriptionId} className="text-sm leading-6 text-stone-600">
                          {field.description}
                        </p>
                      )}

                      {field.type === "YES_NO" ? (
                        <select
                          id={inputId}
                          name={field.id}
                          required={field.isRequired}
                          defaultValue=""
                          aria-describedby={field.description ? descriptionId : undefined}
                          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/20"
                        >
                          <option value="" disabled>
                            Select an answer
                          </option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : field.type === "TEXT" ? (
                        <Textarea
                          id={inputId}
                          name={field.id}
                          placeholder={field.placeholder ?? undefined}
                          required={field.isRequired}
                          aria-describedby={field.description ? descriptionId : undefined}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={inputId}
                          name={field.id}
                          type={field.type === "PASSWORD" ? "password" : field.type.toLowerCase()}
                          placeholder={field.placeholder ?? undefined}
                          required={field.isRequired}
                          aria-describedby={field.description ? descriptionId : undefined}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {isError && (
                <p className="mt-6 text-sm text-rose-700" role="alert">
                  {submitError?.message ??
                    "Your response could not be submitted. Please try again."}
                </p>
              )}
              {submitted && (
                <p className="mt-6 text-sm font-medium text-emerald-800" role="status">
                  Your response has been submitted. Thank you.
                </p>
              )}
              <div className="mt-8 border-t border-stone-200 pt-6">
                <Button type="submit" disabled={isPending || submitted} className="min-w-32">
                  {isPending ? "Submitting..." : submitted ? "Submitted" : "Submit response"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </article>
    </main>
  );
}
