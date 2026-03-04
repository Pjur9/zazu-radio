// store/useAudioStore.ts
import { create } from 'zustand';

export interface Station {
  id: number;
  name: string;
  shortcode: string;
  listen_url: string;
  now_playing: {
    song: {
      title: string;
      artist: string;
      art: string;
    };
  };
  live: {
    is_live: boolean;
    streamer_name: string;
  };
  song_history: any[];
}

interface AudioState {
  stations: Station[];
  activeStationId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;

  // Akcije
  setStations: (stations: Station[]) => void;
  setInitialStationId: (id: number) => void;
  setActiveStationId: (id: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  stations: [],
  activeStationId: null,
  isPlaying: false,
  isLoading: true,
  volume: 1,

  setStations: (stations) => set({ stations }),
  
  // Postavlja početnu stanicu bez okidanja autoplay-a (da browser ne blokira)
  setInitialStationId: (id) => set((state) => ({ 
      activeStationId: state.activeStationId === null ? id : state.activeStationId 
  })),
  
  // Kada korisnik klikne, mijenja stanicu i automatski pušta zvuk
  setActiveStationId: (id) => set({ activeStationId: id, isPlaying: true }),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setVolume: (volume) => set({ volume }),
}));