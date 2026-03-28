"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && token) {
      router.replace("/dashboard");
    }
  }, [mounted, token, router]);

  if (!mounted) return null;

  return <AuthForm mode="register" />;
}
