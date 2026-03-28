"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { MealForm } from "@/components/MealForm";
import { ResultCard } from "@/components/ResultCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed } from "lucide-react";

export default function CaloriesPage() {
  const { ready } = useAuthGuard();
  const lastResult = useMealStore((s) => s.lastResult);

  if (!ready) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Search form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="h-7 w-7 text-emerald-600" />
              Calorie Lookup
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Powered by USDA FoodData Central
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search food</CardTitle>
              <CardDescription>
                Enter a dish name and the number of servings to get full nutritional data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MealForm />
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Tip: Be specific — e.g. &quot;grilled chicken breast&quot; gives better results than &quot;chicken&quot;.
          </p>
        </div>

        {/* Results */}
        <div>
          {lastResult ? (
            <ResultCard result={lastResult} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center gap-3 text-muted-foreground">
              <UtensilsCrossed className="h-10 w-10 opacity-30" />
              <p className="font-medium">Your results will appear here</p>
              <p className="text-sm opacity-70">Search for a dish to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
