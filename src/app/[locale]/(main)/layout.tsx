import { Navbar } from '@/components/navbar/Navbar';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="p-4">{children}</main>
        </div>
    );
}
