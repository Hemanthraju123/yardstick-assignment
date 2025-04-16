"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Transaction } from "@/lib/types";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const data: { [key: string]: number } = {};
    
    transactions.forEach((transaction) => {
      const monthKey = format(transaction.date, "MMM yyyy");
      data[monthKey] = (data[monthKey] || 0) + transaction.amount;
    });

    return Object.entries(data)
      .map(([month, total]) => ({
        month,
        total,
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split(" ");
        const [monthB, yearB] = b.month.split(" ");
        return (
          new Date(`${monthA} 1, ${yearA}`).getTime() -
          new Date(`${monthB} 1, ${yearB}`).getTime()
        );
      });
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
          />
          <Bar dataKey="total" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}