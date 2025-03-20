'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-center text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} Find Unique Tunes. All rights reserved.
          </p>
          
          <nav className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <ul className="flex flex-col space-y-2 text-center sm:flex-row sm:space-x-4 sm:space-y-0">
              <li>
                <Link href="/about" className="text-sm hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-sm hover:text-primary">
                  How to Use
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-sm hover:text-primary">
                  Legal
                </Link>
              </li>
            </ul>
            <Link
              href="https://buymeacoffee.com/vincentpruv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-full bg-[#FFDD00] px-4 py-2 text-black transition-colors hover:bg-[#FFDD00]/90"
            >
              <Coffee className="h-4 w-4" />
              <span className="text-sm font-medium">Buy me a coffee</span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}