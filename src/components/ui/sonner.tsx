import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          loading: "group-[.toaster]:text-green-500",
        },
      }}
      {...props}
    />
  );
};

const toast = {
  ...sonnerToast,
  success: (message: string) => {
    const id = sonnerToast.loading(message, {
      className: "border-green-500/30 bg-green-500/10",
    });
    setTimeout(() => {
      sonnerToast.success(message, { id });
    }, 2000);
    return id;
  },
};

export { Toaster, toast };
