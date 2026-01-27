import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { TransactionList } from "@/components/TransactionList";
import { FinancialChart, TrendChart } from "@/components/FinancialChart";
import { CurrencyRates } from "@/components/CurrencyRates";
import { FinancialProjections } from "@/components/FinancialProjections";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllCardAdmin, getAllCardCustomer } from "@/services/dashboardService";

export default function Dashboard() {

  const { role } = useAuth();
  const [dataCards, setDataCards] = useState<any | null>(null);
  let percentExpense: boolean = false ;
  let percentIncome:  boolean = false ;
  let percentTotal: boolean = false;

       
   useEffect(() => {
     if (!role) return;
       getCards();
   }, [role]);

   async function getCards() {
       if (role === "ROLE_ADMINISTRATOR") {
         const  dataAdmin  = await getAllCardAdmin();
         setDataCards(dataAdmin);
       } else {
         const  dataCustomer = await getAllCardCustomer();
         setDataCards(dataCustomer);
       }
     }
 

   function formattedToReal(value: number){
      const balanceFormatted = value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return balanceFormatted;
   }

   
   function calculateBalance(month: any) {
      const income = month?.income ?? 0;
      const expense = month?.expense ?? 0;
      return  income - expense;
    } 

   function compareMonths(current: number, previous: number) {
      if (previous === 0) {
        return current === 0 ? 0 : 100;
      }

      return ((current - previous) / Math.abs(previous)) * 100;
    }

    function compareIncome(current: number, previous: number){
       const result = compareMonths(current, previous)
       if(result >= 0 ){
        percentIncome = true;
       }
       return String(Math.abs(result).toFixed(2));
    }

    function compareExpense(current: number, previous: number){
       const result = compareMonths(current, previous)
       if(result >= 0 ){
        percentExpense = true;
       }
       return String(Math.abs(result).toFixed(2));
    }

    function compareTotal(){
      const currentMonth = calculateBalance(dataCards?.currentMonth)
      const previousMonth = calculateBalance(dataCards?.previousMonth)

      const result = compareMonths(currentMonth, previousMonth)
      percentTotal = result >= 0;
      return `${Math.abs(result).toFixed(2)}`;
    }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard
          title="Receitas"
          value={formattedToReal(dataCards?.currentMonth?.income ?? 0)}
          icon={TrendingUp}
          variant="success"
          trend={{ value: compareIncome(dataCards?.currentMonth?.income ?? 0, dataCards?.previousMonth?.income ?? 0) + '%', positive: percentIncome }}
        />
        <DashboardCard
          title="Despesas"
          value={formattedToReal(dataCards?.currentMonth?.expense ?? 0)}
          icon={TrendingDown}
          variant="destructive"
          trend={{ value: compareExpense(dataCards?.currentMonth?.expense ?? 0, dataCards?.previousMonth?.expense ?? 0) + '%', positive: percentExpense }}
        />
        <DashboardCard
          title="Saldo"
          value={formattedToReal(calculateBalance(dataCards?.currentMonth))}          
          icon={Wallet}
          variant="default"
          trend={{ value: String(compareTotal() + '%'), positive: percentTotal }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="apple-card p-6">
          <FinancialChart />
        </div>
        <div className="apple-card p-6">
          <TrendChart />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 apple-card p-6">
          <TransactionList />
        </div>
        <div className="space-y-6">
          <div className="apple-card p-6">
            <CurrencyRates />
          </div>
          <FinancialProjections />
        </div>
      </div>
    </div>
  );
}
