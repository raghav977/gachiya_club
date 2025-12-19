"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyAdmin } from '@/app/api/admin';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const sideBarItems = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Events", link: "/admin/events" },
    { name: "Notices", link: "/admin/notices" },
    { name: "Resources", link: "/admin/resources" },
    { name: "Users", link: "/admin/users" },
    { name: "Inquiries", link: "/admin/inquiries" },
  ];

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    verifyAdmin(token)
      .then(() => setChecking(false))
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/login');
      });
  }, [router]);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">Checking authentication...</div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-5 text-xl font-bold border-b">Admin Panel</div>

        <ul className="p-4 space-y-2">
          {sideBarItems.map((item) => {
            const isActive = router.pathname === item.link;

            return (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className={`block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
