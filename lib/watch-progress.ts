// Constants for localStorage keys
export const STORAGE_KEYS = {
    WATCH_PROGRESS: 'watch_progress',
  };
  
  export interface WatchProgress {
    movieId: string;
    movieSlug: string;
    movieName: string;
    currentEpisode: string;
    lastWatched: string; // ISO date string
  }
  
  export function saveWatchProgress(progress: WatchProgress): void {
    try {
      // Get existing progress data
      const existingData = getWatchProgressList();
      
      // Update or add new progress
      const updatedData = existingData.filter(p => p.movieId !== progress.movieId);
      updatedData.unshift(progress); // Add new progress at the beginning
      
      // Keep only the last 50 movies
      const limitedData = updatedData.slice(0, 50);
      
      localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(limitedData));
    } catch (error) {
      console.error('Error saving watch progress:', error);
    }
  }
  
  export function getWatchProgress(movieId: string): WatchProgress | null {
    try {
      const progressList = getWatchProgressList();
      return progressList.find(p => p.movieId === movieId) || null;
    } catch (error) {
      console.error('Error getting watch progress:', error);
      return null;
    }
  }
  
  export function getWatchProgressList(): WatchProgress[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting watch progress list:', error);
      return [];
    }
  }
  
  export function clearWatchProgress(movieId: string): void {
    try {
      const progressList = getWatchProgressList();
      const updatedList = progressList.filter(p => p.movieId !== movieId);
      localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error clearing watch progress:', error);
    }
  }