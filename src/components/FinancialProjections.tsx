import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calculator, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCardCustomer } from "@/services/dashboardService";
import { useAuth } from "@/context/AuthContext";

interface Projection {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  variant: "success" | "warning" | "info";
}

export function FinancialProjections() {
  const { role } = useAuth();
  const [projections, setProjections] = useState<Projection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role || role === "ROLE_ADMINISTRATOR") {
      setLoading(false);
      return;
    }
    calculateProjections();
  }, [role]);

  async function calculateProjections() {
    try {
      const data = await getAllCardCustomer();
      
      const currentIncome = data?.currentMonth?.income ?? 0;
      const currentExpense = data?.currentMonth?.expense ?? 0;
      const previousIncome = data?.previousMonth?.income ?? 0;
      const previousExpense = data?.previousMonth?.expense ?? 0;
      
      const currentBalance = currentIncome - currentExpense;
      const previousBalance = previousIncome - previousExpense;
      
      // Projeção de economia mensal (média dos últimos 2 meses)
      const avgSavings = (currentBalance + previousBalance) / 2;
      
      // Projeção anual (12 meses)
      const annualProjection = avgSavings * 12;
      
      // Taxa de economia (quanto % da renda é economizada)
      const savingsRate = currentIncome > 0 
        ? ((currentBalance / currentIncome) * 100).toFixed(1)
        : "0";
      
      // Projeção para próximo mês baseada na tendência
      const incomeGrowth = previousIncome > 0 
        ? (currentIncome - previousIncome) / previousIncome 
        : 0;
      const expenseGrowth = previousExpense > 0 
        ? (currentExpense - previousExpense) / previousExpense 
        : 0;
      
      const projectedNextIncome = currentIncome * (1 + incomeGrowth);
      const projectedNextExpense = currentExpense * (1 + expenseGrowth);
      const projectedNextBalance = projectedNextIncome - projectedNextExpense;
      
      const newProjections: Projection[] = [
        {
          title: "Economia Projetada (Anual)",
          value: formatCurrency(annualProjection),
          description: "Baseado na média dos últimos 2 meses",
          icon: Target,
          variant: annualProjection >= 0 ? "success" : "warning",
        },
        {
          title: "Taxa de Economia",
          value: `${savingsRate}%`,
          description: "Percentual da renda economizada este mês",
          icon: Calculator,
          variant: parseFloat(savingsRate) >= 20 ? "success" : parseFloat(savingsRate) >= 10 ? "info" : "warning",
        },
        {
          title: "Saldo Previsto (Próx. Mês)",
          value: formatCurrency(projectedNextBalance),
          description: "Projeção baseada na tendência atual",
          icon: TrendingUp,
          variant: projectedNextBalance >= 0 ? "success" : "warning",
        },
      ];
      
      setProjections(newProjections);
    } catch (error) {
      console.error("Erro ao calcular projeções:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (role === "ROLE_ADMINISTRATOR") {
    return null;
  }

  const variantColors = {
    success: "text-success bg-success/10",
    warning: "text-amber-600 bg-amber-100 dark:bg-amber-900/20",
    info: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Projeções Financeiras
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground py-4">
            Calculando projeções...
          </div>
        ) : projections.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Dados insuficientes para projeções
          </div>
        ) : (
          <div className="space-y-4">
            {projections.map((projection, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className={`p-2 rounded-lg ${variantColors[projection.variant]}`}>
                  <projection.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{projection.title}</p>
                    <p className="font-bold">{projection.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
