"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/constants/Sidebar";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    collaborators: "",
    isSecret: false,
    hasMap: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.category) {
      setError("Board name and category are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Failed to create board.");
        return;
      }

      // router.push("/boards");
      router.refresh()
      toast.success("Board created successfully!");
    } catch {
      toast.error("Something went wrong. Try again.");
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/50">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-semibold">Create Board</h1>
          <p className="text-muted-foreground text-sm">
            Organize your pins into boards.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-10">

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Row label="Board name">
          <Input
            disabled={disabled}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Ramadan Recipes"
          />
        </Row>

        <Row label="Description">
          <Textarea
            disabled={disabled}
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What’s this board about?"
          />
        </Row>

        <Row label="Category">
          <Select
            value={form.category}
            onValueChange={(v) => set("category", v)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row label="Who can pin?">
          <div className="space-y-3">
            <Input
              disabled={disabled}
              value={form.collaborators}
              onChange={(e) => set("collaborators", e.target.value)}
              placeholder="Type a name or email"
            />
            <p className="text-sm text-muted-foreground">
              Only people you follow can collaborate.
            </p>
          </div>
        </Row>

        <Separator />

        <Row label="Secret">
          <div className="flex items-center gap-4">
            <Switch
              disabled={disabled}
              checked={form.isSecret}
              onCheckedChange={(v) => set("isSecret", v)}
            />
            <Label className="text-muted-foreground">
              Make this board private
            </Label>
          </div>
        </Row>

        <Separator />

        <Row label="Add a map?">
          <Switch
            disabled={disabled}
            checked={form.hasMap}
            onCheckedChange={(v) => set("hasMap", v)}
          />
        </Row>

        <Separator />

        {/* Buttons */}
        <div className="flex gap-3 pt-4 cursor-pointer">
          <Button onClick={submit} disabled={disabled} className="hover:cursor-pointer">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save board"}
          </Button>
          <Button variant="secondary" className="hover:cursor-pointer" onClick={() => router.back()} disabled={disabled}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: any) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-8 items-start">
      <Label className="pt-2 font-medium">{label}</Label>
      <div>{children}</div>
    </div>
  );
}
