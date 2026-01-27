import { Bell, AlertTriangle, CheckCircle, Target, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { findAllBudgets } from "@/services/BudgetService";
import { findAllGoals } from "@/services/GoalService";
import { BudgetChart } from "@/components/model/budget";
import { Goal } from "@/components/model/goal";

export interface Notification {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  icon: React.ElementType;
}

export function NotificationCenter() {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role || role === "ROLE_ADMINISTRATOR") {
      setLoading(false);
      return;
    }
    checkNotifications();
  }, [role]);

  async function checkNotifications() {
    try {
      const newNotifications: Notification[] = [];
      const today = new Date();
      const referenceDate = today.toISOString().split("T")[0];

      // Verificar orçamentos
      const budgets = await findAllBudgets({ referenceDate });
      
      budgets.forEach((budget: BudgetChart) => {
        const spent = budget.spentAmount ?? 0;
        const total = budget.amount;
        const progress = total > 0 ? (spent / total) * 100 : 0;

        if (progress >= 100) {
          newNotifications.push({
            id: `budget-exceeded-${budget.category}`,
            type: "warning",
            title: "Orçamento Excedido!",
            message: `Você ultrapassou o limite de ${budget.category}. Gasto: R$ ${spent.toFixed(2)} / Limite: R$ ${total.toFixed(2)}`,
            icon: AlertTriangle,
          });
        } else if (progress >= 80) {
          newNotifications.push({
            id: `budget-warning-${budget.category}`,
            type: "warning",
            title: "Orçamento Próximo do Limite",
            message: `Você já utilizou ${progress.toFixed(0)}% do orçamento de ${budget.category}`,
            icon: TrendingDown,
          });
        }
      });

      // Verificar metas
      try {
        const goals = await findAllGoals();
        
        goals.forEach((goal: Goal) => {
          const current = goal.currentAmount || 0;
          const target = goal.amount || 0;
          const percentage = target > 0 ? (current / target) * 100 : 0;

          if (percentage >= 100) {
            newNotifications.push({
              id: `goal-achieved-${goal.id}`,
              type: "success",
              title: "Meta Atingida! 🎉",
              message: `Parabéns! Você atingiu sua meta: ${goal.description || "Sem descrição"}`,
              icon: CheckCircle,
            });
          } else if (percentage >= 80) {
            newNotifications.push({
              id: `goal-close-${goal.id}`,
              type: "info",
              title: "Quase lá!",
              message: `Você está a ${(100 - percentage).toFixed(0)}% de atingir sua meta: ${goal.description || "Sem descrição"}`,
              icon: Target,
            });
          }
        });
      } catch (error) {
        // Goals may not be available yet
        console.log("Goals not available");
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Erro ao verificar notificações:", error);
    } finally {
      setLoading(false);
    }
  }

  if (role === "ROLE_ADMINISTRATOR" || (notifications.length === 0 && !loading)) {
    return null;
  }

  const typeStyles = {
    warning: "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    success: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    info: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  };

  const iconStyles = {
    warning: "text-amber-600 dark:text-amber-400",
    success: "text-green-600 dark:text-green-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Notificações
          {notifications.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground py-4">
            Verificando alertas...
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${typeStyles[notification.type]}`}
              >
                <notification.icon className={`h-5 w-5 mt-0.5 ${iconStyles[notification.type]}`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.message}
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
