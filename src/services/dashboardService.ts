import { api } from "../services/api";

 
export async function getAllCardCustomer(){
     const { data } = await api.get("api/v1/customer/dashboard/infos-cards", {});
     return data;
 } 

export async function getAllCardAdmin(){
     const { data } = await api.get("api/v1/admin/dashboard/infos-cards", {});
     return data;
 }

 export async function getAllChartCustomer(){
     const { data } = await api.get("api/v1/customer/dashboard/infos-charts", {});
     return data;
 } 

export async function getAllChartAdmin(){
     const { data } = await api.get("api/v1/admin/dashboard/infos-charts", {});
     return data;
 }
 
 