
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

// Direction types
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// Food position type
type Position = {
  x: number;
  y: number;
};

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  
  // Create a reference for the direction to use in the event listener
  const directionRef = useRef(direction);
  
  // Update reference when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    
    // Make sure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === x && segment.y === y);
    if (isOnSnake) return generateFood();
    
    return { x, y };
  }, [snake]);
  
  // Game reset
  const resetGame = useCallback(() => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setDirection("RIGHT");
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
  }, [generateFood]);
  
  // Handle key presses for game controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (directionRef.current !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (directionRef.current !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (directionRef.current !== "LEFT") setDirection("RIGHT");
          break;
        case " ": // Spacebar
          setIsPaused(prev => !prev);
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver]);
  
  // Game loop
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const gameLoop = setInterval(() => {
      moveSnake();
    }, INITIAL_SPEED);
    
    return () => clearInterval(gameLoop);
  }, [snake, isPaused, isGameOver]);
  
  // Move the snake
  const moveSnake = () => {
    const head = { ...snake[0] };
    
    // Move the head based on current direction
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
    
    // Check for collisions
    if (
      head.x < 0 || 
      head.x >= GRID_SIZE || 
      head.y < 0 || 
      head.y >= GRID_SIZE ||
      snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      return;
    }
    
    const newSnake = [head, ...snake];
    
    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(prev => prev + 10);
    } else {
      newSnake.pop(); // Remove the tail if not eating
    }
    
    setSnake(newSnake);
  };
  
  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 
        ? theme === 'dark' ? "#38bdf8" : "#0284c7" // Head color
        : theme === 'dark' ? "#60a5fa" : "#3b82f6"; // Body color
      ctx.fillRect(
        segment.x * CELL_SIZE, 
        segment.y * CELL_SIZE, 
        CELL_SIZE, 
        CELL_SIZE
      );
      
      // Add inner square for style
      ctx.fillStyle = theme === 'dark' ? "#1e293b" : "#f8fafc";
      ctx.fillRect(
        segment.x * CELL_SIZE + 4, 
        segment.y * CELL_SIZE + 4, 
        CELL_SIZE - 8, 
        CELL_SIZE - 8
      );
    });
    
    // Draw food
    ctx.fillStyle = theme === 'dark' ? "#fb7185" : "#e11d48";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE/2,
      food.y * CELL_SIZE + CELL_SIZE/2,
      CELL_SIZE/2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw grid lines
    ctx.strokeStyle = theme === 'dark' ? "#1e293b" : "#e2e8f0";
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw game over text
    if (isGameOver) {
      ctx.fillStyle = theme === 'dark' ? "#f1f5f9" : "#0f172a";
      ctx.font = "bold 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }
    
  }, [snake, food, isGameOver, theme]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center gap-6">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(prev => !prev)}
            className="flex items-center gap-1"
            disabled={isGameOver}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
            {isPaused ? "Play" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="flex items-center gap-1"
          >
            <RotateCcw size={18} />
            Reset
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-md`}
      />
      
      <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        <p>Use arrow keys to move, spacebar to pause/play</p>
      </div>
    </div>
  );
};

export default SnakeGame;
