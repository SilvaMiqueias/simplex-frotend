import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Goal } from "@/components/model/goal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { categoryList, getNameCategoryById } from "./model/category";
import { MonthYearPicker } from "./shared/MonthYearPicker";
import { format } from "path";


interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
  onSave: (goal: Goal) => void;
}

export function GoalModal({
  open,
  onOpenChange,
  goal,
  onSave,
}: GoalModalProps) {
  const [formData, setFormData] = useState<Goal>(new Goal());

  useEffect(() => {
    if (!goal) {
      setFormData(new Goal());
      return;
    }

    setFormData({
      ...goal,
      category: getNameCategoryById(Number(goal.category)),
    });
    }, [goal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Editar Meta" : "Nova Meta"}
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
              <Label htmlFor="amount">Meta (R$)</Label>
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
                          <Label htmlFor="date">Data Inicial</Label>
                          <MonthYearPicker
                                  value={
                                      formData.dateStart
                                      ? new Date(formData.dateStart)
                                      : undefined
                                  }
                                  onChange={(date) =>
                                      setFormData({
                                      ...formData,
                                      dateStart: date.toISOString(),
                                      })
                                  }
                                  />
          
                                        
          </div> 
              <div className="grid gap-2">
                          <Label htmlFor="date">Data Final</Label>
                          <MonthYearPicker  
                                  disabled={!formData.dateStart}
                                  minDate={formData.dateStart ? new Date(formData.dateStart) : undefined}
                                  value={
                                      formData.dateEnd
                                      ? new Date(formData.dateEnd)
                                      : undefined
                                  }
                                  onChange={(date) =>
                                      setFormData({
                                      ...formData,
                                      dateEnd: date.toISOString(),
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
