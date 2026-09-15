import React from "react";
import Header from "@/features/layout/components/header/header";
import MobileTopBar from "@/features/layout/components/header/mobile-top-bar";
import MobileBottomNav from "@/features/layout/components/header/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MobileTopBar />
      <main className="flex-1 bg-background px-4 py-4 pb-20 md:px-7 md:py-7 md:pb-7">
        <div className="container mx-auto">{children}</div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
