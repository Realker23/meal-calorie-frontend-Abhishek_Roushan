import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { ApiTokenProvider } from "@/components/ApiTokenProvider";

export const metadata: Metadata = {
  title: "Meal Calorie Counter",
  description: "Look up calories and macronutrients for any dish, powered by USDA FoodData Central.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ApiTokenProvider>
            <Header />
            <main>{children}</main>
          </ApiTokenProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
