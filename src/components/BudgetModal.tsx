import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Budget } from "@/components/model/budget";
import { categoryList } from "@/components/model/category";
import { MonthYearPicker } from "./shared/MonthYearPicker";
import { Textarea } from "./ui/textarea";


interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
  onSave: (budget: Budget) => void;
}

export function BudgetModal({
  open,
  onOpenChange,
  budget,
  onSave,
}: BudgetModalProps) {
  const [formData, setFormData] = useState<Budget>(new Budget());

  useEffect(() => {
    setFormData(budget ?? new Budget());
  }, [budget, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Editar Orçamento" : "Novo Orçamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
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
                <Label htmlFor="date">Mês</Label>
                <MonthYearPicker
                        value={
                            formData.dateReference
                            ? new Date(formData.dateReference)
                            : undefined
                        }
                        onChange={(date) =>
                            setFormData({
                            ...formData,
                            dateReference: date.toISOString(),
                            })
                        }
                        />

                              
          </div>

          <DialogFooter className="flex gap-2">
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
