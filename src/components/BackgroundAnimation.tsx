
import React from "react";
import { useTheme } from "../context/ThemeContext";

const BackgroundAnimation = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className={`absolute -top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 rounded-full ${theme === 'dark' ? 'bg-gold/20' : 'bg-gold/30'} animate-blur-shift animate-pulse-subtle`}
        style={{ willChange: "filter, transform" }}
      />
      <div 
        className={`absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full ${theme === 'dark' ? 'bg-blue-400/10' : 'bg-blue-200/20'} animate-blur-shift animate-float`}
        style={{ 
          animationDelay: "-5s",
          willChange: "filter, transform" 
        }}
      />
      <div 
        className={`absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full ${theme === 'dark' ? 'bg-pink-300/10' : 'bg-pink-100/20'} animate-blur-shift`} 
        style={{ 
          animationDelay: "-10s",
          willChange: "filter, transform"
        }}
      />
      <div 
        className={`absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full ${theme === 'dark' ? 'bg-purple-300/10' : 'bg-purple-100/20'} animate-blur-shift animate-float`} 
        style={{ 
          animationDelay: "-15s",
          willChange: "filter, transform"
        }}
      />
      <div 
        className={`absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full ${theme === 'dark' ? 'bg-teal-300/10' : 'bg-teal-100/20'} animate-blur-shift`} 
        style={{ 
          animationDelay: "-20s",
          willChange: "filter, transform"
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
