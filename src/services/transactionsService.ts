import { Transaction } from "@/components/model/transaction";
import { api } from "../services/api";

 
export async function getAllTransactionByAdmin(){
     const { data } = await api.get("api/v1/admin/transaction/find-all", {});
     return data;
}

export async function getAllTransactionByCustomer(){
     const { data } = await api.get("api/v1/customer/transaction/find-all", {});
     return data;
}


export async function createTransaction(transaction: Transaction){
     const { data } = await api.post("api/v1/customer/transaction/create", transaction);
     return data;
}

export async function updateTransaction(transaction: Transaction){
     const { data } = await api.put("api/v1/customer/transaction/update", transaction);
     return data;
}

export async function deleteTransaction(id: number){
     const { data } = await api.delete("api/v1/customer/transaction/delete/"+id);
     return data;
}

