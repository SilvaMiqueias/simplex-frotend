export interface Goal {
  id?: number;
  category: string;
  amount: number;
  description?: string;
  dateStart?: string;
  dateEnd?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Para exibição na UI
export interface GoalDisplay extends Goal {
  title: string;
  target: number;
  current: number;
  percentage: number;
}