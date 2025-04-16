"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction, Budget } from "@/lib/types";

interface BudgetComparisonProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetComparison({ transactions, budgets }: BudgetComparisonProps) {
  const comparisonData = useMemo(() => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const monthlyTotals = transactions
      .filter((t) => t.date >= firstDayOfMonth)
      .reduce((acc, transaction) => {
        const category = transaction.category;
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return budgets.map((budget) => ({
      category: budget.category,
      budget: budget.amount,
      spent: monthlyTotals[budget.category] || 0,
    }));
  }, [transactions, budgets]);

  if (budgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No budgets set
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
          />
          <Legend />
          <Bar
            dataKey="budget"
            name="Budget"
            fill="hsl(var(--chart-1))"
          />
          <Bar
            dataKey="spent"
            name="Spent"
            fill="hsl(var(--chart-2))"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}