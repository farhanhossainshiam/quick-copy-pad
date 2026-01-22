import { useState, useRef, useEffect } from "react";
import { Copy, Check, Clipboard, Edit3, Plus, X, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { db, ClipboardSession as DBClipboardSession } from "@/lib/db";

const TelegramButton = () => {
  return (
    <a
      href="https://t.me/Online_lncam1"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline" className="gap-1.5 sm:gap-2 text-foreground hover:scale-105 transition-all duration-200 animate-border h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm">
        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span className="hidden xs:inline">Telegram</span>
      </Button>
    </a>
  );
};

// Use the ClipboardSession type from db.ts
type ClipboardSession = DBClipboardSession;

const SortableClipboardPanel = ({ 
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { id, value, currentIndex, isEditing } = session;

  const lines = value.split('\n').filter(line => line.trim() !== '');
  const totalLines = lines.length;
  const copiedCount = Math.min(currentIndex, totalLines);
  const remainingCount = Math.max(0, totalLines - currentIndex);
  const currentLine = lines[currentIndex] || "";


  // Prevent scroll chaining when scrolling reaches top or bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Calculate if scrollable
      const hasScroll = scrollHeight > clientHeight;
      if (!hasScroll) return; // Don't interfere if not scrollable
      
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Check current scroll position with small tolerance for rounding
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop >= maxScrollTop - 1;
      
      // Determine scroll direction
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      // If at boundary and trying to scroll further in that direction, prevent it
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Use bubble phase (default) with non-passive to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
    <div 
      ref={setNodeRef} 
      style={style}
      className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 relative touch-manipulation"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-1/2 -translate-x-1/2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-foreground/40 hover:text-foreground/70 touch-manipulation"
      >
        <GripHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      
      {/* Remove Button */}
      {showRemove && (
        <Button
          onClick={() => onRemove(id)}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 text-foreground/60 hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      )}

      {/* Input Area - Only show when editing */}
      {isEditing && (
        <div className="mb-3 sm:mb-4 mt-6 sm:mt-4">
          <label className="text-xs sm:text-sm text-foreground mb-1.5 sm:mb-2 block">
            এখানে আপনার সব লাইন লিখুন:
          </label>
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder="প্রতিটি লাইনে একটি করে নম্বর বা টেক্সট লিখুন..."
            rows={3}
            className="w-full resize-none text-sm sm:text-base bg-background border-border 
                       focus:ring-2 focus:ring-primary/30 
                       placeholder:text-foreground/50 font-mono"
          />
          {totalLines > 0 && (
            <Button 
              onClick={handleStartCopying}
              className="w-full mt-2.5 sm:mt-3 h-9 sm:h-10 gradient-primary hover:opacity-90 font-semibold text-foreground text-sm sm:text-base"
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
          <div className="flex justify-start mb-2 sm:mb-3 mt-5 sm:mt-4">
            <Button 
              onClick={() => onUpdate({ ...session, isEditing: true })} 
              variant="ghost" 
              size="sm"
              className="gap-1.5 sm:gap-2 text-foreground text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              এডিট
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
            <div className="bg-background border border-border rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-primary">{copiedCount}</p>
              <p className="text-[10px] sm:text-xs text-foreground">কপি হয়েছে</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-foreground">{remainingCount}</p>
              <p className="text-[10px] sm:text-xs text-foreground">বাকি আছে</p>
            </div>
          </div>

          {/* Current Line Display */}
          {!isComplete && (
            <div className="bg-background border border-primary/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono mb-2.5 sm:mb-3 break-all">
                {currentLine}
              </p>
              <Button
                onClick={handleCopy}
                size="default"
                className={`h-9 sm:h-10 px-4 sm:px-6 gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 text-black
                           ${copied 
                             ? 'bg-green-500' 
                             : 'bg-[rgb(10,250,198)]'}`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>কপি করুন</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Complete State */}
          {isComplete && (
            <div className="bg-background border border-green-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-center">
              <Check className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-green-500 mb-1.5 sm:mb-2" />
              <p className="text-sm sm:text-base font-semibold text-foreground mb-0.5 sm:mb-1">সব কপি হয়ে গেছে!</p>
              <p className="text-[10px] sm:text-xs text-foreground mb-2 sm:mb-3">মোট {totalLines}টি লাইন</p>
              <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-foreground text-xs sm:text-sm h-8 sm:h-9">
                আবার শুরু করুন
              </Button>
            </div>
          )}

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
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load sessions from IndexedDB on component mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await db.init();
        const savedSessions = await db.getAllSessions();
        
        if (savedSessions.length > 0) {
          setSessions(savedSessions);
          console.log('Loaded sessions from IndexedDB:', savedSessions.length);
        } else {
          // If no sessions exist, create a default one and save it
          const defaultSession = { 
            id: crypto.randomUUID(), 
            value: "", 
            currentIndex: 0, 
            isEditing: true 
          };
          setSessions([defaultSession]);
          await db.saveSession(defaultSession);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Save sessions to IndexedDB whenever they change
  useEffect(() => {
    if (!isLoading && sessions.length > 0) {
      const saveSessions = async () => {
        try {
          await db.saveSessions(sessions);
          console.log('Sessions saved to IndexedDB');
        } catch (error) {
          console.error('Error saving sessions:', error);
        }
      };

      // Debounce the save operation
      const timeoutId = setTimeout(saveSessions, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [sessions, isLoading]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSessions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success("প্যানেল সরানো হয়েছে!");
    }
  };

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

  const removeSession = async (id: string) => {
    if (sessions.length > 1) {
      try {
        // Remove from IndexedDB
        await db.deleteSession(id);
        // Remove from state
        setSessions(sessions.filter(s => s.id !== id));
        toast.success('প্যানেল মুছে ফেলা হয়েছে');
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('মুছতে সমস্যা হয়েছে');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl gradient-primary shadow-glow flex items-center justify-center flex-shrink-0">
                <Clipboard className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-foreground truncate">QuickCopy</h1>
                <p className="text-[10px] sm:text-xs text-foreground truncate">একটি একটি করে কপি করুন</p>
              </div>
            </div>
            
            {/* Banner Ad Section */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <div className="w-full h-12 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg border border-border flex items-center justify-center px-4 overflow-hidden">
                <p className="text-sm text-foreground/80 truncate">
                  📢 আপনার বিজ্ঞাপন এখানে দিন - <a href="https://t.me/Online_lncam1" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">যোগাযোগ করুন</a>
                </p>
              </div>
            </div>
            <TelegramButton />
          </div>
        </div>
      </header>

      {/* Mobile Banner Ad */}
      <div className="lg:hidden px-3 py-2 bg-card/50">
        <div className="w-full h-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg border border-border flex items-center justify-center px-3 overflow-hidden">
          <p className="text-xs text-foreground/80 truncate">
            📢 বিজ্ঞাপন দিন - <a href="https://t.me/Online_lncam1" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">যোগাযোগ</a>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-foreground">লোড হচ্ছে...</p>
            </div>
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sessions.map(s => s.id)} strategy={rectSortingStrategy}>
                <div className={`grid gap-3 sm:gap-4 ${sessions.length === 1 ? 'max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {sessions.map(session => (
                    <SortableClipboardPanel
                      key={session.id}
                      session={session}
                      onUpdate={updateSession}
                      onRemove={removeSession}
                      showRemove={sessions.length > 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add Button */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <Button
                onClick={addSession}
                variant="outline"
                size="default"
                className="gap-2 text-foreground border-dashed border-2 text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-6"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                নতুন প্যানেল যোগ করুন
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm mt-auto">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 text-center sm:text-left sm:flex-row">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2024 QuickCopy. সর্বস্বত্ব সংরক্ষিত।
            </p>
            
            {/* Footer Banner Ad Section */}
            <div className="flex-1 max-w-md">
              <div className="w-full h-12 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-lg border border-border flex items-center justify-center px-4 overflow-hidden">
                <p className="text-sm text-foreground/80 truncate">
                  📢 আপনার বিজ্ঞাপন এখানে দিন - <a href="https://t.me/Online_lncam1" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">যোগাযোগ করুন</a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/Online_lncam1"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-border flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/Online.lncam"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-border flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Online_lncam"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-border flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
