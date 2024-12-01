import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { createExpense, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from "@/lib/api";
import { createExpenseSchema } from "@server/shared/expense";

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "",
      referenceDate: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions
      );

      navigate({ to: "/expenses" });

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, { expense: value });

      try {
        const newExpense = await createExpense(value);
        if (newExpense) {
          queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
            ...existingExpenses,
            expenses: [newExpense.expense, ...existingExpenses.expenses],
          });
        }
      } catch (e) {
      } finally {
        queryClient.setQueryData(["loading-create-expense"], {});
      }
    },
  });

  return (
    <div className='p-2 max-w-3xl m-auto'>
      <h2 className='my-6'>Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='flex flex-col max-w-xl m-auto gap-y-4'
      >
        <div>
          <form.Field
            name='title'
            validators={{
              onChange: createExpenseSchema.shape.title,
            }}
            children={(field) => {
              return (
                <div className='grid w-full max-w-sm items-center gap-1.5 mb-4'>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name='amount'
            validators={{
              onChange: createExpenseSchema.shape.amount,
            }}
            children={(field) => {
              return (
                <div className='grid w-full max-w-sm items-center gap-1.5 mb-4'>
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    type='number'
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>

        <div>
          <form.Field
            name='referenceDate'
            validators={{
              onChange: createExpenseSchema.shape.referenceDate,
            }}
            children={(field) => {
              return (
                <div className='w-full max-w-sm items-center gap-1.5 mb-4'>
                  <Calendar
                    mode='single'
                    selected={new Date(field.state.value)}
                    onSelect={(date) =>
                      field.handleChange((date ?? new Date()).toISOString())
                    }
                    className='rounded-md border'
                  />
                </div>
              );
            }}
          />
        </div>

        <div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type='submit' disabled={!canSubmit} variant={"outline"}>
                {isSubmitting ? "Submiting..." : "Submit"}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
