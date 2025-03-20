'use client';

import { ArrowLeft } from 'lucide-react';
import type { Movie } from '@/lib/api';
import FilmPlaying from './film-playing';
import { LinkRouter } from '@/components/ui/linkRouter';
import { useEffect, useState } from 'react';

export function FilmContent({ movie }: { movie: Movie }) {
  const [urlBack, setUrlBack] = useState<string>('');

  useEffect(() => {
    const path = window.location.href.split('/').slice(-1).join('/');
    setUrlBack(path);
  }, []);

  if (!movie) {
    return (
      <main className="min-h-screen bg-transparent py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Movie not found</h1>
          {urlBack && (<LinkRouter href={`/chi-tiet/${urlBack}`} className="text-primary hover:underline">
            Return
          </LinkRouter>)}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent py-16">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
      {urlBack && (<LinkRouter href={`/chi-tiet/${urlBack}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
           Quay lại
        </LinkRouter>)}
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4">
        <FilmPlaying episodes={[movie]} />
        </div>
      </div>
    </main>
  );
}