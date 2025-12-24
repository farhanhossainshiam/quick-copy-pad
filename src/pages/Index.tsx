import { useState, useRef, useEffect } from "react";
import { Copy, Check, Clipboard, Edit3, Plus, X, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const AuthDialog = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("লগইন সফল হয়েছে!");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না!");
      return;
    }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-foreground hover:scale-105 transition-all duration-200 animate-side-glow">
          <User className="h-4 w-4" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground text-center">
            {isLogin ? "লগইন করুন" : "সাইন আপ করুন"}
          </DialogTitle>
        </DialogHeader>
        
        {isLogin ? (
          <form className="space-y-4 mt-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm text-foreground">ইমেইল</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-foreground font-semibold hover:opacity-90">
              লগইন
            </Button>
            <p className="text-center text-sm text-foreground/70">
              অ্যাকাউন্ট নেই?{" "}
              <span 
                className="text-primary cursor-pointer hover:underline"
                onClick={() => setIsLogin(false)}
              >
                সাইন আপ করুন
              </span>
            </p>
          </form>
        ) : (
          <form className="space-y-4 mt-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label className="text-sm text-foreground">নাম</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  type="text" 
                  placeholder="আপনার নাম" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">ইমেইল</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-foreground font-semibold hover:opacity-90">
              সাইন আপ
            </Button>
            <p className="text-center text-sm text-foreground/70">
              অ্যাকাউন্ট আছে?{" "}
              <span 
                className="text-primary cursor-pointer hover:underline"
                onClick={() => setIsLogin(true)}
              >
                লগইন করুন
              </span>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

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
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [popupIsLogin, setPopupIsLogin] = useState(true);
  const [popupName, setPopupName] = useState("");
  const [popupEmail, setPopupEmail] = useState("");
  const [popupPassword, setPopupPassword] = useState("");
  const [popupConfirmPassword, setPopupConfirmPassword] = useState("");

  useEffect(() => {
    // Check if user has seen the login popup before
    const hasSeenPopup = localStorage.getItem("hasSeenLoginPopup");
    if (!hasSeenPopup) {
      setShowLoginPopup(true);
    }
  }, []);

  const handlePopupLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hasSeenLoginPopup", "true");
    setShowLoginPopup(false);
    toast.success("লগইন সফল হয়েছে!");
  };

  const handlePopupSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (popupPassword !== popupConfirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না!");
      return;
    }
    localStorage.setItem("hasSeenLoginPopup", "true");
    setShowLoginPopup(false);
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
  };

  const handleSkipLogin = () => {
    localStorage.setItem("hasSeenLoginPopup", "true");
    setShowLoginPopup(false);
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

  const removeSession = (id: string) => {
    if (sessions.length > 1) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Login Popup Dialog */}
      <Dialog open={showLoginPopup} onOpenChange={setShowLoginPopup}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              {popupIsLogin ? "লগইন করুন" : "সাইন আপ করুন"}
            </DialogTitle>
          </DialogHeader>
          
          {popupIsLogin ? (
            <form className="space-y-4 mt-4" onSubmit={handlePopupLogin}>
              <div className="space-y-2">
                <label className="text-sm text-foreground">ইমেইল</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={popupEmail}
                    onChange={(e) => setPopupEmail(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={popupPassword}
                    onChange={(e) => setPopupPassword(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-foreground font-semibold hover:opacity-90">
                লগইন
              </Button>
              <p className="text-center text-sm text-foreground/70">
                অ্যাকাউন্ট নেই?{" "}
                <span 
                  className="text-primary cursor-pointer hover:underline"
                  onClick={() => setPopupIsLogin(false)}
                >
                  সাইন আপ করুন
                </span>
              </p>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleSkipLogin}
                className="w-full text-foreground/60 hover:text-foreground"
              >
                এড়িয়ে যান
              </Button>
            </form>
          ) : (
            <form className="space-y-4 mt-4" onSubmit={handlePopupSignup}>
              <div className="space-y-2">
                <label className="text-sm text-foreground">নাম</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    type="text" 
                    placeholder="আপনার নাম" 
                    value={popupName}
                    onChange={(e) => setPopupName(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground">ইমেইল</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={popupEmail}
                    onChange={(e) => setPopupEmail(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={popupPassword}
                    onChange={(e) => setPopupPassword(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground">পাসওয়ার্ড নিশ্চিত করুন</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={popupConfirmPassword}
                    onChange={(e) => setPopupConfirmPassword(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-foreground font-semibold hover:opacity-90">
                সাইন আপ
              </Button>
              <p className="text-center text-sm text-foreground/70">
                অ্যাকাউন্ট আছে?{" "}
                <span 
                  className="text-primary cursor-pointer hover:underline"
                  onClick={() => setPopupIsLogin(true)}
                >
                  লগইন করুন
                </span>
              </p>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleSkipLogin}
                className="w-full text-foreground/60 hover:text-foreground"
              >
                এড়িয়ে যান
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
                <Clipboard className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">QuickCopy</h1>
                <p className="text-xs text-foreground">একটি একটি করে কপি করুন</p>
              </div>
            </div>
            
            {/* Banner Ad Section */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="w-full h-12 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg border border-border flex items-center justify-center px-4 overflow-hidden">
                <p className="text-sm text-foreground/80 truncate">
                  📢 আপনার বিজ্ঞাপন এখানে দিন - <span className="text-primary font-medium">যোগাযোগ করুন</span>
                </p>
              </div>
            </div>
            <AuthDialog />
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

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm mt-auto">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 QuickCopy. সর্বস্বত্ব সংরক্ষিত।
            </p>
            
            {/* Footer Banner Ad Section */}
            <div className="flex-1 max-w-md">
              <div className="w-full h-12 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-lg border border-border flex items-center justify-center px-4 overflow-hidden">
                <p className="text-sm text-foreground/80 truncate">
                  📢 আপনার বিজ্ঞাপন এখানে দিন - <span className="text-primary font-medium">যোগাযোগ করুন</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-border flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-border flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/"
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
