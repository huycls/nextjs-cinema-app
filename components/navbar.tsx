'use client';

import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <a href="/" className="text-red-600 font-bold text-2xl">CONFLIX</a>
            <div className="hidden md:flex space-x-4">
              <a href="#" className="text-sm hover:text-gray-300">Home</a>
              <a href="#" className="text-sm hover:text-gray-300">TV Shows</a>
              <a href="#" className="text-sm hover:text-gray-300">Movies</a>
              <a href="#" className="text-sm hover:text-gray-300">New & Popular</a>
              <a href="#" className="text-sm hover:text-gray-300">My List</a>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-6 w-6" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}