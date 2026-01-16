import ClientFeed from "@/components/feed/ClientFeed";
import { useFetch } from "@/hooks/useFetch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Terest",
  description: "Food Terest is designed for food pins.",
};


export default async function Home() {
  const data = await useFetch("/api/pins/feed?page=1");
  console.log(data)
  return (
    <div className="px-4">
      <ClientFeed initialData={data} />
      {
        !data &&
        <div className="min-h-1/2 screen flex items-center justify-center text-muted-foreground">
          No pins found.
        </div>
      }
    </div>
  );
}
