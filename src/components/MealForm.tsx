"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Search, Timer } from "lucide-react";

import { calorieSchema, type CalorieFormValues } from "@/lib/validations";
import { getCalories, ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MealFormProps {
  onResult?: () => void;
}

export function MealForm({ onResult }: MealFormProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { setLastResult, addToHistory } = useMealStore();

  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalorieFormValues>({
    resolver: zodResolver(calorieSchema),
    defaultValues: { dish_name: "", servings: 1 },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = (seconds: number) => {
    setRetryAfter(seconds);
    timerRef.current = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: CalorieFormValues) => {
    setError(null);
    setRetryAfter(null);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const result = await getCalories(data);
      setLastResult(result);
      addToHistory(result);
      onResult?.();
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle auth errors
        if (err.status === 401 || err.status === 403) {
          logout();
          router.replace("/login");
          return;
        }

        // Rate limit with countdown
        if (err.status === 429 && err.retryAfter) {
          startCountdown(err.retryAfter);
          setError({
            title: "Rate limit reached",
            message: err.message,
          });
          return;
        }

        const titles: Record<number, string> = {
          400: "Invalid input",
          404: "Dish not found",
          422: "No nutrition data",
          500: "Server error",
        };

        setError({
          title: titles[err.status] ?? "Error",
          message: err.message,
        });
      } else {
        setError({
          title: "Network error",
          message: "Unable to reach the server. Check your connection and try again.",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>
            {error.message}
            {retryAfter !== null && (
              <span className="flex items-center gap-1 mt-1 font-medium">
                <Timer className="h-3.5 w-3.5" />
                Retry in {retryAfter}s
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="dish_name">Dish name</Label>
          <Input
            id="dish_name"
            placeholder="e.g. grilled chicken breast"
            aria-invalid={!!errors.dish_name}
            {...register("dish_name")}
          />
          {errors.dish_name && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.dish_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="servings">Number of servings</Label>
          <Input
            id="servings"
            type="number"
            step="0.5"
            min="0.5"
            placeholder="1"
            aria-invalid={!!errors.servings}
            {...register("servings", { valueAsNumber: true })}
          />
          {errors.servings && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.servings.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          disabled={isSubmitting || retryAfter !== null}
        >
          <Search className="h-4 w-4" />
          {isSubmitting ? "Looking up…" : "Look up calories"}
        </Button>
      </form>
    </div>
  );
}
