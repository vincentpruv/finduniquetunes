
import React from "react";
import { useTheme } from "../context/ThemeContext";

const Logo = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-32 h-32 mx-auto mb-10 animate-float animate-fade-in" style={{ opacity: 0 }}>
      <img 
        src="/logo.svg" 
        alt="Logo" 
        className={`w-full h-full object-contain ${theme === 'dark' ? 'filter brightness-110' : ''}`}
        onError={(e) => {
          // Fallback if logo.svg doesn't exist yet
          const target = e.target as HTMLImageElement;
          target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'%3E%3Ccircle cx='56' cy='56' r='50' fill='${theme === 'dark' ? '%23333' : '%23f6f6f6'}' stroke='${theme === 'dark' ? '%23555' : '%23e0e0e0'}' stroke-width='2'/%3E%3Ctext x='56' y='60' font-family='sans-serif' font-size='12' text-anchor='middle' fill='${theme === 'dark' ? '%23eee' : '%23333'}'%3ELOGO%3C/text%3E%3C/svg%3E`;
        }}
      />
    </div>
  );
};

export default Logo;
