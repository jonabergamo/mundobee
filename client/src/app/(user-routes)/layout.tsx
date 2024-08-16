"use client";
import { ReactNode } from "react";

import withAuth from "../withAuth";
import Aside from "@/components/aside";

interface PrivateLayoutProps {
  children: ReactNode;
}

function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <div className="h-screen w-screen">
      <main className="flex min-h-screen w-full">
        <div className="border-r">
          <Aside />
        </div>
        <div className="flex w-full flex-col">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
export default withAuth(PrivateLayout);
