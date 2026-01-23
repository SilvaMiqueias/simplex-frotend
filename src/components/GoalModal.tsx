import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Goal } from "@/components/model/goal";

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
    setFormData(goal ?? new Goal());
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
            <Label>Título</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Fundo de Emergência"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Valor da meta (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.target}
              onChange={(e) =>
                setFormData({ ...formData, target: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Descrição (opcional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
