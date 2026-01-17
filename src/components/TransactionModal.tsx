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

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  onSave: (transaction: Transaction) => void;
}

const categories = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Alimentação",
  "Moradia",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros",
];

export function TransactionModal({
  open,
  onOpenChange,
  transaction,
  onSave,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<Transaction>({
    id: "",
    description: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    } else {
      setFormData({
        id: "",
        description: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });
    }
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  aria-pressed={formData.type === "income"}
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={`rounded-xl border p-4 text-left transition-smooth ${
                    formData.type === "income"
                      ? "bg-[#22c55e]/10 border-[#22c55e]"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`h-5 w-5 ${
                        formData.type === "income"
                          ? "text-[#22c55e]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        formData.type === "income" ? "text-[#16a34a]" : ""
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
                  aria-pressed={formData.type === "expense"}
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={`rounded-xl border p-4 text-left transition-smooth ${
                    formData.type === "expense"
                      ? "bg-[#ef4444]/10 border-[#ef4444]"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown
                      className={`h-5 w-5 ${
                        formData.type === "expense"
                          ? "text-[#ef4444]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        formData.type === "expense" ? "text-[#dc2626]" : ""
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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
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
