import { useEffect, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { getAllTransactionByAdmin, getAllTransactionByCustomer } from "@/services/transactionsService";
import { Transaction } from "./model/transaction";
import { getDescriptionCategory } from "./model/category";



export function TransactionList() {
  const [dataTransaction, setDataTransaction] = useState<Transaction[]>([]);
  const {role} = useAuth();

  useEffect(() => {
    if(!role) return;
   getAllTransactions();
  }, [role])

  async function getAllTransactions() {
      if (role === "ROLE_ADMINISTRATOR") {
            const  dataAdmin  = await getAllTransactionByAdmin();
            dataAdmin.reverse();
            setDataTransaction(dataAdmin.slice(0,4));
      } else {
            const  dataCustomer = await getAllTransactionByCustomer();
            dataCustomer.reverse();
            setDataTransaction(dataCustomer.slice(0,4));
      }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
      <div className="space-y-2">
        {dataTransaction.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{transaction.description}</p>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {new Date(transaction.dateTransaction).toLocaleDateString("pt-BR")} •{" "}
                {getDescriptionCategory(transaction.category)}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`font-semibold whitespace-nowrap text-right ${
                  transaction.transactionType === "INCOME"
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              {/* <DropdownMenu>
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
                  <DropdownMenuItem className="rounded-lg">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive rounded-lg">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
