import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
   <ToastProvider>
  {toasts.map(({ id, title, description, action, ...props }) => (
    <Toast
        key={id}
        {...props}
        className="w-full max-w-xl p-6"
      >
        <div className="grid gap-2">
          {title && (
            <ToastTitle className="text-lg font-semibold">
              {title}
            </ToastTitle>
          )}
          {description && (
            <ToastDescription className="text-base">
              {description}
            </ToastDescription>
          )}
        </div>
        {action}
        <ToastClose />
      </Toast>
  ))}

   <ToastViewport
      className="
        fixed
        top-4
        left-1/2
        -translate-x-1/2
        z-50
        flex
        w-full
        max-w-xl
        flex-col
        gap-2
        p-4
      "
    />
  </ToastProvider>
  );
}
