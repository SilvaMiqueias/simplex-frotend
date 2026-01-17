import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllChartAdmin, getAllChartCustomer } from "@/services/dashboardService";
let dataCharts = [];


export function FinancialChart() {
const { role } = useAuth();
  

useEffect(() => {
      if (!role) return;
        getCharts();
}, [role]);
 
async function getCharts() {
        if (role === "ROLE_ADMIN") {
          const { dataAdmin } = await getAllChartAdmin();
          dataCharts = dataAdmin.map(item => ({
            month: getMesAbreviadoCapitalize(item.months),
            income: item.income,
            expense: item.expense,
          }));


        } else {
          const  dataCustomer = await getAllChartCustomer();
            dataCharts = dataCustomer.map(item => ({
            month: getMesAbreviadoCapitalize(item.months),
            income: item.income,
            expense: item.expense,
          }));
        }
}


function getMesAbreviadoCapitalize(date: Date | string) {
  const mes = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(new Date(date));

  return mes.charAt(0).toUpperCase() + mes.slice(1);
}


  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-left">
        Receitas vs Despesas
      </h3>
      <ChartContainer
        config={{
          receitas: { label: "Receitas", color: "hsl(var(--success))" },
          despesas: { label: "Despesas", color: "hsl(var(--destructive))" },
        }}
        className="w-full max-w-[760px] mx-auto"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={dataCharts}
            barGap={8}
            margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              width={40}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.35 }}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="income"
              name="Receitas"
              fill="var(--color-receitas)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Despesas"
              fill="var(--color-despesas)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

export function TrendChart() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-left">Evolução Mensal</h3>
      <ChartContainer
        config={{
          receitas: { label: "Receitas", color: "hsl(var(--success))" },
          despesas: { label: "Despesas", color: "hsl(var(--destructive))" },
        }}
        className="w-full max-w-[760px] mx-auto"
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={dataCharts}
            margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              width={40}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="income"
              name="Receitas"
              stroke="var(--color-receitas)"
              strokeWidth={2.5}
              dot={{ fill: "var(--color-receitas)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Despesas"
              stroke="var(--color-despesas)"
              strokeWidth={2.5}
              dot={{ fill: "var(--color-despesas)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
