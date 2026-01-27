import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Goal } from "@/components/model/goal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryList } from "@/components/model/category";

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
  onSave: (goal: Goal) => void;
}

const emptyGoal: Goal = {
  category: "",
  amount: 0,
  description: "",
};

export function GoalModal({
  open,
  onOpenChange,
  goal,
  onSave,
}: GoalModalProps) {
  const [formData, setFormData] = useState<Goal>(emptyGoal);

  useEffect(() => {
    setFormData(goal ?? { ...emptyGoal });
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
              required
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
            <Label>Valor da meta (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data Início (opcional)</Label>
              <Input
                type="date"
                value={formData.dateStart ? formData.dateStart.split("T")[0] : ""}
                onChange={(e) =>
                  setFormData({ ...formData, dateStart: e.target.value ? new Date(e.target.value).toISOString() : undefined })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Data Fim (opcional)</Label>
              <Input
                type="date"
                value={formData.dateEnd ? formData.dateEnd.split("T")[0] : ""}
                onChange={(e) =>
                  setFormData({ ...formData, dateEnd: e.target.value ? new Date(e.target.value).toISOString() : undefined })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Descrição (opcional)</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ex: Fundo de Emergência, Viagem de Férias..."
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
