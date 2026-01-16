import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_preset";
const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL || `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export function useImageUpload() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadSingle = async (file: File): Promise<string> => {
        setLoading(true);
        setError(null);

        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", UPLOAD_PRESET);

            const res = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: form,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            return data.secure_url;
        } catch (err: any) {
            setError(err.message || "Image upload failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const uploadMultiple = async (files: File[]): Promise<string[]> => {
        setLoading(true);
        setError(null);

        try {
            const uploads = files.map((file) => uploadSingle(file));
            return await Promise.all(uploads);
        } catch (err: any) {
            setError(err.message || "Multiple upload failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadSingle,
        uploadMultiple,
        loading,
        error,
    };
}
