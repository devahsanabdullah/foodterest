import ClientCategoryFeed from "@/components/feed/CategoryFeed";
import { categories } from "@/constants/Sidebar";
import { useFetch } from "@/hooks/useFetch";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;   // ✅ must await

  if (!categories.some(c => c.slug === slug)) {
    return (
      <div className="px-4">
        <h1 className="text-2xl font-semibold mb-6 capitalize">{slug} Pins</h1>
        <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
          No pins found.
        </div>
      </div>
    );
  }

  const data = await useFetch(`/api/pins/category/${slug}?page=1`);

  return (
    <div className="px-4">
      <ClientCategoryFeed initialData={data} category={slug} />
    </div>
  );
}
