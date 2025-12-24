import { useState, useRef, useEffect } from "react";
import { Copy, Check, Clipboard, Edit3, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ClipboardSession {
  id: string;
  value: string;
  currentIndex: number;
  isEditing: boolean;
}

const ClipboardPanel = ({ 
  session, 
  onUpdate, 
  onRemove, 
  showRemove 
}: { 
  session: ClipboardSession; 
  onUpdate: (session: ClipboardSession) => void; 
  onRemove: (id: string) => void;
  showRemove: boolean;
}) => {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copied, setCopied] = useState(false);

  const { id, value, currentIndex, isEditing } = session;

  const lines = value.split('\n').filter(line => line.trim() !== '');
  const totalLines = lines.length;
  const copiedCount = Math.min(currentIndex, totalLines);
  const remainingCount = Math.max(0, totalLines - currentIndex);
  const currentLine = lines[currentIndex] || "";

  useEffect(() => {
    if (lineRefs.current[currentIndex]) {
      lineRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentIndex]);

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
        onUpdate({ ...session, currentIndex: currentIndex + 1 });
      }, 500);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    onUpdate({ ...session, currentIndex: 0, isEditing: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...session, value: e.target.value, currentIndex: 0 });
  };

  const handleStartCopying = () => {
    if (totalLines > 0) {
      onUpdate({ ...session, isEditing: false });
    }
  };

  const isComplete = currentIndex >= totalLines && totalLines > 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 relative">
      {/* Remove Button */}
      {showRemove && (
        <Button
          onClick={() => onRemove(id)}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 text-foreground/60 hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Input Area - Only show when editing */}
      {isEditing && (
        <div className="mb-4">
          <label className="text-sm text-foreground mb-2 block">
            এখানে আপনার সব লাইন লিখুন:
          </label>
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder="প্রতিটি লাইনে একটি করে নম্বর বা টেক্সট লিখুন..."
            rows={4}
            className="w-full resize-none text-base bg-background border-border 
                       focus:ring-2 focus:ring-primary/30 
                       placeholder:text-foreground/50 font-mono"
          />
          {totalLines > 0 && (
            <Button 
              onClick={handleStartCopying}
              className="w-full mt-3 h-10 gradient-primary hover:opacity-90 font-semibold text-foreground"
            >
              শুরু করুন ({totalLines}টি লাইন)
            </Button>
          )}
        </div>
      )}

      {/* Copy Mode */}
      {!isEditing && (
        <>
          {/* Edit Button */}
          <div className="flex justify-end mb-3">
            <Button 
              onClick={() => onUpdate({ ...session, isEditing: true })} 
              variant="ghost" 
              size="sm"
              className="gap-2 text-foreground"
            >
              <Edit3 className="h-4 w-4" />
              এডিট
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-background border border-border rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-primary">{copiedCount}</p>
              <p className="text-xs text-foreground">কপি হয়েছে</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-foreground">{remainingCount}</p>
              <p className="text-xs text-foreground">বাকি আছে</p>
            </div>
          </div>

          {/* Current Line Display */}
          {!isComplete && (
            <div className="bg-background border border-primary/30 rounded-lg p-4 mb-4 text-center">
              <p className="text-2xl font-bold text-foreground font-mono mb-3">
                {currentLine}
              </p>
              <Button
                onClick={handleCopy}
                size="lg"
                className={`h-10 px-6 gap-2 text-sm font-semibold transition-all duration-200 text-foreground
                           ${copied 
                             ? 'bg-green-500 hover:bg-green-500' 
                             : 'gradient-primary hover:opacity-90'}`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>কপি করুন</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Complete State */}
          {isComplete && (
            <div className="bg-background border border-green-500/30 rounded-lg p-4 mb-4 text-center">
              <Check className="h-10 w-10 mx-auto text-green-500 mb-2" />
              <p className="text-base font-semibold text-foreground mb-1">সব কপি হয়ে গেছে!</p>
              <p className="text-xs text-foreground mb-3">মোট {totalLines}টি লাইন</p>
              <Button onClick={handleReset} variant="outline" size="sm" className="gap-2 text-foreground">
                আবার শুরু করুন
              </Button>
            </div>
          )}

          {/* Lines List */}
          <div className="bg-background border border-border rounded-lg p-3">
            <p className="text-xs text-foreground mb-2">সব লাইন:</p>
            <div className="max-h-[100px] overflow-y-auto space-y-1.5 scrollbar-thin">
              {lines.map((line, index) => (
                <div 
                  key={index}
                  ref={(el) => lineRefs.current[index] = el}
                  className={`flex items-center gap-2 p-2 rounded-md border transition-all duration-300 text-sm
                             ${index < currentIndex 
                               ? 'bg-green-500/10 border-green-500/30 text-foreground/60 line-through' 
                               : index === currentIndex 
                                 ? 'bg-primary/10 border-primary/30 text-foreground animate-scale-in' 
                                 : 'bg-muted/30 border-border/50 text-foreground'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                                  ${index < currentIndex ? 'bg-green-500/20' : index === currentIndex ? 'bg-primary/20' : 'bg-muted'}`}>
                    {index + 1}
                  </span>
                  <span className="flex-1 font-mono truncate">{line}</span>
                  {index < currentIndex && (
                    <Check className="h-3 w-3 text-green-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {isEditing && totalLines === 0 && (
        <div className="text-center py-4">
          <Clipboard className="h-8 w-8 mx-auto text-foreground/40 mb-2" />
          <p className="text-sm text-foreground">
            উপরে টেক্সট লিখুন
          </p>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const [sessions, setSessions] = useState<ClipboardSession[]>([
    { id: crypto.randomUUID(), value: "", currentIndex: 0, isEditing: true }
  ]);

  const addSession = () => {
    setSessions([...sessions, { 
      id: crypto.randomUUID(), 
      value: "", 
      currentIndex: 0, 
      isEditing: true 
    }]);
  };

  const updateSession = (updatedSession: ClipboardSession) => {
    setSessions(sessions.map(s => 
      s.id === updatedSession.id ? updatedSession : s
    ));
  };

  const removeSession = (id: string) => {
    if (sessions.length > 1) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
              <Clipboard className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QuickCopy</h1>
              <p className="text-xs text-foreground">একটি একটি করে কপি করুন</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className={`grid gap-4 ${sessions.length === 1 ? 'max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {sessions.map(session => (
            <ClipboardPanel
              key={session.id}
              session={session}
              onUpdate={updateSession}
              onRemove={removeSession}
              showRemove={sessions.length > 1}
            />
          ))}
        </div>

        {/* Add Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={addSession}
            variant="outline"
            size="lg"
            className="gap-2 text-foreground border-dashed border-2"
          >
            <Plus className="h-5 w-5" />
            নতুন প্যানেল যোগ করুন
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
