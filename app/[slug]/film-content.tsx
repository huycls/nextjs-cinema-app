'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Calendar, Clock, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import type { Movie } from '@/lib/api';
import FilmDetails from './film-details';
import FilmPlaying from './film-playing';

export function FilmContent({ movie }: { movie: Movie }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { episodes, movie: movieDetails } = movie;

  if (!movie) {
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


  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4">
          {isPlaying ? <FilmPlaying episodes={episodes} /> : <FilmDetails movieDetails={movieDetails} setIsPlaying={setIsPlaying} />}
        </div>
      </div>
    </main>
  );
}