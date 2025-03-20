'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Search as SearchIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LinkRouter } from '@/components/ui/linkRouter';
import { searchMovies, type Movie } from '@/lib/api';
import { useLoading } from '@/components/loading-provider';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { startLoading } = useLoading();
  
  const initialQuery = searchParams.get('keyword') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  // Perform search when query or page changes
  useEffect(() => {
    const performSearch = async () => {
      if (!currentQuery.trim()) {
        setMovies([]);
        setNoResults(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setNoResults(false);
        
        const data = await searchMovies(currentQuery, currentPage);
        
        setMovies(data.data?.items);
        setTotalPages(data.data?.params?.pagination.totalPages);
        
        if (data.data?.items?.length === 0) {
          setNoResults(true);
        }
      } catch (err) {
        setError('Failed to search movies');
        console.error('Error searching movies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [currentQuery, currentPage]);

  // Update URL when search query changes
  useEffect(() => {
    if (currentQuery) {
      // Update URL with search query without triggering navigation
      const params = new URLSearchParams(searchParams.toString());
      const newQuery = params.get('keyword') || '';
      params.set('keyword', currentQuery);
      setSearchQuery(newQuery);
      setCurrentQuery(newQuery);
      // router.replace(`/tim-kiem?${params.toString()}`, { scroll: false });
    }
  }, [ searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== currentQuery.trim()) {
      setCurrentPage(1);
      setCurrentQuery(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentQuery('');
    router.replace('/tim-kiem', { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      startLoading();
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  return (
    <main className="min-h-screen bg-transparent pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Tìm kiếm phim</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-6 text-lg"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              {searchQuery && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <Button type="submit" size="lg" className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isLoading ? <span>Loading...</span> : <span>Tìm kiếm</span>}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="text-center my-12">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <Button onClick={() => handleSearch} className="mt-2">
            Thử lại
            </Button>
          </div>
        )}

        {/* No Results */}
        {noResults && !isLoading && (
          <div className="text-center my-12">
            <h2 className="text-2xl font-semibold mb-2">Không tìm thấy kết quả</h2>
            <p className="text-muted-foreground mb-6">
              Không thể tìm thấy kết quả nào với từ khóa &quot;{currentQuery}&quot;
            </p>
            <Button onClick={clearSearch} variant="outline">
             Xóa
            </Button>
          </div>
        )}

        {/* Search Results */}
        {currentQuery && !noResults && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {isLoading ? 'Searching...' : `Results for "${currentQuery}"`}
            </h2>
            
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
                  <LinkRouter
                    key={movie._id}
                    href={`/chi-tiet/${movie.slug}`}
                    className="group relative"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={`https://phimimg.com/${movie.thumb_url}`}
                        alt={movie.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        width={300}
                        height={400}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" size="icon" className="mr-2">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 p-1">
                      <h3 className="font-semibold truncate">{movie.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{movie.year}</span>
                        {movie.quality && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{movie.quality}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </LinkRouter>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && movies.length > 0 && totalPages > 1 && (
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
        )}

        {/* Initial State - No Search Yet */}
        {!currentQuery && !isLoading && (
          <div className="text-center my-16">
            <SearchIcon className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Tìm kiếm phim</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
            Nhập tiêu đề phim vào ô tìm kiếm ở trên để tìm những bộ phim yêu thích của bạn
            </p>
          </div>
        )}
      </div>
    </main>
  );
}