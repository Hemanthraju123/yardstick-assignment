"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Budget } from "@/lib/types";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Calculate total spending
    const totalSpent = transactions
      .filter((t) => t.date >= firstDayOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate category spending
    const categorySpending = transactions
      .filter((t) => t.date >= firstDayOfMonth)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Find highest spending category
    const highestCategory = Object.entries(categorySpending).reduce(
      (max, [category, amount]) =>
        amount > (max.amount || 0) ? { category, amount } : max,
      { category: "", amount: 0 }
    );

    // Check budget status
    const budgetWarnings = budgets
      .map((budget) => {
        const spent = categorySpending[budget.category] || 0;
        const percentage = (spent / budget.amount) * 100;
        return {
          category: budget.category,
          percentage,
          remaining: budget.amount - spent,
        };
      })
      .filter((status) => status.percentage > 80);

    return {
      totalSpent,
      highestCategory,
      budgetWarnings,
    };
  }, [transactions, budgets]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${insights.totalSpent.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highest Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{insights.highestCategory.category}</p>
          <p className="text-sm text-muted-foreground">
            ${insights.highestCategory.amount.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.budgetWarnings.length === 0 ? (
              <p className="text-sm text-muted-foreground">All budgets on track</p>
            ) : (
              insights.budgetWarnings.map((warning) => (
                <div key={warning.category}>
                  <p className="font-medium">{warning.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {warning.percentage.toFixed(0)}% used (${warning.remaining.toFixed(2)} remaining)
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}