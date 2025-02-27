'use client';

import { Search, Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { LinkRouter } from './ui/linkRouter';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle search bar outside clicks
      if (isSearchOpen && 
          searchBarRef.current && 
          searchButtonRef.current && 
          !searchBarRef.current.contains(event.target as Node) && 
          !searchButtonRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
      
      // Handle mobile menu outside clicks
      if (isMenuOpen && 
          mobileMenuRef.current && 
          menuButtonRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) && 
          !menuButtonRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isMenuOpen]);

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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Close mobile menu if open
      if (isMenuOpen) {
        closeMenu();
      }
      // Focus the search input after animation completes
      setTimeout(() => {
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    } else {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${
      isScrolled || isMenuOpen || isSearchOpen ? 'bg-background/95 backdrop-blur-sm' : 'bg-transparent'
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
            {/*<Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>*/}
            <Button 
             ref={searchButtonRef}
                variant="ghost" 
                size="icon" 
                className={`transition-all duration-300 ${isSearchOpen ? 'rotate-90 text-primary' : ''}`}
                onClick={toggleSearch}
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
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
       {/* Animated Search Bar */}
       <div 
         ref={searchBarRef}
        className={`fixed w-full mx-auto z-40 transition-all duration-300 ease-in-out ${
          isSearchOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        <div className="container w-full mx-auto backdrop-blur-sm shadow-md bg-background/95  px-4 py-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Input
                id="navbar-search-input"
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-6 text-lg bg-card/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              {searchQuery && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      {/* Mobile menu */}
        <div ref={mobileMenuRef}  className={`md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-30 transform transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <div className=" mx-auto bg-background w-full">
            <div className='container px-4 py-8'>
            <div className="flex flex-col space-y-6">
            <LinkRouter href="/" className="text-sm hover:text-gray-300" onClick={closeMenu}>Home</LinkRouter>
              <LinkRouter href="/danh-sach/tv-shows" className="text-sm hover:text-gray-300" onClick={closeMenu}>TV Shows</LinkRouter>
              <LinkRouter href="/danh-sach/phim-bo" className="text-sm hover:text-gray-300" onClick={closeMenu}>Phim bộ</LinkRouter>
              <LinkRouter href="/danh-sach/phim-le" className="text-sm hover:text-gray-300" onClick={closeMenu}>Phim lẻ</LinkRouter>
              <LinkRouter href="/danh-sach/hoat-hinh" className="text-sm hover:text-gray-300" onClick={closeMenu}>Hoạt hình</LinkRouter>
              <LinkRouter href="/danh-sach/phim-vietsub" className="text-sm hover:text-gray-300" onClick={closeMenu}>Phim vietsub</LinkRouter>
              <LinkRouter href="/danh-sach/phim-thuyet-minh" className="text-sm hover:text-gray-300" onClick={closeMenu}>Phim thuyết minh</LinkRouter>
              <LinkRouter href="/danh-sach/phim-long-tieng" className="text-sm hover:text-gray-300" onClick={closeMenu}>Phim lồng tiếng</LinkRouter>
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
      
    </nav>
  );
}