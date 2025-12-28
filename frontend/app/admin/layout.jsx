"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyAdmin } from "@/app/api/admin";
import { FiMenu, FiX } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sideBarItems = [
    // { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Events", link: "/admin/events" },
    { name: "Gallery", link: "/admin/gallery" },
    { name: "Notices", link: "/admin/notices" },
    { name: "Resources", link: "/admin/resources" },
    { name: "Users", link: "/admin/users" },
    { name: "Check-In", link: "/admin/checkin" },
    { name: "Members", link: "/admin/members" },
    { name: "Inquiries", link: "/admin/inquiries" },
  ];

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    verifyAdmin(token)
      .then(() => setChecking(false))
      .catch(() => {
        localStorage.removeItem("admin_token");
        router.push("/login");
      });
  }, [router]);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md focus:outline-none"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-40`}
      >
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
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
