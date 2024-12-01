import { date, index, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    referenceDate: date("reference_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (expenses) => {
    return {
      userIdIndex: index("user_id_index").on(expenses.userId),
    };
  }
);

export const insertExpenseSchema = createInsertSchema(expenses, {
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(255),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid amount" })
});
export const selectExpenseSchema = createSelectSchema(expenses);