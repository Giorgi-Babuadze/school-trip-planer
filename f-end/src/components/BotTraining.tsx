import { useState, useEffect } from "react";
import { Plus, Trash2, Bot, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TrainingEntry {
  _id?: string;
  category: string;
  title: string;
  content: string;
}

const BotTraining = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState({ category: "", title: "", content: "" });

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/bot-training", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setEntries(data.data);
    } catch {
      toast({ title: "Error", description: "Failed to load training data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newEntry.category.trim() || !newEntry.title.trim() || !newEntry.content.trim()) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/bot-training", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newEntry),
      });
      const data = await res.json();
      if (data.success) {
        setEntries((prev) => [...prev, data.data]);
        setNewEntry({ category: "", title: "", content: "" });
        toast({ title: "Saved", description: "Training entry added" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/bot-training/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEntries((prev) => prev.filter((e) => e._id !== id));
      toast({ title: "Deleted", description: "Entry removed" });
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Train the Chatbot</h3>
          <p className="text-sm text-muted-foreground">Add knowledge entries the bot will use when answering users</p>
        </div>
      </div>

      {/* Add new entry */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Add New Entry</p>
        <Input
          placeholder="Category (e.g. Pricing, Policy, Destinations)"
          value={newEntry.category}
          onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
        />
        <Input
          placeholder="Title (e.g. Cancellation Policy)"
          value={newEntry.title}
          onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
        />
        <textarea
          placeholder="Content (e.g. Students can cancel up to 48 hours before the trip for a full refund...)"
          value={newEntry.content}
          onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
          rows={3}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 8,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            fontSize: 14, outline: "none", resize: "vertical",
            fontFamily: "inherit",
          }}
        />
        <Button onClick={handleAdd} disabled={saving} className="gap-2">
          <Plus className="w-4 h-4" />
          {saving ? "Saving..." : "Add Entry"}
        </Button>
      </div>

      {/* Existing entries */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Training Entries ({entries.length})</p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries yet. Add your first one above.</p>
        ) : (
          entries.map((entry, i) => (
            <div key={entry._id || i} className="rounded-xl border border-border bg-background overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex items-center gap-2 flex-1 pr-4 min-w-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                    {entry.category}
                  </span>
                  <p className="text-sm font-medium text-foreground truncate">{entry.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); if (entry._id) handleDelete(entry._id); }}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {expanded === i
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
              </div>
              {expanded === i && (
                <div className="px-3 pb-3 border-t border-border pt-2">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BotTraining;