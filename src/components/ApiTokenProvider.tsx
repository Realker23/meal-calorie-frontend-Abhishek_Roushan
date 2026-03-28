"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { registerTokenAccessor } from "@/lib/api";

export function ApiTokenProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    registerTokenAccessor(() => useAuthStore.getState().token);
  }, []);

  // Re-register whenever token changes so apiFetch always gets the latest
  useEffect(() => {
    registerTokenAccessor(() => token);
  }, [token]);

  return <>{children}</>;
}
