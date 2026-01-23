import { Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Budget, BudgetChart } from "@/components/model/budget";
import { Goal } from "@/components/model/goal";
import { BudgetModal } from "@/components/BudgetModal";
import { GoalModal } from "@/components/GoalModal";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Trash2, Pencil, MoreVertical } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import { useAuth } from "@/context/AuthContext";
import { findAllBudgets, requestCreateBudget, requestUpdateBudget } from "@/services/BudgetService";
import { toast } from "sonner";
import { getDescriptionCategory, getDescriptionCategoryById } from "@/components/model/category";
import { MonthYearPicker } from "@/components/shared/MonthYearPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



const mockBudgets = [
  {
    category: "Alimentação",
    limit: 1000,
    spent: 820,
    percentage: 82,
  },
  {
    category: "Transporte",
    limit: 500,
    spent: 380,
    percentage: 76,
  },
  {
    category: "Lazer",
    limit: 300,
    spent: 150,
    percentage: 50,
  },
  {
    category: "Saúde",
    limit: 400,
    spent: 200,
    percentage: 50,
  },
];

const mockGoals = [
  {
    title: "Fundo de Emergência",
    target: 10000,
    current: 6500,
    percentage: 65,
  },
  {
    title: "Viagem de Férias",
    target: 5000,
    current: 2800,
    percentage: 56,
  },
];

export default function Budgets() {
const [reload, setReload] = useState(0);
const { setLoading } = useLoading();
const { role } = useAuth();
const [dateReference, setDateReference] = useState<string>(new Date().toISOString());


const [budgetModalOpen, setBudgetModalOpen] = useState(false);
const [goalModalOpen, setGoalModalOpen] = useState(false);

const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

const [dataBudget, setDataBudget] = useState<BudgetChart[]>([]);


useEffect(() => {
      if (!role) return;
        getAllBudgets();
  }, [role, reload]);


async function getAllBudgets() {
    if (role === "ROLE_ADMINISTRATOR") {
          setDataBudget([]);
    } else {
          const  result = await findAllBudgets({referenceDate: dateReference.split("T")[0]});
          result.reverse();
          setDataBudget(result);
    }
}  
 
const handleBudgetEdit = (budget: Budget) => {
     setEditingBudget(budget);
     setBudgetModalOpen(true);
};

async function  handleBudgetSave(budget: Budget)  {
  setLoading(true);
  try{
    if(editingBudget){
       await updateBudget(budget);
    }else{
      await createBudget(budget);
    }
    
    setBudgetModalOpen(false);
    setEditingBudget(undefined)
    setReload((prev) => prev + 1)

  }catch(error){
      toast.error('Ocorreu um erro!')
  }finally{
    setLoading(false);
  }
 
} 

async function createBudget(budget: Budget) {
    await requestCreateBudget(budget);
    toast.success("Orçamento criado com sucesso!");
}

async function updateBudget(budget: Budget) {
    await requestUpdateBudget(budget);
    toast.success("Orçamento editado com sucesso!");
}


async function  handleGoalSave(goal: Goal)  {
} 

async function getInfosByMonth(isoDate: string) {
    setReload((prev) => prev + 1)
}

return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orçamentos e Metas</h1>
        <p className="text-muted-foreground">
          Acompanhe seus gastos e objetivos
        </p>
      </div>
      <div className="grid grid-cols-12 gap-4">
          <div className=" md:col-span-6  gap-2">
                    <p>Data de Referência</p>
                    <MonthYearPicker
                            value={
                                dateReference
                                ? new Date(dateReference)
                                : undefined
                            }
                            onChange={(date) =>{
                                const isoDate = date.toISOString();
                                setDateReference(isoDate)
                                getInfosByMonth(isoDate);
                              }
                            }
                      />
            </div>
        </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex gap-2">
        <Button
          onClick={() => setBudgetModalOpen(true)}
          className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
        <Button
          onClick={() => setGoalModalOpen(true)}
          className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>


        <BudgetModal 
         open={budgetModalOpen}
         onOpenChange={(budgetOpen) => {setBudgetModalOpen(budgetOpen)}}
         onSave={handleBudgetSave}
         budget={editingBudget}
        />

        <GoalModal 
         open={goalModalOpen}
         onOpenChange={(goalOpen) => {setGoalModalOpen(goalOpen)}}
         onSave={handleGoalSave}
         goal={editingGoal}
        />
      </div>
    </div>

      {/* Alertas */}
      {/* <Alert
        variant="destructive"
        className="border-destructive/50 bg-destructive/10"
      >
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          Atenção: Você já utilizou 82% do orçamento de Alimentação este mês.
        </AlertDescription>
      </Alert> */}

      {/* Orçamentos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Orçamentos Mensais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {dataBudget.map((budget) => {
            const spent = budget.spentAmount ?? 0;
            const total = budget.amount;

            const progress =
              total > 0
                ? Math.min((spent / total) * 100, 100)
                : 0;

            const isOverLimit = progress >= 80;

          return(
            <Card key={budget.category} className="shadow-soft">
              <CardHeader>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <CardTitle className="text-lg">{getDescriptionCategoryById(budget.category)}</CardTitle>
                  {/*   <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => handleBudgetEdit(budget)} className="rounded-lg">
                                  <Pencil   className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive rounded-lg">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                    </DropdownMenu>  */}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    R$ {spent.toFixed(2)} de R$ {total.toFixed(2)}
                  </span>
                  <span
                    className={
                       isOverLimit
                        ? "text-destructive font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2"
                  indicatorClassName={
                    isOverLimit ? "bg-destructive" : "bg-success"
                  }
                />
              </CardContent>
              {isOverLimit && (
              <div style={{display: "flex", justifyContent: "center"}}>
                      <Alert
                                    variant="destructive"
                                    className="border-destructive/50 bg-destructive/10 "
                                    style={{margin: "20px"}}
                                  >
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    <AlertDescription className="text-destructive">
                                      Atenção: Você já utilizou {progress.toFixed(0)}% do orçamento de {" "} {getDescriptionCategoryById(budget.category)}  este mês.
                                    </AlertDescription>
                                  </Alert>
              </div>
              )}
            
            </Card>
          );
})}
        </div>
      </div>

      {/* Metas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Metas de Economia</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockGoals.map((goal) => (
            <Card key={goal.title} className="shadow-soft">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    R$ {goal.current.toFixed(2)} de R$ {goal.target.toFixed(2)}
                  </span>
                  <span className="text-primary font-medium">
                    {goal.percentage}%
                  </span>
                </div>
                <Progress
                  value={goal.percentage}
                  className="h-2"
                  indicatorClassName="bg-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Faltam R$ {(goal.target - goal.current).toFixed(2)} para
                  atingir sua meta
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
