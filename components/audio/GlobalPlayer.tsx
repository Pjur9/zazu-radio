'use client'; 

import { Play, Pause, Volume2, Disc } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudioStore } from '../../store/useAudioStore';

// 1. IMPORTUJEMO NAŠ MOTOR (Provjeri da li je putanja tačna)
import { useAudioEngine } from '../../hooks/useAudioEngine';

export default function GlobalPlayer() {
  // 2. PALIMO MOTOR! (Ovo će pokrenuti fetchStations i Audio logiku u pozadini)
  useAudioEngine(); 

  // 3. Vučemo podatke iz Zustand mozga (koji se sada automatski puni zahvaljujući motoru)
  const { stations, activeStationId, isPlaying, volume, togglePlay, setVolume } = useAudioStore();

  const activeStation = stations.find(s => s.id === activeStationId);

  // Ako nemamo aktivnu stanicu (još se učitava)
  if (!activeStation) {
    return (
      <div className="h-28 bg-zazu-darker border-t border-zazu-dark flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <Disc className="w-6 h-6 mr-3 text-zazu-turquoise animate-spin-slow opacity-50" />
        <span className="text-sm">Povezivanje sa Zazu mrežom...</span>
      </div>
    );
  }

  // Prečice za podatke trenutne pjesme
  const song = activeStation.now_playing?.song || { title: 'Zazu Stream', artist: 'Učitavanje...', art: '' };
  const isLive = activeStation.live?.is_live;

  return (
    <div className="h-32 bg-zazu-darker/95 backdrop-blur-xl border-t border-zazu-turquoise/20 flex items-center justify-between px-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden z-50">
      
      {/* Tirkizni Glow na dnu ako svira muzika */}
      {isPlaying && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-20 bg-zazu-turquoise blur-[100px] opacity-10 pointer-events-none"></div>}

      {/* LIJEVA SEKCIJA: Detaljna Vinyl Ploča */}
      <div className="flex items-center w-1/3 relative z-10">
        <div className="relative w-28 h-20 mr-5 flex items-center">
          
          {/* Ploča koja se izvlači i rotira */}
          <motion.div 
            animate={{ x: isPlaying ? 40 : 0, rotate: isPlaying ? 360 : 0 }}
            transition={{ x: { type: "spring", stiffness: 80, damping: 15 }, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
            className={`absolute left-0 w-20 h-20 bg-[#050505] rounded-full flex items-center justify-center border-2 z-0 shadow-xl ${isPlaying ? 'border-zazu-turquoise/50' : 'border-[#111]'}`}
            style={{ backgroundImage: 'repeating-radial-gradient(circle at center, #111 0, #111 1px, #050505 2px, #050505 4px)' }}
          >
            {/* Labela na ploči */}
            <div className={`w-7 h-7 rounded-full overflow-hidden border z-10 relative ${isPlaying ? 'bg-zazu-orange border-zazu-orange/50' : 'bg-zazu-dark border-[#222]'}`}>
              {song.art ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.art} alt="Label" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
              ) : (
                // Ako nema slike, stavljamo mali logo
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/images/Zazu-Radio-logo.png" alt="Zazu" className="w-full h-full object-contain opacity-50" style={{ mixBlendMode: 'screen' }} />
              )}
            </div>
            {/* Rupica na sredini */}
            <div className="absolute w-1.5 h-1.5 bg-[#050505] rounded-full z-20 border border-[#222]"></div>
          </motion.div>

          {/* Omot Albuma */}
          <div className="relative w-20 h-20 bg-zazu-dark rounded-xl overflow-hidden z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#1f2230]">
            {song.art ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={song.art} alt="Album" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zazu-dark">
                <Disc className="text-[#1f2230] w-8 h-8" />
              </div>
            )}
            {/* Odjsaj na omotu */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
          </div>
        </div>
        
        <div className="flex flex-col truncate pr-4">
          <span className="text-white font-black truncate text-xl uppercase tracking-tight drop-shadow-md">
            {song.title}
          </span>
          <span className="text-zazu-turquoise font-bold text-sm truncate uppercase tracking-wider">
            {song.artist}
          </span>
        </div>
      </div>

      {/* SREDNJA SEKCIJA: Play Dugme i Live Indikator */}
      <div className="flex flex-col items-center justify-center w-1/3 relative z-10">
        <button 
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group ${
            isPlaying 
              ? 'bg-zazu-turquoise text-zazu-darker shadow-[0_0_30px_rgba(5,213,250,0.4)] border-4 border-[#0a0c14]' 
              : 'bg-[#0f111a] text-zazu-turquoise border border-zazu-turquoise/30 hover:bg-zazu-turquoise hover:text-zazu-darker'
          }`}
        >
          {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 ml-1 fill-current" />}
        </button>
        
        {isLive && (
          <div className="mt-3 flex items-center space-x-2 bg-zazu-red/10 px-3 py-1 rounded-full border border-zazu-red/30">
            <div className="w-2 h-2 rounded-full bg-zazu-red animate-pulse shadow-[0_0_10px_#FF3366]" />
            <span className="text-[10px] font-black text-zazu-red tracking-[0.2em]">UŽIVO DJ</span>
          </div>
        )}
      </div>

      {/* DESNA SEKCIJA: Zvuk (Fader) */}
      <div className="flex items-center justify-end w-1/3 space-x-5 relative z-10">
        <Volume2 className={`w-6 h-6 ${volume === 0 ? 'text-slate-600' : 'text-zazu-turquoise'}`} />
        <div className="relative w-32 h-10 flex items-center group">
            <input 
              title="Volume Control"
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              // Sakrivamo defaultni izgled slidera, crtamo ga preko CSS-a
              className="absolute w-full h-1.5 appearance-none cursor-pointer z-20 opacity-0"
            />
            
            {/* Prilagođeni izgled trake za zvuk */}
            <div className="absolute w-full h-1 bg-[#1f2230] rounded-full overflow-hidden z-10 pointer-events-none">
              <div 
                className="h-full bg-zazu-turquoise transition-all duration-100 ease-out"
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
            
            {/* Oznake (crtice) za jačinu zvuka poput prave DJ opreme */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0.5 pointer-events-none z-0">
                {[...Array(11)].map((_, i) => (
                    <div key={i} className={`w-[1px] h-2 ${i % 5 === 0 ? 'h-3 bg-slate-600' : 'bg-[#1f2230]'}`}></div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}