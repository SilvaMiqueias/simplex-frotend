import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
        toastOptions={{
        classNames: {
          toast:
            "group toast w-full max-w-xl p-6 text-base " +
            "group-[.toaster]:bg-background " +
            "group-[.toaster]:text-foreground " +
            "group-[.toaster]:border-border " +
            "group-[.toaster]:shadow-lg",
          description: "text-base text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground",
          cancelButton:
            "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
