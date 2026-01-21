export class Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  transactionType:  "INCOME" | "EXPENSE";
  paymentMethod: string;
  recurring: boolean = false;
  recurrenceType: string;
  dateTransaction: string;
}