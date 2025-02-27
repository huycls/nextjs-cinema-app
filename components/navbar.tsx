'use client';

import { Search, Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { LinkRouter } from './ui/linkRouter';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${
      isScrolled || isMenuOpen ? 'bg-background/95 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <LinkRouter href="/" className="text-red-600 font-bold text-2xl">CONFLIX</LinkRouter>
            <div className="hidden md:flex space-x-4">
            <LinkRouter href="/" className="text-sm hover:text-gray-300">Home</LinkRouter>
              <LinkRouter href="/danh-sach/tv-shows" className="text-sm hover:text-gray-300">TV Shows</LinkRouter>
              <LinkRouter href="/danh-sach/phim-bo" className="text-sm hover:text-gray-300">Phim bộ</LinkRouter>
              <LinkRouter href="/danh-sach/phim-le" className="text-sm hover:text-gray-300">Phim lẻ</LinkRouter>
              <LinkRouter href="/danh-sach/hoat-hinh" className="text-sm hover:text-gray-300">Hoạt hình</LinkRouter>
              <LinkRouter href="/danh-sach/phim-vietsub" className="text-sm hover:text-gray-300">Phim vietsub</LinkRouter>
              <LinkRouter href="/danh-sach/phim-thuyet-minh" className="text-sm hover:text-gray-300">Phim thuyết minh</LinkRouter>
              <LinkRouter href="/danh-sach/phim-long-tieng" className="text-sm hover:text-gray-300">Phim lồng tiếng</LinkRouter>

            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-6 w-6" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-40 animate-in fade-in duration-300">
          <div className=" mx-auto bg-background w-full">
            <div className='container px-4 py-8'>
            <div className="flex flex-col space-y-6">
            <LinkRouter href="/" className="text-sm hover:text-gray-300">Home</LinkRouter>
              <LinkRouter href="/danh-sach/tv-shows" className="text-sm hover:text-gray-300">TV Shows</LinkRouter>
              <LinkRouter href="/danh-sach/phim-bo" className="text-sm hover:text-gray-300">Phim bộ</LinkRouter>
              <LinkRouter href="/danh-sach/phim-le" className="text-sm hover:text-gray-300">Phim lẻ</LinkRouter>
              <LinkRouter href="/danh-sach/hoat-hinh" className="text-sm hover:text-gray-300">Hoạt hình</LinkRouter>
              <LinkRouter href="/danh-sach/phim-vietsub" className="text-sm hover:text-gray-300">Phim vietsub</LinkRouter>
              <LinkRouter href="/danh-sach/phim-thuyet-minh" className="text-sm hover:text-gray-300">Phim thuyết minh</LinkRouter>
              <LinkRouter href="/danh-sach/phim-long-tieng" className="text-sm hover:text-gray-300">Phim lồng tiếng</LinkRouter>
              <div className="pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-4 py-4">
                  <User className="h-6 w-6" />
                  <span className="text-lg font-medium">Account</span>
                </div>
                <div className="flex items-center space-x-4 py-4">
                  <Search className="h-6 w-6" />
                  <span className="text-lg font-medium">Search</span>
                </div>
                <div className="flex items-center space-x-4 py-4">
                  <Bell className="h-6 w-6" />
                  <span className="text-lg font-medium">Notifications</span>
                </div>
              </div>
            </div>
          </div>
            </div>
        </div>
      )}
    </nav>
  );
}