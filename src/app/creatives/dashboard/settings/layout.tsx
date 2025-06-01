'use client';
import  Sidebar  from '@/components/shared/dashboard/settings/sidebar';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
 
  return (
    <main className="flex min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
      <Sidebar />
      <div  className="flex-1 bg-white rounded-r-xl shadow p-6 mb-24 ">{children}</div>
    </main>
  );
}
