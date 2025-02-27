import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Calendar, Clock, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import type { Movie } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function FilmDetails({ movie }: { 
  movie: Movie,
}) {

  const router = useRouter();

  const currentSlug =  movie.slug;
  const details = movie.movie;
  
  return <div>

  {/* Background Image with Overlay */}
  <div className="absolute inset-0 -z-10 h-[50vh] overflow-hidden">
  <div 
    className="w-full h-full bg-cover bg-center blur-sm"
    style={{ backgroundImage: `url(${details?.poster_url || details?.thumb_url || ''})` }}
  />
  <div className="absolute inset-0 bg-background/90" />
  </div>
  
  {/* Content Grid */}
  <div className="grid md:grid-cols-12 gap-8 pt-8">
  {/* Poster */}
  <div className="md:col-span-4 lg:col-span-3">
    <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
      <Image
        src={details.poster_url || details.thumb_url || ''}
        alt={details.name}
        className="w-full h-full object-cover"
        width={300}
        height={450}
      />
    </div>
  </div>
  
  {/* Details */}
  <div className="md:col-span-8 lg:col-span-9">
    <h1 className="text-4xl font-bold mb-2">{details.name}</h1>
    {details.origin_name && (
      <h2 className="text-xl text-muted-foreground mb-6">{details.origin_name}</h2>
    )}
  
    <div className="flex flex-wrap gap-4 mb-6">
      {details.year && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{details.year}</span>
        </div>
      )}
      {details.time && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{details.time}</span>
        </div>
      )}
      {details.lang && (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>{details.lang}</span>
        </div>
      )}
      {details.quality && (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-sm">
            {details.quality}
          </span>
        </div>
      )}
    </div>
  
    {details.category && details.category?.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-6">
        {details.category?.map((cat:any, idx:any) => (
          <span
            key={idx}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
          >
            {cat.name}
          </span>
        ))}
      </div>
    )}
  
    {details.description && (
      <p className="text-lg text-muted-foreground mb-8">
        {details.description}
      </p>
    )}
  
    <div className="flex flex-wrap gap-4">
      <Button size="lg" className="w-full sm:w-auto" onClick={() => {router.push(`/xem-phim/${currentSlug}`)}} >
        <Play className="mr-2 h-5 w-5" /> Xem ngay
      </Button>
       {/* {details.episode_current && (
        <Button variant="outline" size="lg">
         {details.episode_current}
        </Button>
      )} */}
    </div>
  
    {/* Additional Info */}
    <div className="grid sm:grid-cols-2 gap-6 mt-12">
      <div className="space-y-4">
        {details.type && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
            <p className="mt-1">{details.type}</p>
          </div>
        )}
        {details.sub_docquyen && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Exclusive Subtitles</h3>
            <p className="mt-1">Yes</p>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {details.chieurap && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Theatrical Release</h3>
            <p className="mt-1">Yes</p>
          </div>
        )}
        {details.episode_current && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Current Episode</h3>
            <p className="mt-1">{details.episode_current}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  </div>
  {details.content && <div className='mt-10'>
  <h3 className="text-2xl font-bold mb-4">Tóm tắt:</h3>
  <div className='mt-4'>{details.content}</div>
  </div>}</div>;
}