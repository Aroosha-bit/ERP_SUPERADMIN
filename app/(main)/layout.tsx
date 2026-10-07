"use client";

import { useState } from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/common/header/page";
import Sidebar from "@/components/common/sidebar/page";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F5F6F8]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-[91px] lg:ml-[280px]">{children}</main>
      </div>
    </AuthGuard>
  );
}
