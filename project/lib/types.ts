export type Category = 
  | "Food & Dining"
  | "Transportation"
  | "Housing"
  | "Entertainment"
  | "Shopping"
  | "Healthcare"
  | "Utilities"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: Category;
}

export interface Budget {
  category: Category;
  amount: number;
}

export interface CategoryTotal {
  category: Category;
  total: number;
}