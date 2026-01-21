import { useEffect, useState } from "react";
import { Plus, Search, Filter, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionModal } from "@/components/TransactionModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { createTransaction, deleteTransaction, getAllTransactionByAdmin, getAllTransactionByCustomer, updateTransaction } from "@/services/transactionsService";
import { Transaction } from "@/components/model/transaction";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";
import { Category, categoryList, getAllCategories, getDescriptionCategory } from "@/components/model/category";

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { role } = useAuth();
  const [dataTransaction, setDataTransaction] = useState<Transaction[]>([]);
  const { setLoading } = useLoading();
  const [reload, setReload] = useState(0);
  const [catogories, setCategories] =  useState<Category[]>([]);



  useEffect(() => {
      if (!role) return;
        getAllTransactions();
  }, [role, reload]);
 
  async function getAllTransactions() {
    if (role === "ROLE_ADMINISTRATOR") {
          const  dataAdmin  = await getAllTransactionByAdmin();
          dataAdmin.reverse();
          setDataTransaction(dataAdmin);
    } else {
          const  dataCustomer = await getAllTransactionByCustomer();
          dataCustomer.reverse();
          setDataTransaction(dataCustomer);
    }
  }

  const filteredTransactions = dataTransaction.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.transactionType === filterType;
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  async function  handleSave(transaction: Transaction)  {
    setLoading(true);
    try{
      if (editingTransaction) {
       await update(transaction);
      } else {
       await create(transaction);
      }

      setIsModalOpen(false);
      setEditingTransaction(undefined);
      setReload((prev) => prev + 1);
    }catch(error){
      toast.error('Ocorreu um erro!')
    }finally{
      setLoading(false);
    }
  };

  async function create(transaction: Transaction) {
    await createTransaction(transaction);
    toast.success("Criado com sucesso!");
  }

  async function  update(transaction: Transaction) {
    await updateTransaction(transaction);
    toast.success("Editado com sucesso!");
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  async function handleDelete(id: number){
   setLoading(true);
   try{
    await deleteTransaction(id);
    toast.success('Transação excluída com sucesso!');
    setReload((prev) => prev + 1);
   }catch(erro){
      toast.error('Ocorreu um erro ao excluir a transação!');    
   }finally{
    setLoading(false);
   }
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      handleDelete(Number(transactionToDelete.id));
    }
    setIsDeleteOpen(false);
    setTransactionToDelete(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="INCOME">Receitas</SelectItem>
                <SelectItem value="EXPENSE">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categoryList.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop: tabela */}
          <div className="hidden md:block">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-left">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.dateTransaction).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{getDescriptionCategory(transaction.category)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction?.transactionType === "INCOME"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          transaction?.transactionType === "INCOME" ? "bg-success" : ""
                        }
                      >
                        {transaction?.transactionType === "INCOME" ? "Receita" : "Despesa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      <span className="inline-flex items-baseline justify-start tabular-nums font-mono">
                        <span className="inline-block w-3 text-muted-foreground">
                          {transaction?.transactionType === "INCOME" ? "+" : "-"}
                        </span>
                        {transaction?.amount?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80"
                          onClick={() => handleEdit(transaction)}
                          aria-label="Editar"
                        >
                          <Pencil className="!h-4 !w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-xl bg-secondary text-destructive hover:bg-secondary/80"
                          onClick={() => openDeleteDialog(transaction)}
                          aria-label="Excluir"
                        >
                          <Trash2 className="!h-4 !w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: lista de cartões */}
          <div className="md:hidden space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-xl bg-secondary/50 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.dateTransaction).toLocaleDateString("pt-BR")}
                  </p>
                  <Badge
                    variant={
                      transaction.transactionType === "INCOME" ? "default" : "destructive"
                    }
                    className={
                      transaction.transactionType === "INCOME" ? "bg-success" : ""
                    }
                  >
                    {transaction.transactionType === "INCOME" ? "Receita" : "Despesa"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold tabular-nums">
                    {transaction.transactionType === "INCOME" ? "+" : "-"}
                    {transaction.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80"
                      onClick={() => handleEdit(transaction)}
                      aria-label="Editar"
                    >
                      <Pencil className="!h-4 !w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-xl bg-secondary text-destructive hover:bg-secondary/80"
                      onClick={() => openDeleteDialog(transaction)}
                      aria-label="Excluir"
                    >
                      <Trash2 className="!h-4 !w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TransactionModal
        open={isModalOpen}
        onOpenChange={(isOpen) =>  {setIsModalOpen(isOpen); setEditingTransaction(undefined);} }
        transaction={editingTransaction}
        onSave={handleSave}
      />
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              {transactionToDelete
                ? `Tem certeza que deseja excluir "${transactionToDelete.description}"? Esta ação não pode ser desfeita.`
                : "Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full sm:flex-1">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
