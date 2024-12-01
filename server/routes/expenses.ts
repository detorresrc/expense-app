import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { eq, and, sql, desc, sum } from "drizzle-orm";

import { getUserMiddleware } from "../kinde";
import { db } from "../db";
import { expenses as expenseTable, insertExpenseSchema } from "../db/schema/expenses";
import { createExpenseSchema } from "../shared/expense";

const idParamSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
});

export const expensesRoute = new Hono()

  .get("/total-spent", getUserMiddleware, async (c) => {
    const { id: userId } = c.var.user;

    const totalSpent = await db
      .select({
        total: sum(expenseTable.amount),
      })
      .from(expenseTable)
      .where(eq(expenseTable.userId, userId))
      .limit(1)
      .then(res => res[0].total);

    return c.json({totalSpent: totalSpent || 0});
  })
  .get("/", getUserMiddleware, async (c) => {
    const { id: userId } = c.var.user;

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, userId))
      .orderBy(desc(expenseTable.createdAt));

    return c.json({ expenses });
  })
  .post(
    "/",
    getUserMiddleware,
    zValidator("json", createExpenseSchema),
    async (c) => {
      const { id: userId } = c.var.user;
      const expense = c.req.valid("json");
      
      const validatedExpense = insertExpenseSchema.parse({
        ...expense,
        userId
      });

      const insertedExpense = await db
        .insert(expenseTable)
        .values(validatedExpense)
        .returning()
        .then((res) => res[0]);

      return c.json(
        { message: "Expense created", expense: insertedExpense },
        201
      );
    }
  )
  .get(
    "/:id",
    getUserMiddleware,
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: expenseId } = c.req.param();
      const { id: userId } = c.var.user;

      const expense = await db
        .select()
        .from(expenseTable)
        .where(
          and(
            eq(expenseTable.id, Number(expenseId)),
            eq(expenseTable.userId, userId)
          )
        )
        .then((res) => res[0]);

      if (!expense)
        return c.json({ message: "Expense not found", code: 404 }, 404);

      return c.json({ expense });
    }
  )
  .delete(
    "/:id",
    getUserMiddleware,
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: expenseId } = c.req.param();
      const { id: userId } = c.var.user;

      const expense = await db
        .delete(expenseTable)
        .where(
          and(
            eq(expenseTable.id, Number(expenseId)),
            eq(expenseTable.userId, userId)
          )
        )
        .returning()
        .then((res) => res[0]);

      if (!expense)
        return c.json({ message: "Expense not found", code: 404 }, 404);

      return c.json({ message: "Expense deleted" });
    }
  );
