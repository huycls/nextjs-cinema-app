import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Movie } from '@/lib/api';

export default function FilmPlaying({ episodes }: { episodes: Movie[] }) {
    const [currentServer, setCurrentServer] = useState(0);
    const [currentEpisode, setCurrentEpisode] = useState(0);

    const data = episodes[0]?.episodes;
    const currentFilm = episodes[0]?.movie
    const currentData = episodes[0]?.episodes[currentServer];
    const currentEpisodeData = currentData?.server_data[currentEpisode];
    const maxEpisode = currentEpisode === currentData?.server_data?.length - 1;

    useEffect(( ) =>{
     const  currentHistory = JSON.parse(window.localStorage.getItem('filmHistory') || '[]');
      if(currentHistory.length > 0){
        const currentHistoryData = currentHistory.find((item: any) => item.id === currentFilm._id);
        if(currentHistoryData){
          setCurrentServer(currentHistoryData.server);
          setCurrentEpisode(currentHistoryData.episode);
        }
      }
    
    },[currentFilm])

    useEffect(()=>{
      const artControll = document.querySelector('.art-control-setting') as HTMLElement;

      if(artControll){
        artControll.style.display = 'none';
      }
    },[])

    const handleEpisodeChange = (episodeIndex: number) => {
      setCurrentEpisode(episodeIndex);
      if (currentFilm) {
        const newHistoryData = {
          id: currentFilm._id,
          name: currentFilm.name,
          episode: episodeIndex,
          server: currentServer,
          time: new Date().toISOString(),
        };
        const currentHistory = JSON.parse(window.localStorage.getItem('filmHistory') || '[]');
        if (currentHistory.find((item: any) => item.id === currentFilm._id)) {
          const updatedHistoryData = currentHistory.map((item: any) => {
            if (item.id === currentFilm._id) {
              return {
                ...item,
                episode: episodeIndex,
                time: new Date().toISOString(),
              };
            }
            return item;
          });
          window.localStorage.setItem('filmHistory', JSON.stringify(updatedHistoryData));
        } else {
        const updatedHistoryData = [...currentHistory, newHistoryData];
        window.localStorage.setItem('filmHistory', JSON.stringify(updatedHistoryData));
      }
    }
    };
    

    return (
      <div>
        <div className="-ml-[8%] w-[117%] h-[110%] scale-x-90 md:scale-100 md:w-full md:h-full aspect-video md:ml-0">
          <iframe 
            title="Video Player"
            src={currentEpisodeData?.link_embed}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          /> 
        </div>
        <div className="flex justify-center gap-4 mt-4">
         <Button variant="outline" size="sm" onClick={() => setCurrentEpisode(currentEpisode - 1)} disabled={currentEpisode === 0}>Tập trước</Button>
         <Button variant="outline" size="sm" onClick={() => setCurrentEpisode(currentEpisode + 1)} disabled={maxEpisode}>Tập tiếp theo</Button>
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
                <Button key={index} variant="outline" size="sm" onClick={() => handleEpisodeChange(index)}>
                  <span className={currentEpisode === index ? "text-red-500" : ""}>{episode.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}