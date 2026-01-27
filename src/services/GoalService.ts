import api from "./api";
import { Goal } from "@/components/model/goal";

export async function findAllGoals(): Promise<Goal[]> {
  const response = await api.get("/customer/goal/find-all");
  return response.data;
}

export async function createGoal(goal: Goal): Promise<Goal> {
  const response = await api.post("/customer/goal/create", goal);
  return response.data;
}

export async function updateGoal(goal: Goal): Promise<Goal> {
  const response = await api.put("/customer/goal/update", goal);
  return response.data;
}

export async function deleteGoal(id: number): Promise<void> {
  await api.delete(`/customer/goal/delete?id=${id}`);
}