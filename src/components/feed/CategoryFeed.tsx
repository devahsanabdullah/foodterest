"use client";
import { useState } from "react";
import PinCard from "@/components/Listing/PinCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ClientCategoryFeed({
  initialData,
  category,
}: {
  initialData: any;
  category: string;
}) {
  const [pins, setPins] = useState(initialData.pins || []);
  const [page, setPage] = useState(initialData.page || 1);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(`/api/pins/category/${category}?page=${nextPage}`);
      const data = await res.json();

      setPins((prev: any) => [...prev, ...data.pins]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-10 rounded-lg shadow bg-gradient-to-r from-primary/90 to-primary/60 text-primary-foreground px-8 py-4">
        <h1 className="text-2xl font-bold capitalize tracking-tight">
          {category.replace("-", " ")}
        </h1>
        <p className="mt-2 text-primary-foreground/80">
          Explore beautiful pins in this category
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {pins.map((pin: any) => (
          <PinCard key={pin._id} {...pin} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-12">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="px-8 rounded-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      {/* End */}
      {!hasMore && (
        <p className="text-center text-muted-foreground py-12">
          You’ve reached the end of this category.
        </p>
      )}
    </>
  );
}
