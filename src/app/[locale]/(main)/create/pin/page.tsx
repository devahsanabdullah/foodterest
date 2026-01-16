"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { categories } from "@/constants/Sidebar";

type Board = {
    _id: string;
    name: string;
    isSecret: boolean;
};

export default function Page() {
    const router = useRouter();
    const { uploadSingle, loading: uploading } = useImageUpload();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [boards, setBoards] = useState<Board[]>([]);
    const [loadingBoards, setLoadingBoards] = useState(true);

    const [form, setForm] = useState({
        description: "",
        category: "",
        board: "",
        tags: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const set = (k: string, v: any) =>
        setForm((p) => ({ ...p, [k]: v }));

    // Load boards
    useEffect(() => {
        const loadBoards = async () => {
            try {
                const res = await fetch("/api/boards");
                const data = await res.json();
                setBoards(data.boards || []);
            } catch {
                setBoards([]);
            } finally {
                setLoadingBoards(false);
            }
        };
        loadBoards();
    }, []);

    // Handle file change + preview
    const onFileChange = (f: File | null) => {
        setFile(f);
        if (!f) {
            setPreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
    };

    const submit = async () => {
        if (!file || !form.description || !form.category || !form.board) {
            setError("Image, description, category and board are required.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const imageUrl = await uploadSingle(file);

            const res = await fetch("/api/pins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: imageUrl,
                    description: form.description,
                    category: form.category,
                    board: form.board,
                    tags: form.tags,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.message || "Failed to create pin");
                return;
            }

            router.push("/"); // or board page
        } catch {
            setError("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const disabled = saving || uploading;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-muted/50">
                <div className="max-w-3xl mx-auto px-8 py-6">
                    <h1 className="text-2xl font-semibold">Create Pin</h1>
                    <p className="text-muted-foreground text-sm">
                        Upload an image and save it to a board.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">

                {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Image</Label>

                    <div className="flex gap-6 items-start">
                        {/* Preview */}
                        <div className="w-48 h-48 rounded-lg border flex items-center justify-center overflow-hidden bg-muted">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 mb-2" />
                                    <span className="text-sm">No image</span>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="flex-1 space-y-2">
                            <Input
                                type="file"
                                accept="image/*"
                                disabled={disabled}
                                onChange={(e) =>
                                    onFileChange(e.target.files?.[0] || null)
                                }
                            />
                            {file && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: {file.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        rows={4}
                        disabled={disabled}
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="What is this pin about?"
                    />
                </div>

                <div className="flex gap-6">
                    {/* Board */}
                    <div className="space-y-2">
                        <Label>Board</Label>
                        <Select
                            disabled={disabled || loadingBoards}
                            value={form.board}
                            onValueChange={(v) => set("board", v)}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        loadingBoards ? "Loading boards..." : "Select board"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {boards.map((b) => (
                                    <SelectItem key={b._id} value={b._id}>
                                        {b.name} {b.isSecret && "(Secret)"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={form.category}
                            onValueChange={(v) => set("category", v)}
                            disabled={disabled || form.board == ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent >
                                {categories.map((category) => (
                                    <SelectItem key={category.slug} value={category.slug}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                        disabled={disabled}
                        value={form.tags}
                        onChange={(e) => set("tags", e.target.value)}
                        placeholder="food, healthy, dinner"
                    />
                </div>

                <Separator />

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button onClick={submit} disabled={disabled}>
                        {(saving || uploading) && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {saving || uploading ? "Saving..." : "Save Pin"}
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={disabled}
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
