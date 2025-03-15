
import React from "react";
import { ExternalLink } from "lucide-react";

interface TwitterButtonProps {
  username: string;
}

const TwitterButton: React.FC<TwitterButtonProps> = ({ username }) => {
  return (
    <a
      href={`https://x.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
      style={{ animationDelay: "0.4s", opacity: 0 }}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        className="text-black"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span className="text-sm font-medium text-black/90">
        {username}
      </span>
      <ExternalLink size={14} className="text-black/70 group-hover:text-black/90 transition-colors" />
    </a>
  );
};

export default TwitterButton;
