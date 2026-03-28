"use client";

import Link from "next/link";
import { Search, History, UtensilsCrossed } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { MealHistoryTable } from "@/components/MealHistoryTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { ready } = useAuthGuard();
  const user = useAuthStore((s) => s.user);
  const history = useMealStore((s) => s.history);
  const clearHistory = useMealStore((s) => s.clearHistory);

  if (!ready) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-48" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your meals and look up nutritional data.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-emerald-600" />
              Calorie Lookup
            </CardTitle>
            <CardDescription>
              Search for any dish and get detailed macronutrient data powered by USDA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/calories">
              <Button className="w-full">
                <UtensilsCrossed className="h-4 w-4" />
                Start searching
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-emerald-600" />
              Search history
            </CardTitle>
            <CardDescription>
              {history.length > 0
                ? `${history.length} past search${history.length !== 1 ? "es" : ""} stored locally.`
                : "Your past searches will appear here."}
            </CardDescription>
          </CardHeader>
          {history.length > 0 && (
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/20"
              >
                Clear history
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Meal history table */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Recent searches</h2>
        <MealHistoryTable history={history} />
      </div>
    </div>
  );
}
