import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Movie } from '@/lib/api';

export default function FilmPlaying({ episodes }: { episodes: Movie[] }) {
    const [currentServer, setCurrentServer] = useState(0);
    const [currentEpisode, setCurrentEpisode] = useState(0);

    const data = episodes[0].episodes;

    const currentData = episodes[0].episodes[currentServer];

    const currentEpisodeData = currentData?.server_data[currentEpisode];

    return (
      <div>
        <div className="aspect-video w-full">
          <iframe 
            src={currentEpisodeData?.link_embed}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
          /> 
        </div>

        {currentData && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Tập phim:</h3>
            <div className='mb-4 flex gap-4 items-center'>
              Server:
              {data.map((server: { server_name: string }, index: number) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setCurrentServer(index)}>
                  <span className={currentServer === index ? "text-red-500" : ""}>{server.server_name}</span>
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentData.server_data.map((episode: { name: string }, index: number) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setCurrentEpisode(index)}>
                  <span className={currentEpisode === index ? "text-red-500" : ""}>{episode.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}