import { useState } from "react";
import { Copy, Check, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Index = () => {
  const [value, setValue] = useState("");
  const [copiedLine, setCopiedLine] = useState<number | null>(null);

  const handleCopyLine = async (line: string, lineIndex: number) => {
    if (!line.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(line);
      setCopiedLine(lineIndex);
      toast.success("কপি হয়েছে!");
      setTimeout(() => setCopiedLine(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const lines = value.split('\n').filter(line => line.trim() !== '');
  const totalLines = lines.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
              <Clipboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QuickCopy</h1>
              <p className="text-xs text-muted-foreground">প্রতিটি লাইন আলাদাভাবে কপি করুন</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalLines}</p>
            <p className="text-xs text-muted-foreground">মোট লাইন</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalLines}</p>
            <p className="text-xs text-muted-foreground">বাকি লাইন</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="এখানে আপনার টেক্সট লিখুন... প্রতিটি লাইন আলাদাভাবে কপি করা যাবে"
            rows={4}
            className="w-full resize-none text-base bg-background border-border 
                       focus:ring-2 focus:ring-primary/30 
                       placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Lines List */}
        {lines.length > 0 && (
          <div className="space-y-2">
            {lines.map((line, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 
                           hover:border-primary/50 transition-colors duration-200"
              >
                <span className="flex-1 text-sm font-mono truncate text-foreground">{line}</span>
                <Button
                  onClick={() => handleCopyLine(line, index)}
                  variant="copy"
                  size="sm"
                  className={`shrink-0 h-9 px-4 gap-2 transition-all duration-200 
                             ${copiedLine === index ? 'animate-pulse-success bg-green-500 hover:bg-green-500' : ''}`}
                >
                  {copiedLine === index ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-xs">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">কপি করুন</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {lines.length === 0 && (
          <div className="text-center py-12">
            <Clipboard className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              উপরে টেক্সট লিখুন, প্রতিটি লাইন এখানে দেখা যাবে
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
