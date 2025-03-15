
import React from "react";
import { useTheme } from "../context/ThemeContext";
import SnakeGame from "../components/SnakeGame";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Snake = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen w-full flex flex-col items-center px-6 py-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="absolute top-4 left-4">
        <a href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <Home size={18} />
            Home
          </Button>
        </a>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Snake Game</h1>
      
      <div className="w-full max-w-md">
        <SnakeGame />
      </div>
    </div>
  );
};

export default Snake;
