import type { MealHistoryEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/dateUtils";

interface MealHistoryTableProps {
  history: MealHistoryEntry[];
}

export function MealHistoryTable({ history }: MealHistoryTableProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No searches yet. Go to{" "}
        <a href="/calories" className="text-emerald-600 hover:underline dark:text-emerald-400">
          Calorie Lookup
        </a>{" "}
        to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Dish</th>
            <th className="px-4 py-3 text-right font-medium">Servings</th>
            <th className="px-4 py-3 text-right font-medium">Cal / serving</th>
            <th className="px-4 py-3 text-right font-medium">Total cal</th>
            <th className="px-4 py-3 text-right font-medium hidden md:table-cell">When</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, i) => (
            <tr
              key={i}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 capitalize font-medium">{entry.dish_name}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{entry.servings}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">
                {entry.calories_per_serving} kcal
              </td>
              <td className="px-4 py-3 text-right">
                <Badge variant="default">{entry.total_calories} kcal</Badge>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                {formatDistanceToNow(entry.searched_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
