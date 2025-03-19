"use client";

import { useState } from "react";
import SnakeGame from "@/components/snake/SnakeGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SnakePage() {
  const [gameKey, setGameKey] = useState(0);

  const resetGame = () => {
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
          <Button onClick={resetGame} variant="outline">
            New Game
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
            Snake Game
          </h1>
          <SnakeGame key={gameKey} />
        </div>
      </div>
    </div>
  );
}
