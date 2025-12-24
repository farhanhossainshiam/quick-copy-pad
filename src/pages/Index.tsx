import { useState } from "react";
import { Copy, Check, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Index = () => {
  const [value, setValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const lines = value.split('\n').filter(line => line.trim() !== '');
  const totalLines = lines.length;
  const copiedCount = Math.min(currentIndex, totalLines);
  const remainingCount = Math.max(0, totalLines - currentIndex);
  const currentLine = lines[currentIndex] || "";

  const handleCopy = async () => {
    if (!currentLine.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(currentLine);
      setCopied(true);
      toast.success("কপি হয়েছে!");
      
      setTimeout(() => {
        setCopied(false);
        setCurrentIndex(prev => prev + 1);
      }, 500);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setCurrentIndex(0); // Reset when input changes
  };

  const isComplete = currentIndex >= totalLines && totalLines > 0;

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
              <p className="text-xs text-muted-foreground">একটি একটি করে কপি করুন</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{copiedCount}</p>
            <p className="text-xs text-muted-foreground">কপি হয়েছে</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{remainingCount}</p>
            <p className="text-xs text-muted-foreground">বাকি আছে</p>
          </div>
        </div>

        {/* Current Line Display */}
        {totalLines > 0 && !isComplete && (
          <div className="bg-card border border-primary/30 rounded-xl p-6 mb-6 text-center">
            <p className="text-3xl font-bold text-foreground font-mono mb-4">
              {currentLine}
            </p>
            <Button
              onClick={handleCopy}
              size="lg"
              className={`h-12 px-8 gap-2 text-base font-semibold transition-all duration-200
                         ${copied 
                           ? 'bg-green-500 hover:bg-green-500' 
                           : 'gradient-primary hover:opacity-90'}`}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>কপি করুন</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* Complete State */}
        {isComplete && (
          <div className="bg-card border border-green-500/30 rounded-xl p-6 mb-6 text-center">
            <Check className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <p className="text-lg font-semibold text-foreground mb-2">সব কপি হয়ে গেছে!</p>
            <p className="text-sm text-muted-foreground mb-4">মোট {totalLines}টি লাইন কপি করা হয়েছে</p>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              আবার শুরু করুন
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-sm text-muted-foreground mb-2 block">
            এখানে আপনার সব লাইন লিখুন:
          </label>
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder="প্রতিটি লাইনে একটি করে নম্বর বা টেক্সট লিখুন..."
            rows={5}
            className="w-full resize-none text-base bg-background border-border 
                       focus:ring-2 focus:ring-primary/30 
                       placeholder:text-muted-foreground/60 font-mono"
          />
        </div>

        {/* Empty State */}
        {totalLines === 0 && (
          <div className="text-center py-8">
            <Clipboard className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              উপরে টেক্সট লিখুন
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
