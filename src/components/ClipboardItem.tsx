import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ClipboardItemProps {
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
}

const ClipboardItem = ({ id, value, onChange, onRemove, showRemove }: ClipboardItemProps) => {
  const [copiedLine, setCopiedLine] = useState<number | null>(null);

  const handleCopyLine = async (line: string, lineIndex: number) => {
    if (!line.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(line);
      setCopiedLine(lineIndex);
      toast.success("Line copied!");
      setTimeout(() => setCopiedLine(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const lines = value.split('\n').filter((line, index, arr) => {
    // Keep all lines if there's content, or show at least empty state
    return line.trim() !== '' || arr.length === 1;
  });

  // If no lines with content, show empty
  const displayLines = lines.length > 0 && lines.some(l => l.trim()) ? lines : [];

  return (
    <div className="animate-scale-in group relative">
      <div className="flex gap-2 items-start">
        <Textarea
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder="Enter multiple lines... Each line gets its own copy button"
          rows={3}
          className="flex-1 min-h-[80px] resize-y text-base bg-card border-border shadow-soft transition-all duration-200 
                     focus:shadow-medium focus:ring-2 focus:ring-primary/20 
                     placeholder:text-muted-foreground/60"
        />
        
        {showRemove && (
          <Button
            onClick={() => onRemove(id)}
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                       text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Individual lines with copy buttons */}
      {displayLines.length > 0 && (
        <div className="mt-3 space-y-2">
          {displayLines.map((line, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50"
            >
              <span className="flex-1 text-sm font-mono truncate">{line}</span>
              <Button
                onClick={() => handleCopyLine(line, index)}
                variant="copy"
                size="sm"
                className={`shrink-0 h-8 px-3 transition-all duration-200 ${copiedLine === index ? 'animate-pulse-success' : ''}`}
              >
                {copiedLine === index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClipboardItem;
