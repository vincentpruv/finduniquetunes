"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

// Types
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: "RIGHT",
    nextDirection: "RIGHT",
    isGameOver: false,
    isPaused: false,
    score: 0,
  });

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Game settings
  const gridSize = 20;
  const gameSpeed = 100; // ms
  const canvasSize = {
    width: 400,
    height: 400,
  };

  // Colors based on theme
  const colors = {
    background: isDark ? "#1F2937" : "#F1F0FB",
    snake: isDark ? "#8B5CF6" : "#0EA5E9",
    food: "#F97316",
    border: isDark ? "#374151" : "#E5E7EB",
    text: isDark ? "#F9FAFB" : "#111827",
  };

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Generate initial food
    placeFood();

    // Start game loop
    const gameInterval = setInterval(() => {
      if (!gameState.isPaused && !gameState.isGameOver) {
        gameLoop();
      }
    }, gameSpeed);

    return () => clearInterval(gameInterval);
  }, []);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (gameState.direction !== "DOWN") {
            setGameState(prev => ({ ...prev, nextDirection: "UP" }));
          }
          break;
        case "ArrowDown":
          if (gameState.direction !== "UP") {
            setGameState(prev => ({ ...prev, nextDirection: "DOWN" }));
          }
          break;
        case "ArrowLeft":
          if (gameState.direction !== "RIGHT") {
            setGameState(prev => ({ ...prev, nextDirection: "LEFT" }));
          }
          break;
        case "ArrowRight":
          if (gameState.direction !== "LEFT") {
            setGameState(prev => ({ ...prev, nextDirection: "RIGHT" }));
          }
          break;
        case " ": // Space key to pause/resume
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.direction, gameState.isGameOver]);

  // Draw game whenever state changes
  useEffect(() => {
    drawGame();
  }, [gameState, theme]);

  const togglePause = () => {
    if (!gameState.isGameOver) {
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const placeFood = () => {
    const x = Math.floor(Math.random() * (canvasSize.width / gridSize));
    const y = Math.floor(Math.random() * (canvasSize.height / gridSize));
    
    setGameState(prev => ({
      ...prev,
      food: { x, y },
    }));
  };

  const gameLoop = () => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };
      const direction = prev.nextDirection;

      // Update head position based on direction
      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check for collision with walls
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize.width / gridSize ||
        head.y >= canvasSize.height / gridSize
      ) {
        return { ...prev, isGameOver: true };
      }

      // Check for collision with self
      for (let i = 0; i < newSnake.length; i++) {
        if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
          return { ...prev, isGameOver: true };
        }
      }

      // Add new head
      newSnake.unshift(head);

      // Check if food is eaten
      let newScore = prev.score;
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 1;
        placeFood();
      } else {
        // Remove tail if food not eaten
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        direction,
        score: newScore,
      };
    });
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;
      
      ctx.fillStyle = colors.snake;
      
      // For smoother snake, we'll draw rounded rectangles
      const radius = gridSize / 3;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + gridSize, y, x + gridSize, y + gridSize, radius);
      ctx.arcTo(x + gridSize, y + gridSize, x, y + gridSize, radius);
      ctx.arcTo(x, y + gridSize, x, y, radius);
      ctx.arcTo(x, y, x + gridSize, y, radius);
      ctx.closePath();
      ctx.fill();
      
      // Draw eyes for head
      if (index === 0) {
        ctx.fillStyle = "#FFFFFF";
        
        // Position eyes based on direction
        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
        
        switch (gameState.direction) {
          case "RIGHT":
            leftEyeX = x + gridSize - gridSize/4;
            leftEyeY = y + gridSize/3;
            rightEyeX = x + gridSize - gridSize/4;
            rightEyeY = y + gridSize - gridSize/3;
            break;
          case "LEFT":
            leftEyeX = x + gridSize/4;
            leftEyeY = y + gridSize/3;
            rightEyeX = x + gridSize/4;
            rightEyeY = y + gridSize - gridSize/3;
            break;
          case "UP":
            leftEyeX = x + gridSize/3;
            leftEyeY = y + gridSize/4;
            rightEyeX = x + gridSize - gridSize/3;
            rightEyeY = y + gridSize/4;
            break;
          case "DOWN":
            leftEyeX = x + gridSize/3;
            leftEyeY = y + gridSize - gridSize/4;
            rightEyeX = x + gridSize - gridSize/3;
            rightEyeY = y + gridSize - gridSize/4;
            break;
        }
        
        // Draw eyes
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, gridSize/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, gridSize/8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food
    const foodX = gameState.food.x * gridSize;
    const foodY = gameState.food.y * gridSize;
    
    ctx.fillStyle = colors.food;
    ctx.beginPath();
    ctx.arc(
      foodX + gridSize / 2,
      foodY + gridSize / 2,
      gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw game over text
    if (gameState.isGameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = "30px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 15);
      
      ctx.font = "20px Arial";
      ctx.fillText(
        `Score: ${gameState.score}`,
        canvas.width / 2,
        canvas.height / 2 + 20
      );
      
      ctx.font = "16px Arial";
      ctx.fillText(
        "Press New Game to restart",
        canvas.width / 2,
        canvas.height / 2 + 50
      );
    }

    // Draw pause overlay
    if (gameState.isPaused && !gameState.isGameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = "30px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="text-lg font-bold">Score: {gameState.score}</div>
        <Button
          onClick={togglePause}
          variant="outline"
          size="sm"
          disabled={gameState.isGameOver}
          className="flex items-center gap-2"
        >
          {gameState.isPaused ? (
            <>
              <Play size={16} /> Resume
            </>
          ) : (
            <>
              <Pause size={16} /> Pause
            </>
          )}
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="block"
        />
        
        {gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Game Over</h2>
              <p className="text-xl mb-4">Score: {gameState.score}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Use arrow keys to move, space to pause
        </p>
      </div>
    </div>
  );
}
