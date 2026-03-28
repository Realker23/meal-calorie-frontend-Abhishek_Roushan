"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UtensilsCrossed, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/calories", label: "Calorie Lookup" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={mounted && token ? "/dashboard" : "/login"}
          className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400"
        >
          <UtensilsCrossed className="h-6 w-6" />
          <span className="hidden sm:inline">Calorie Counter</span>
        </Link>

        {/* Nav + actions */}
        <div className="flex items-center gap-2">
          {mounted && token && (
            <>
              <nav className="hidden md:flex items-center gap-1 mr-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <span className="hidden sm:block text-sm text-muted-foreground mr-1">
                Hi, {user?.first_name}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
