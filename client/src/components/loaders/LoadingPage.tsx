"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DotsLoader from "./DotsLoader";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.refresh();
    }, 400);
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5 text-primary">
      <DotsLoader />
      <span>Carregando...</span>
    </div>
  );
}
