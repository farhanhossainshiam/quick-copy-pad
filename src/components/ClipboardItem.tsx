import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ClipboardItemProps {
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
}

const ClipboardItem = ({ id, value, onChange, onRemove, showRemove }: ClipboardItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="animate-scale-in group relative flex gap-2 items-center">
      <div className="flex-1 flex gap-2 items-center">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder="Enter text or number to copy..."
          className="flex-1 h-12 text-base bg-card border-border shadow-soft transition-all duration-200 
                     focus:shadow-medium focus:ring-2 focus:ring-primary/20 
                     placeholder:text-muted-foreground/60"
        />
        <Button
          onClick={handleCopy}
          variant="copy"
          size="icon"
          className={`shrink-0 h-12 w-12 transition-all duration-200 ${copied ? 'animate-pulse-success' : ''}`}
        >
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {showRemove && (
        <Button
          onClick={() => onRemove(id)}
          variant="ghost"
          size="icon"
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                     text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ClipboardItem;
