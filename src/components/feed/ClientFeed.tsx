"use client";
import { useState } from "react";
import PinCard from "@/components/Listing/PinCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";

export default function ClientFeed({ initialData }: any) {
    const [pins, setPins] = useState(initialData.pins || []);
    const [page, setPage] = useState(initialData.page || 1);
    const [hasMore, setHasMore] = useState(initialData.hasMore);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const data = await useFetch(`/api/pins/feed?page=${nextPage}`);
            setPins((prev: any) => [...prev, ...data.pins]);
            setPage(data.page);
            setHasMore(data.hasMore);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pins.map((pin: any) => (
                    <PinCard key={pin._id} {...pin} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center py-10">
                    <Button onClick={loadMore} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </>
    );
}
