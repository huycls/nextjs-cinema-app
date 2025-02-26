import { Play, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getMovies, type Movie } from '@/lib/api';

async function getInitialData() {
  try {
    const data = await getMovies(1);
    return {
      featured: data.items[0],
      trending: data.items.slice(1, 5),
      newReleases: data.items.slice(5, 9)
    };
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return {
      featured: null,
      trending: [],
      newReleases: []
    };
  }
}

export default async function Home() {
  const { featured, trending, newReleases } = await getInitialData();

  if (!featured) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">Failed to load movies</p>
      </main>
    );
  }

  console.log("featured",featured)

  return (
    <main className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featured.poster_url || featured.thumb_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">{featured.name}</h1>
              <p className="text-lg mb-8"></p>
              <div className="flex gap-4">
                <Link href={`/${featured.slug}`}>
                  <Button size="lg">
                    <Play className="mr-2 h-5 w-5" /> Watch Now
                  </Button>
                </Link>
                <Link href={`/${featured.slug}`}>
                  <Button variant="secondary" size="lg">
                    <Info className="mr-2 h-5 w-5" /> More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Sections */}
      <div className="container bg-transparent mx-auto px-4 -mt-32 relative z-10">
        {[
          { title: "Trending Now", movies: trending },
          { title: "New Releases", movies: newReleases }
        ].map((section) => (
          <div key={section.title} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <Link href="/all-films" className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                Show All
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {section.movies.map((movie: Movie) => (
                <Link
                  key={movie._id}
                  href={`/${movie.slug}`}
                  className="relative aspect-video rounded-md overflow-hidden transition-transform duration-300 ease-in-out group hover:scale-105"
                >
                  <img
                    src={movie.thumb_url}
                    alt={movie.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="icon">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-sm font-semibold text-white truncate">{movie.name}</h3>
                    <p className="text-xs text-gray-300">{movie.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}