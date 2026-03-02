import { create } from 'zustand';

interface Station {
  id: string;
  name: string;
  listen_url: string;
}

interface AudioState {
  isPlaying: boolean;
  volume: number;
  currentStation: Station | null;
  isLive: boolean;
  nowPlayingData: any;
  songHistory: any[]; // <--- DODALI SMO OVO
  
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setCurrentStation: (station: Station) => void;
  setLiveStatus: (status: boolean) => void;
  setNowPlayingData: (data: any) => void;
  setSongHistory: (history: any[]) => void; // <--- DODALI SMO OVO
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  volume: 0.8,
  currentStation: null,
  isLive: false,
  nowPlayingData: null,
  songHistory: [], // <--- POČETNO STANJE JE PRAZAN NIZ

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setCurrentStation: (station) => set({ currentStation: station, isPlaying: true }),
  setLiveStatus: (status) => set({ isLive: status }),
  setNowPlayingData: (data) => set({ nowPlayingData: data }),
  setSongHistory: (history) => set({ songHistory: history }), // <--- FUNKCIJA ZA UPDATE
}));