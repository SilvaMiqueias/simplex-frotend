export class Budget {
  id?: number;
  category?: string = "";
  amount?: number = 0;
  dateReference?: string = new Date().toISOString();
  description?: string;
}

export class BudgetChart {
  id?: number;
  category?: number = 0;
  amount?: number = 0;
  spentAmount?: number = 0;
  remainingAmount?: number = 0;
  dateReference?: string = new Date().toISOString();
  description?: string;
}

export interface BudgetResultDTO{
  referenceDate?: string;
}