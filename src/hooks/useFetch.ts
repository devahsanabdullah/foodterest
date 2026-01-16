export async function useFetch(
    path: string,
    options?: RequestInit
) {
    const base =
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

    const url = path.startsWith("http")
        ? path
        : `${base}${path}`;

    const res = await fetch(url, {
        ...options,
        cache: "no-store",
    });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Server request failed");
    }

    return res.json();
}
