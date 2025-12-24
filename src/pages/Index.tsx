import { useState } from "react";
import { Plus, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClipboardItem from "@/components/ClipboardItem";

interface ClipboardEntry {
  id: string;
  value: string;
}

const Index = () => {
  const [items, setItems] = useState<ClipboardEntry[]>([
    { id: crypto.randomUUID(), value: "" }
  ]);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), value: "" }]);
  };

  const updateItem = (id: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, value } : item
    ));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary shadow-soft flex items-center justify-center">
              <Clipboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">QuickCopy</h1>
              <p className="text-sm text-muted-foreground">Copy anything to clipboard instantly</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {/* Clipboard Items */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ClipboardItem
                  id={item.id}
                  value={item.value}
                  onChange={updateItem}
                  onRemove={removeItem}
                  showRemove={items.length > 1}
                />
              </div>
            ))}
          </div>

          {/* Add Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={addItem}
              variant="add"
              size="icon-lg"
              className="animate-scale-in"
              aria-label="Add new clipboard item"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Click the <span className="text-primary font-medium">copy button</span> to save text to your clipboard
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
