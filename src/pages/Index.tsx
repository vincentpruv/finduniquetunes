
import React from "react";
import BackgroundAnimation from "../components/BackgroundAnimation";
import TwitterButton from "../components/TwitterButton";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen w-full flex flex-col justify-center items-center px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <BackgroundAnimation />
      <ThemeToggle />

      <Analytics />
      
      <div className="relative z-10 max-w-md w-full mx-auto text-center">
        <Logo />
        
        <h1 className="animate-fade-in" style={{ opacity: 0, animationDelay: "0.2s" }}>
          <span className="font-inter font-medium text-4xl md:text-5xl lg:text-6xl block mb-3">
            Be informed
          </span>
          <span className={`font-instrument italic text-4xl md:text-5xl lg:text-6xl ${theme === 'dark' ? 'text-gold' : 'text-gold'}`}>
            when we launch
          </span>
        </h1>
        
        <div className="mt-16 flex justify-center">
          <TwitterButton username="vincentpruv" />
        </div>
      </div>
    </div>
  );
};

export default Index;
