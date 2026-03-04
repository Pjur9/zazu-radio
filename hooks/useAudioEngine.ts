// hooks/useAudioEngine.ts
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAudioStore } from '../store/useAudioStore';

export const useAudioEngine = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { 
    stations, 
    activeStationId, 
    isPlaying, 
    volume, 
    setStations, 
    setInitialStationId, 
    setIsLoading, 
    setIsPlaying 
  } = useAudioStore();

  const activeStation = stations.find(s => s.id === activeStationId);

  // 1. ODRŽAVANJE PODATAKA (Inicijalni Fetch + SSE Real-Time)
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('https://radio.zazuradio.com/api/nowplaying');
        const formattedData = response.data.map((item: any) => ({
          id: item.station.id,
          name: item.station.name,
          shortcode: item.station.shortcode,
          listen_url: `https://radio.zazuradio.com/listen/${item.station.shortcode}/radio.mp3`,
          now_playing: item.now_playing,
          live: item.live,
          song_history: item.song_history,
        }));

        setStations(formattedData);
        // Postavi prvu stanicu u state samo ako još nijedna nije aktivna
        setInitialStationId(formattedData[0]?.id);
        setIsLoading(false);
      } catch (error) {
        console.error("Greška pri API pozivu:", error);
        setIsLoading(false);
      }
    };

    // Odmah učitaj podatke pri ulasku na sajt
    fetchStations();

    let eventSource: EventSource | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;

    // Pokušaj spajanja na AzuraCast SSE (Nativni Real-time endpoint)
    try {
      eventSource = new EventSource('https://radio.zazuradio.com/api/live/nowplaying/sse');
      
      eventSource.onmessage = (e) => {
        // Čim server javi da se pjesma promijenila, odmah ažuriramo UI (nema čekanja 10s!)
        fetchStations(); 
      };

      eventSource.onerror = () => {
        console.warn("SSE Real-time konekcija prekinuta. Prelazak na 10s polling fallback...");
        if (eventSource) eventSource.close();
        // Fallback mehanizam za zaštitu (ako korisnik ima loš net ili adblocker blokira SSE)
        if (!fallbackInterval) fallbackInterval = setInterval(fetchStations, 10000);
      };
    } catch (err) {
      // Hard fallback
      fallbackInterval = setInterval(fetchStations, 10000);
    }

    // Cleanup: gasimo konekcije kada korisnik napusti sajt
    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [setStations, setInitialStationId, setIsLoading]);

  // 2. KONTROLA ZVUKA (Inicijalizacija i Volume)
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none'; // Štedi gigabajte transfera (ne skida MP3 dok se ne klikne Play)
    }
    audioRef.current.volume = volume;
  }, [volume]);

  // 3. PLAY / PAUSE LOGIKA (Osjetljivo: Reaguje SAMO na play/pause i promjenu same stanice)
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && activeStation?.listen_url) {
      // Kada puštamo, dodajemo "?nocache=..." sa trenutnim vremenom na URL.
      // Ovo garantuje da browser NEĆE povući staru pjesmu iz bafera, već se spaja pravo u LIVE prenos!
      const liveUrl = `${activeStation.listen_url}?nocache=${Date.now()}`;
      
      audioRef.current.src = liveUrl;
      audioRef.current.play().catch(e => {
        console.error("Browser je blokirao autoplay. Korisnik mora kliknuti na ekran.", e);
        setIsPlaying(false);
      });
    } else {
      // Kada korisnik pauzira, zapravo zaustavljamo stream i ubijamo bafer
      audioRef.current.pause();
      audioRef.current.removeAttribute('src'); // Brišemo staru pjesmu iz memorije
      audioRef.current.load(); // Resetujemo audio element
    }
  }, [activeStation?.listen_url, isPlaying, setIsPlaying]);

  // 4. MEDIA SESSION API (Integracija sa hardverom: Lock screen & Auto Bluetooth)
  useEffect(() => {
    // Ažuriramo lock screen samo kada se zaista promijeni IME PJESME
    if ('mediaSession' in navigator && activeStation) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeStation.now_playing?.song?.title || 'Učitavanje...',
        artist: activeStation.now_playing?.song?.artist || activeStation.name,
        album: 'Hornbill Vinyl Radio', // Naziv tvog portala
        artwork: [
          { 
            src: activeStation.now_playing?.song?.art || 'https://radio.zazuradio.com/static/img/generic_song.jpg', 
            sizes: '512x512', 
            type: 'image/jpeg' 
          }
        ]
      });

      // Zakačimo hardverske komande na naš Zustand state!
      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('stop', () => setIsPlaying(false));
    }
  }, [activeStation?.now_playing?.song?.title, activeStation?.name, setIsPlaying]);

  return null;
};