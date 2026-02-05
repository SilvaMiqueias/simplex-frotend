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

type DeleteAlertDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  item?: T | null;

  title: string;
  description: (item?: T | null) => string;

  onConfirm: () => void;
};

export function DeleteAlertDialog<T>({
  open,
  onOpenChange,
  item,
  title,
  description,
  onConfirm,
}: DeleteAlertDialogProps<T>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description(item)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="w-full sm:flex-1">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            className="w-full sm:flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
