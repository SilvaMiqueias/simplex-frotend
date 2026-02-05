import { Budget, BudgetResultDTO } from "@/components/model/budget";
import { api } from "../services/api";

export async function findAllBudgets(referenceDate: BudgetResultDTO){
     const { data } = await api.get("api/v1/customer/budget/find-all", {params: referenceDate});
     return data;
}

export async function requestCreateBudget(budget: Budget){
     const { data } = await api.post("api/v1/customer/budget/create", budget);
     return data;
}

export async function requestUpdateBudget(budget: Budget){
     const { data } = await api.put("api/v1/customer/budget/update", budget);
     return data;
}

export async function requestDeleteBudget(id: number){
     const { data } = await api.delete("api/v1/customer/budget/delete/" + id);
     return data;
}


export async function findAllGoals(referenceDate: BudgetResultDTO){
     const { data } = await api.get("api/v1/customer/goal/find-all-chart", {params: referenceDate});
     return data;
}

export async function requestCreateGoal(budget: Budget){
     const { data } = await api.post("api/v1/customer/goal/create", budget);
     return data;
}

export async function requestUpdateGoal(budget: Budget){
     const { data } = await api.put("api/v1/customer/goal/update", budget);
     return data;
}

export async function requestDeleteGoal(id: number){
     const { data } = await api.delete("api/v1/customer/goal/delete/" + id);
     return data;
}