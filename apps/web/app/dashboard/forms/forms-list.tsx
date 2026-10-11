"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useListFormsByUserId } from "~/hooks/api/form";
import { IconClipboardText } from "@tabler/icons-react";
import { CreateFormDialog } from "./create-form-dialog";

const formatDate = (date: Date | string | null) =>
  date ? new Date(date).toISOString().slice(0, 10) : "-";

export function FormsList() {
  const { forms, error, isLoading, refetch } = useListFormsByUserId();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col py-2">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your forms</h2>
          <p className="text-sm text-muted-foreground">Manage the forms you have created.</p>
        </div>
        {forms && forms.length > 0 && <CreateFormDialog />}
      </div>

      {isLoading ? (
        <div className="space-y-3" aria-label="Loading forms">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load forms</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error.message}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : forms?.length === 0 ? (
        <Empty className="my-auto w-full max-w-lg self-center border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconClipboardText />
            </EmptyMedia>
            <EmptyTitle>No forms yet</EmptyTitle>
            <EmptyDescription>Forms you create will appear here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateFormDialog />
          </EmptyContent>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms?.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <Link className="hover:underline" href={`/dashboard/forms/${form.id}`}>
                      {form.title}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-sm truncate text-muted-foreground">
                    {form.description || "-"}
                  </TableCell>
                  <TableCell>{formatDate(form.createdAt)}</TableCell>
                  <TableCell>{formatDate(form.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        Open builder
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
