import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Calendar, Clock, Globe, Star } from 'lucide-react';

export default function FilmDetails({ movieDetails, setIsPlaying }: { 
  movieDetails: {
    poster_url?: string;
    thumb_url?: string;
    name: string;
    origin_name?: string;
    year?: number;
    time?: string;
    lang?: string;
    quality?: string;
    category?: Array<{ id: string | number; name: string }>;
    description?: string;
    episode_current?: string | number;
    type?: string;
    sub_docquyen?: boolean;
    chieurap?: boolean;
    content?: string;
  },
  setIsPlaying: (isPlaying: boolean) => void
}) {
  return <div>

  {/* Background Image with Overlay */}
  <div className="absolute inset-0 -z-10 h-[50vh] overflow-hidden">
  <div 
    className="w-full h-full bg-cover bg-center blur-sm"
    style={{ backgroundImage: `url(${movieDetails.poster_url || movieDetails.thumb_url})` }}
  />
  <div className="absolute inset-0 bg-background/90" />
  </div>
  
  {/* Content Grid */}
  <div className="grid md:grid-cols-12 gap-8 pt-8">
  {/* Poster */}
  <div className="md:col-span-4 lg:col-span-3">
    <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
      <img
        src={movieDetails.poster_url || movieDetails.thumb_url}
        alt={movieDetails.name}
        className="w-full h-full object-cover"
      />
    </div>
  </div>
  
  {/* Details */}
  <div className="md:col-span-8 lg:col-span-9">
    <h1 className="text-4xl font-bold mb-2">{movieDetails.name}</h1>
    {movieDetails.origin_name && (
      <h2 className="text-xl text-muted-foreground mb-6">{movieDetails.origin_name}</h2>
    )}
  
    <div className="flex flex-wrap gap-4 mb-6">
      {movieDetails.year && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{movieDetails.year}</span>
        </div>
      )}
      {movieDetails.time && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{movieDetails.time}</span>
        </div>
      )}
      {movieDetails.lang && (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>{movieDetails.lang}</span>
        </div>
      )}
      {movieDetails.quality && (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-sm">
            {movieDetails.quality}
          </span>
        </div>
      )}
    </div>
  
    {movieDetails.category && movieDetails.category.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-6">
        {movieDetails.category.map((cat) => (
          <span
            key={cat.id}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
          >
            {cat.name}
          </span>
        ))}
      </div>
    )}
  
    {movieDetails.description && (
      <p className="text-lg text-muted-foreground mb-8">
        {movieDetails.description}
      </p>
    )}
  
    <div className="flex flex-wrap gap-4">
      <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsPlaying(true)}>
        <Play className="mr-2 h-5 w-5" /> Watch Now
      </Button>
       {movieDetails.episode_current && (
        <Button variant="outline" size="lg">
         {movieDetails.episode_current}
        </Button>
      )}
    </div>
  
    {/* Additional Info */}
    <div className="grid sm:grid-cols-2 gap-6 mt-12">
      <div className="space-y-4">
        {movieDetails.type && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
            <p className="mt-1">{movieDetails.type}</p>
          </div>
        )}
        {movieDetails.sub_docquyen && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Exclusive Subtitles</h3>
            <p className="mt-1">Yes</p>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {movieDetails.chieurap && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Theatrical Release</h3>
            <p className="mt-1">Yes</p>
          </div>
        )}
        {movieDetails.episode_current && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Current Episode</h3>
            <p className="mt-1">{movieDetails.episode_current}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  </div>
  {movieDetails.content && <div className='mt-10'>
  <h3 className="text-2xl font-bold mb-4">Tóm tắt:</h3>
  <div className='mt-4'>{movieDetails.content}</div>
  </div>}</div>;
}