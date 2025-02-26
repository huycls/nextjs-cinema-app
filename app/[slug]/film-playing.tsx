import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function FilmPlaying({episodes}: {episodes: any[]}) {

const [currentEpisode, setCurrentEpisode] = useState(0);

const movie = episodes[0]?.server_data[currentEpisode]

console.log("episodes",episodes[0]?.server_data[currentEpisode]?.link_embed)


  return <div>
     <div className="aspect-video w-full">
       <iframe 
        src={movie?.link_embed}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; encrypted-media"
      /> 
    </div>

    {episodes && (
        <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Tập phim:</h3>
            <div className='mb-4 mr-4'>Server:
            <Button variant="outline" size="sm">{episodes[0].server_name
            }</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {episodes[0].server_data?.map((episode: { name: string }, index: number) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setCurrentEpisode(index)}>
                    <span className={currentEpisode === index ? "text-red-500" : ""}>{episode.name}</span>
                    </Button>
            ))}
            </div>
        </div>
        )}
  </div>
  ;
}