import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react"
import { Transaction } from "@/components/model/transaction";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayMonthYearPicker } from "./shared/DayMonthYearPicker";


interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  onSave: (transaction: Transaction) => void;
}

interface Entity{
  id: number;
  name: string;
  description: string;
}

 const categoryList:  Entity[] = [
  {id: 0, name: 'FOOD', description: 'Alimentação'},
  {id: 1, name: 'HEALTH', description: 'Saúde'},
  {id: 2, name: 'TRANSPORT', description: 'Transporte'},
  {id: 3, name: 'EDUCATION', description: 'Educação'},
  {id: 4, name: 'ENTERTAINMENT', description: 'Entretenimento'},
  {id: 5, name: 'HOUSING', description: 'Habitação'},
  {id: 6, name: 'SALARY', description: 'Salário'},
  {id: 7, name: 'INVESTMENT', description: 'Investimento'},
  {id: 8, name: 'TAXES', description: 'Impostos'},
  {id: 9, name: 'UTILITIES', description: 'Utilidades'},
  {id: 10, name: 'OTHER', description: 'Outros'}
];

 const paymentMethodList:  Entity[] = [
  {id: 0, name: 'CASH', description: 'Dinheiro'},
  {id: 1, name: 'DEBIT_CARD', description: 'Cartão de Débito'},
  {id: 2, name: 'CREDIT_CARD', description: 'Cartão de Crédito'},
  {id: 3, name: 'PIX', description: 'Pix'},
  {id: 4, name: 'BANK_TRANSFER', description: 'Transferência Bancária'},
  {id: 5, name: 'BOLETO', description: 'Boleto'},
  {id: 6, name: 'DIGITAL_WALLET', description: 'Carteira Digital'},
  {id: 7, name: 'OTHER', description: 'Outro'}
];

 const recurrenceType:  Entity[] = [
  {id: 0, name: 'WEEKLY', description: 'Semanal'},
  {id: 1, name: 'MONTHLY', description: 'Mensal'},
  {id: 2, name: 'YEARLY', description: 'Anual'}
];

export function TransactionModal({
  open,
  onOpenChange,
  transaction,
  onSave,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<Transaction>(new Transaction());

  const [openCalendar, setOpenCalendar] = useState(false)

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    } else {
      setFormData(new Transaction());
    }
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); 
  };

  return (
    <Dialog open={open}   onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da transação abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Transação</Label>
              <div className="grid grid-cols-2 gap-3" id="type">
                <button
                  type="button"
                  aria-pressed={formData.transactionType === "INCOME"}
                  onClick={() => setFormData({ ...formData, transactionType: "INCOME" })}
                  className={`rounded-xl border p-4 text-left transition-smooth ${
                    formData.transactionType === "INCOME"
                      ? "bg-[#22c55e]/10 border-[#22c55e]"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`h-5 w-5 ${
                        formData.transactionType === "INCOME"
                          ? "text-[#22c55e]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        formData.transactionType === "INCOME" ? "text-[#16a34a]" : ""
                      }`}
                    >
                      Receita
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dinheiro que entra
                  </p>
                </button>

                <button
                  type="button"
                  aria-pressed={formData.transactionType === "EXPENSE"}
                  onClick={() => setFormData({ ...formData, transactionType: "EXPENSE" })}
                  className={`rounded-xl border p-4 text-left transition-smooth ${
                    formData.transactionType === "EXPENSE"
                      ? "bg-[#ef4444]/10 border-[#ef4444]"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown
                      className={`h-5 w-5 ${
                        formData.transactionType === "EXPENSE"
                          ? "text-[#ef4444]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        formData.transactionType === "EXPENSE" ? "text-[#dc2626]" : ""
                      }`}
                    >
                      Despesa
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dinheiro que sai
                  </p>
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Tipo de Pagamento</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Selecione um tipo de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodList.map((pm) => (
                    <SelectItem key={pm.id} value={pm.name}>
                      {pm.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recurring">Recorrência</Label>
              <RadioGroup
                  value={formData.recurring ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      recurring: value === "true",
                    })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="true" id="recurring-yes" />
                    <Label htmlFor="recurring-yes">Sim</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="false" id="recurring-no" />
                    <Label htmlFor="recurring-no">Não</Label>
                  </div>
              </RadioGroup>
            </div>
             {formData.recurring && (
              <div className="grid gap-2">
                <Label htmlFor="recurrenceType">Tipo de Recorrência</Label>
                <Select
                  value={formData.recurrenceType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, recurrenceType: value })
                  }
                >
                  <SelectTrigger id="recurrenceType">
                    <SelectValue placeholder="Selecione um tipo de recerrência" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurrenceType.map((rp) => (
                      <SelectItem key={rp.id} value={rp.name}>
                        {rp.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
             )}

             <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ex: Salário, Aluguel, Supermercado..."
                required
              />
            </div>
  
    
            <div className="grid flex flex-col gap-2">
                <Label htmlFor="date">Data</Label>
                <DayMonthYearPicker
                        value={
                          formData.dateTransaction
                            ? new Date(formData.dateTransaction)
                            : undefined
                        }
                        onChange={(date) =>
                          setFormData({
                            ...formData,
                            dateTransaction: date.toISOString(),
                          })
                        }
                   />
                              
            </div>

          </div>

          <DialogFooter className="!flex !flex-row w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
