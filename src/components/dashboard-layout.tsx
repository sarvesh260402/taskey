'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 px-4 md:px-6 pb-8 transition-all duration-300 md:ml-[var(--sidebar-width,256px)]">
          <div className="max-w-7xl mx-auto pt-6">
            {children}
          </div>
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
      <style jsx global>{`
        :root {
          --sidebar-width: 256px;
        }
        @media (max-width: 768px) {
          :root {
            --sidebar-width: 0px;
          }
        }
      `}</style>
    </div>
  );
}
