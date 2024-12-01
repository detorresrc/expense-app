import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { formatter } from "@/lib/utils";
import {
  deleteExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions);
  const { data: pendingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions
  );

  if (error) return "An error occurred: " + error.message;

  return (
    <div>
      <Table className='p-2 max-w-3xl m-auto'>
        <TableCaption>A list of all your expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array(3)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                </TableRow>
              ))}
          {pendingCreateExpense?.expense && (
            <TableRow className='animate-pulse'>
              <TableCell className='font-medium'>
                <Skeleton className='h-4' />
              </TableCell>
              <TableCell>{pendingCreateExpense.expense?.title}</TableCell>
              <TableCell>
                {formatter.format(Number(pendingCreateExpense.expense?.amount))}
              </TableCell>
              <TableCell>
                {pendingCreateExpense.expense?.referenceDate.split("T")[0]}
              </TableCell>
              <TableCell>
                <Skeleton className='h-4' />
              </TableCell>
            </TableRow>
          )}
          {data?.expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className='font-medium'>{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{formatter.format(Number(expense.amount))}</TableCell>
              <TableCell>{expense.referenceDate}</TableCell>
              <TableCell>
                <ExpenseDeleteButton id={expense.id}></ExpenseDeleteButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const ExpenseDeleteButton: FC<{ id: number }> = ({ id }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: ({ message }) => {
      toast.error(message);
    },
    onSuccess: async () => {
      toast.success("Expense deleted successfully");

      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter(
            (expense) => expense.id !== id
          ),
        })
      );
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ expenseId: id })}
      variant={"outline"}
      size={"icon"}
    >
      {mutation.isPending ? "..." : <Trash size={20} />}
    </Button>
  );
};
