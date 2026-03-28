import type { CalorieResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Beef, Wheat, Droplets, ExternalLink } from "lucide-react";

interface ResultCardProps {
  result: CalorieResponse;
}

function MacroRow({
  label,
  value,
  unit = "g",
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">
        {value.toFixed(1)} {unit}
      </span>
    </div>
  );
}

export function ResultCard({ result }: ResultCardProps) {
  const {
    dish_name,
    servings,
    calories_per_serving,
    total_calories,
    macronutrients_per_serving: mps,
    total_macronutrients: tm,
    source,
    matched_food,
  } = result;

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="capitalize text-xl">{dish_name}</CardTitle>
              <CardDescription className="mt-1">
                {servings} serving{servings !== 1 ? "s" : ""} · Source: {source}
              </CardDescription>
            </div>
            <Badge variant="default" className="shrink-0">
              {total_calories} kcal total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              label="Per serving"
              value={`${calories_per_serving} kcal`}
            />
            <StatTile
              icon={<Beef className="h-5 w-5 text-red-500" />}
              label="Protein"
              value={`${mps.protein.toFixed(1)}g`}
            />
            <StatTile
              icon={<Droplets className="h-5 w-5 text-blue-500" />}
              label="Fat"
              value={`${mps.total_fat.toFixed(1)}g`}
            />
            <StatTile
              icon={<Wheat className="h-5 w-5 text-amber-500" />}
              label="Carbs"
              value={`${mps.carbohydrates.toFixed(1)}g`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed macros */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Per serving */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Per serving</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <MacroRow label="Calories" value={calories_per_serving} unit="kcal" />
            <MacroRow label="Protein" value={mps.protein} />
            <MacroRow label="Total fat" value={mps.total_fat} />
            {mps.saturated_fat !== undefined && (
              <MacroRow label="— Saturated fat" value={mps.saturated_fat} />
            )}
            <MacroRow label="Carbohydrates" value={mps.carbohydrates} />
            {mps.fiber !== undefined && <MacroRow label="— Dietary fiber" value={mps.fiber} />}
            {mps.sugars !== undefined && <MacroRow label="— Sugars" value={mps.sugars} />}
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total ({servings} servings)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <MacroRow label="Calories" value={total_calories} unit="kcal" />
            <MacroRow label="Protein" value={tm.protein} />
            <MacroRow label="Total fat" value={tm.total_fat} />
            {tm.saturated_fat !== undefined && (
              <MacroRow label="— Saturated fat" value={tm.saturated_fat} />
            )}
            <MacroRow label="Carbohydrates" value={tm.carbohydrates} />
            {tm.fiber !== undefined && <MacroRow label="— Dietary fiber" value={tm.fiber} />}
            {tm.sugars !== undefined && <MacroRow label="— Sugars" value={tm.sugars} />}
          </CardContent>
        </Card>
      </div>

      {/* Matched food */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">USDA Match</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="font-medium text-foreground">Food:</span> {matched_food.name}
          </p>
          <p>
            <span className="font-medium text-foreground">Data type:</span> {matched_food.data_type}
          </p>
          <p>
            <span className="font-medium text-foreground">FDC ID:</span>{" "}
            <a
              href={`https://fdc.nal.usda.gov/food-details/${matched_food.fdc_id}/nutrients`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400"
            >
              {matched_food.fdc_id}
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <p>
            <span className="font-medium text-foreground">Published:</span> {matched_food.published_date}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-3 gap-1 text-center">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
