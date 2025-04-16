"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetComparison } from "@/components/BudgetComparison";
import { SpendingInsights } from "@/components/SpendingInsights";
import { Transaction, Budget } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const addBudget = (budget: Budget) => {
    setBudgets([...budgets, budget]);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Personal Finance Tracker</h1>
          <p className="text-muted-foreground">
            Track your expenses, set budgets, and gain insights into your spending patterns
          </p>
        </div>

        <SpendingInsights transactions={transactions} budgets={budgets} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm onSubmit={addTransaction} />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Set Budget</h2>
            <BudgetForm onSubmit={addBudget} existingBudgets={budgets} />
          </Card>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="charts">
            <TabsList className="mb-4">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="charts">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
                  <MonthlyExpensesChart transactions={transactions} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
                  <CategoryPieChart transactions={transactions} />
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Budget vs Actual</h3>
                <BudgetComparison transactions={transactions} budgets={budgets} />
              </div>
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionList
                transactions={transactions}
                onDelete={deleteTransaction}
                onEdit={editTransaction}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}