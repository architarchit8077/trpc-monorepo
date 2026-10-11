"use client";

import { useParams } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { useGetFormSubmissions, useListFieldsByFormId } from "~/hooks/api/form";

const formatSubmittedAt = (value: Date | string | null) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof value === "string" ? new Date(value) : value);
};

export default function FormSubmissionsPage() {
  const { id: formId } = useParams<{ id: string }>();
  const { fields, error: fieldsError, isLoading: fieldsLoading } = useListFieldsByFormId(formId);
  const {
    submissions,
    error: submissionsError,
    isLoading: submissionsLoading,
    refetch,
  } = useGetFormSubmissions(formId, fields !== undefined && !fieldsError);

  const renderContent = () => {
    if (fieldsLoading) {
      return <p className="py-12 text-sm text-muted-foreground">Loading form fields...</p>;
    }

    if (fieldsError || !fields) {
      return (
        <div className="py-12">
          <h2 className="font-medium">Could not load this form</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check that you own this form, then try again.
          </p>
        </div>
      );
    }

    if (submissionsLoading) {
      return <p className="py-12 text-sm text-muted-foreground">Loading submissions...</p>;
    }

    if (submissionsError || !submissions) {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 py-12">
          <div>
            <h2 className="font-medium">Could not load submissions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Please try again in a moment.</p>
          </div>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      );
    }

    if (submissions.length === 0) {
      return (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No responses have been submitted yet.
        </p>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-44 bg-background">Submitted</TableHead>
            {fields.map((field) => (
              <TableHead key={field.id} className="min-w-48">
                {field.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="sticky left-0 z-10 bg-background text-muted-foreground">
                {formatSubmittedAt(submission.createdAt)}
              </TableCell>
              {fields.map((field) => {
                const answer = submission.values?.find(
                  (value) => value.formFieldId === field.id,
                )?.value;
                const displayValue = answer === "yes" ? "Yes" : answer === "no" ? "No" : answer;

                return (
                  <TableCell
                    key={field.id}
                    className="max-w-80 whitespace-pre-wrap wrap-break-word"
                  >
                    {displayValue || <span className="text-muted-foreground">No answer</span>}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Form submissions" />
        <main className="flex min-w-0 flex-1 flex-col p-4 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Responses for this form</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Submissions</h1>
            </div>
            {!fieldsLoading && !fieldsError && submissions && (
              <p className="text-sm text-muted-foreground">
                {submissions.length} {submissions.length === 1 ? "response" : "responses"}
              </p>
            )}
          </div>
          <section className="min-w-0 border-t border-border" aria-label="Form submissions">
            {renderContent()}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
