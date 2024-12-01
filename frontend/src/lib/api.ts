import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { CreateExpense } from "@server/shared/expense";
import { toast } from "sonner";

const client = hc<ApiRoutes>("/");

export const api = client.api;

const getCurrentUser = async () => {
  const res = await api.auth.me.$get();
  if (!res.ok) throw new Error("Failed to fetch current user");

  const data = await res.json();
  return data.user;
};

export const userQueryOptions = queryOptions({
  queryKey: ["current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export const getExpenses = async () => {
  const res = await api.expenses.$get();
  if (res.ok == false) throw new Error("Failed to fetch expenses");

  const data = await res.json();

  return data;
};

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["expenses"],
  queryFn: getExpenses,
  staleTime: 1000 * 60 * 5,
});

export const createExpense = async (expense: CreateExpense) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res = await api.expenses.$post({
    json: expense,
  });
  if (!res.ok) {
    throw new Error("Failed to delete expense");
  }

  const newExpense = await res.json();

  toast.success("Expense created successfully");

  return newExpense;
};

export const loadingCreateExpenseQueryOptions = queryOptions<{expense?: CreateExpense}>({
  queryKey: ["loading-create-expense"]
});

export const deleteExpense = async ({expenseId}: {expenseId: number}) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res = await api.expenses[":id"].$delete({param: {id: expenseId.toString()}});
  if (!res.ok) {
    throw new Error("Failed to delete expense");
  }
} 