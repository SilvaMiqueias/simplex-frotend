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
import { findAllBudgets, findAllGoals, requestCreateBudget, requestCreateGoal, requestDeleteBudget, requestDeleteGoal, requestUpdateBudget, requestUpdateGoal } from "@/services/BudgetService";
import { toast } from "sonner";
import { getDescriptionCategory, getDescriptionCategoryById, getNameCategoryById } from "@/components/model/category";
import { MonthYearPicker } from "@/components/shared/MonthYearPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";


export default function Budgets() {
const [reload, setReload] = useState(0);
const { setLoading } = useLoading();
const { role } = useAuth();
const [dateReference, setDateReference] = useState<string>(new Date().toISOString());


const [budgetModalOpen, setBudgetModalOpen] = useState(false);
const [goalModalOpen, setGoalModalOpen] = useState(false);

const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [isDeleteGoalOpen, setIsDeleteGoalOpen] = useState(false);
const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);


const [dataBudget, setDataBudget] = useState<BudgetChart[]>([]);
const [dataGoal, setDataGoal] = useState<Goal[]>([]);



useEffect(() => {
      if (!role) return;
        getAllBudgets();
        getAllGoals();
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

async function getAllGoals() {
    if (role === "ROLE_ADMINISTRATOR") {
          setDataGoal([]);
    } else {
          const  result = await findAllGoals({referenceDate: dateReference.split("T")[0]});
          result.reverse();
          setDataGoal(result);
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

const openDeleteDialog = (budget: Budget) => {
    setBudgetToDelete(budget);
    setIsDeleteOpen(true);
};

async function handleDeleteBudget(id: number){
   setLoading(true);
   try{
    await requestDeleteBudget(id);
    toast.success('Orçamento excluído com sucesso!');
    setReload((prev) => prev + 1);
   }catch(erro){
      toast.error('Ocorreu um erro ao excluir a orçamento!');    
   }finally{
    setLoading(false);
   }
};

const confirmDeleteBudget = () => {
    if (budgetToDelete) {
      handleDeleteBudget(Number(budgetToDelete.id));
    }
    setIsDeleteOpen(false);
    setBudgetToDelete(null);
};

function transformToBudget(chart: BudgetChart): Budget{
   let budget = new Budget();
   budget.id = chart.id;
   budget.amount = chart.amount;
   budget.category =  getNameCategoryById(chart.category);
   budget.dateReference = chart.dateReference;
   budget.description = chart.description
   return budget;
}


async function  handleGoalSave(goal: Goal)  {
   setLoading(true);
  try{
    if(editingGoal){
       await updateGoal(goal);
    }else{
      await createGoal(goal);
    }
    
    setGoalModalOpen(false);
    setEditingGoal(undefined)
    setReload((prev) => prev + 1)

  }catch(error){
      toast.error('Ocorreu um erro!')
  }finally{
    setLoading(false);
  }
} 

async function createGoal(goal: Goal) {
    await requestCreateGoal(goal);
    toast.success("Meta criada com sucesso!");
}

async function updateGoal(goal: Goal) {
    await requestUpdateGoal(goal);
    toast.success("Meta editada com sucesso!");
}

const handleGoalEdit = (goal: Goal) => {
     setEditingGoal(goal);
     setGoalModalOpen(true);
};

const openDeleteDialogGoal = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsDeleteGoalOpen(true);
};

const confirmDeleteGoal = () => {
    if (goalToDelete) {
      handleDeleteGoal(Number(goalToDelete.id));
    }
    setIsDeleteGoalOpen(false);
    setGoalToDelete(null);
};

async function handleDeleteGoal(id: number){
   setLoading(true);
   try{
    await requestDeleteGoal(id);
    toast.success('Meta excluída com sucesso!');
   }catch(erro){
      toast.error('Ocorreu um erro ao excluir a meta!');    
   }finally{
    setReload((prev) => prev + 1);
    setLoading(false);
   }
};


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
          <div className="col-span-6 col-start-1 gap-2">
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

      <div className="flex gap-6">
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
                    <DropdownMenu>
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
                                <DropdownMenuItem onClick={() => handleBudgetEdit(transformToBudget(budget))} className="rounded-lg">
                                  <Pencil   className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem  onClick={() => openDeleteDialog(transformToBudget(budget))} className="text-destructive rounded-lg">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                    </DropdownMenu> 
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
         
         
          {dataGoal.map((goal) => {

            const spent = goal.achievedAmount ?? 0;
            const total = goal.amount;

            const progress =
              total > 0
                ? Math.min((spent / total) * 100, 100)
                : 0;

            const isOverLimit = progress >= 95;

            
            return (
            <Card key={goal.category} className="shadow-soft">
              <CardHeader>
                <div  className="flex items-center justify-between  gap-4">
                  <div className="flex items-center justify-between gap-4">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{getDescriptionCategoryById(Number(goal.category))}</CardTitle>
                  </div>
                   <DropdownMenu>
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
                                <DropdownMenuItem onClick={() => handleGoalEdit(goal)}  className="rounded-lg">
                                  <Pencil   className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem  onClick={() => openDeleteDialogGoal(goal)} className="text-destructive rounded-lg">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                    </DropdownMenu> 
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
                        ? "text-success font-medium"
                        : (Number(progress.toFixed(0)) < 95 ? "text-muted-foreground" : "text-amber-600") 
                    }
                  >
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2"
                  indicatorClassName={
                    isOverLimit ? "bg-success" :  (Number(progress.toFixed(0)) < 50 ? "bg-destructive" : "bg-yellow-500")
                  }
                />
              </CardContent>
              {isOverLimit && (
              <div style={{display: "flex", justifyContent: "center"}}>
                      <Alert
                                    variant="default"
                                    className="border-default/50 bg-success/10 "
                                    style={{margin: "20px"}}
                                  >
                                    <AlertCircle className="h-4 w-4 text-success" />

                                      {Number(progress.toFixed(0)) <  100 && (
                                        <AlertDescription className="text-success">                           
                                            <p>Atenção: Você já atingiu {progress.toFixed(0)}% da Meta de {" "} {getDescriptionCategoryById(Number(goal.category))} . </p>
                                        </AlertDescription>
                                    ) }
                                      {Number(progress.toFixed(0)) ===  100 && (
                                          <AlertDescription className="text-success">             
                                              <p>Meta Atingida! 🎉 </p>
                                          </AlertDescription>
                                      ) }
                                  </Alert>
              </div>
              )}
            </Card>
          )})}
        </div>
      </div>

      <DeleteAlertDialog
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    item={budgetToDelete}
                    title="Excluir Orçamento?"
                    description={(budget) =>
                      budget
                        ? `Tem certeza que deseja excluir "${getDescriptionCategory(budget.category)}"? Esta ação não pode ser desfeita.`
                        : "Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita."
                    }
            onConfirm={confirmDeleteBudget}
       />

      <DeleteAlertDialog
          open={isDeleteGoalOpen}
          onOpenChange={setIsDeleteGoalOpen}
          item={goalToDelete}
          title="Excluir Meta?"
          description={(goal) =>
            goal
              ? `Tem certeza que deseja excluir a meta "${getDescriptionCategoryById(Number(goal.category))}"? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
          }
          onConfirm={confirmDeleteGoal}
        />
    </div>
  );
}
