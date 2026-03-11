"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/videos");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-zinc-600 text-sm">redirecting...</div>
    </div>
  );
}
