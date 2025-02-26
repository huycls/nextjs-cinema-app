import Link from 'next/link';
import { FilmContent } from './film-content';
import { getMovie, getMovies } from '@/lib/api';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  try {
    // Fetch first page of movies to generate static pages
    const data = await getMovies(1);
    // Filter out any invalid slugs
    return data.items
      .filter(movie => movie && movie.movie.slug && typeof movie.movie.slug === 'string')
      .map(movie => ({
        slug: movie.movie.slug,
      }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    // Return at least one valid path to prevent build errors
    return [{ slug: 'placeholder' }];
  }
}

export default async function FilmPage({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Invalid movie URL</h1>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </main>
    );
  }



  try {
    const movie = await getMovie(params.slug);
    
    if (!movie) {
      throw new Error('Movie not found');
    }
  

    return <>
     {<FilmContent movie={movie} /> }
    </>;
  } catch (error) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Movie not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </main>
    );
  }
}