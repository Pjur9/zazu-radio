'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

interface RadioContextType {
  stations: Station[];
  activeStation: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  setVolume: (vol: number) => void;
  setActiveStation: (station: Station) => void;
  togglePlay: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState<Station[]>([]);
  
  // KLJUČNA PROMJENA: Čuvamo samo ID, a ne cijeli objekat!
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolumeState] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Izvedeno stanje: React sam pronalazi stanicu na osnovu ID-a prilikom svakog renderovanja
  const activeStation = stations.find(s => s.id === activeStationId) || null;

  const fetchStations = async () => {
    try {
      const response = await axios.get('https://radio.zazuradio.com/api/nowplaying');
      
      const formattedData: Station[] = response.data.map((item: any) => ({
        id: item.station.id,
        name: item.station.name,
        shortcode: item.station.shortcode,
        listen_url: `https://radio.zazuradio.com/listen/${item.station.shortcode}/radio.mp3`,
        now_playing: item.now_playing,
        live: item.live,
        song_history: item.song_history,
      }));

      setStations(formattedData);
      
      // RJEŠENJE PROBLEMA: Koristimo "prev" stanje da interval uvijek zna pravi ID
      setActiveStationId(prevId => {
        // Ako je ID null (prvo učitavanje), stavi prvu stanicu
        if (prevId === null && formattedData.length > 0) {
          return formattedData[0].id;
        }
        // U suprotnom, zadrži onu stanicu koju je korisnik kliknuo!
        return prevId;
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Greška pri povlačenju stanica:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    const interval = setInterval(fetchStations, 10000); // 10 sekundi
    return () => clearInterval(interval);
  }, []);

  // Inicijalizacija zvuka
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.volume = volume;
  }, [volume]);

  // Pametno hendlanje audio linka - mjenja se SAMO kad klikneš drugu stanicu
  useEffect(() => {
    if (activeStation && audioRef.current) {
      if (audioRef.current.src !== activeStation.listen_url) {
        audioRef.current.src = activeStation.listen_url;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Audio block:", e));
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStation?.listen_url]); // Okida se isključivo kad se promijeni URL

  const togglePlay = () => {
    if (!audioRef.current || !activeStation) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src !== activeStation.listen_url) {
        audioRef.current.src = activeStation.listen_url;
      }
      audioRef.current.play().catch(e => console.error("Audio block:", e));
      setIsPlaying(true);
    }
  };

  const handleSetActiveStation = (station: Station) => {
    setActiveStationId(station.id); // Samo postavimo novi ID
    setIsPlaying(true);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  return (
    <RadioContext.Provider 
      value={{ 
        stations, 
        activeStation, 
        isPlaying, 
        isLoading, 
        volume, 
        setVolume, 
        setActiveStation: handleSetActiveStation, 
        togglePlay 
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio mora biti unutar RadioProvidera');
  }
  return context;
}