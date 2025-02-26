'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getMovies, type Movie, type ApiResponse } from '@/lib/api';

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Science Fiction', 'Thriller'];
const YEARS = Array.from({ length: 25 }, (_, i) => 2024 - i);
const COUNTRIES = ['United States', 'United Kingdom', 'France', 'Japan', 'South Korea', 'India', 'Canada', 'Germany', 'Italy', 'Spain'];

export default function Films() {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [ratingRange, setRatingRange] = useState<number[]>([0, 10]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMovies(page);
      setMovies(data.items);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      setError('Failed to load movies');
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const applyFilters = () => {
    // Reset to first page when applying filters
    setCurrentPage(1);
    fetchMovies(1);
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCountry('');
    setRatingRange([0, 10]);
    setCurrentPage(1);
    fetchMovies(1);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (error) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-red-500">{error}</p>
            <Button onClick={() => fetchMovies(currentPage)} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">All Films</h1>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Rating Range</label>
              <Slider
                value={ratingRange}
                onValueChange={setRatingRange}
                min={0}
                max={10}
                step={0.1}
                className="mt-4"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{ratingRange[0].toFixed(1)}</span>
                <span>{ratingRange[1].toFixed(1)}</span>
              </div>
            </div>
          </div>

          <Button className="mt-6" onClick={applyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-card rounded-lg"></div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-card rounded w-3/4"></div>
                  <div className="h-3 bg-card rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
              <Link
                key={movie._id}
                href={`/${movie.slug}`}
                className="group relative"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden">
                  <img
                    src={movie.thumb_url}
                    alt={movie.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="mr-2">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold truncate">{movie.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{movie.year}</span>
                    <span className="mx-2">•</span>
                    <span>{movie.quality}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 mb-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPaginationNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`dots-${index}`} className="px-3 py-2">...</span>
              ) : (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(Number(pageNum))}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              )
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}