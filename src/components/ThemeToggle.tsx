
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "./ui/toggle";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle 
      variant="outline" 
      size="lg"
      pressed={theme === "dark"}
      onPressedChange={toggleTheme}
      className="fixed top-6 right-6 z-50 rounded-full p-2 w-12 h-12 bg-background border border-border shadow-md hover:shadow-lg transition-all"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-6 w-6 text-yellow-300" />
      ) : (
        <Sun className="h-6 w-6 text-amber-500" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
