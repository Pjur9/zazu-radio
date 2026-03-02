'use client'; 

import { useRadio } from '../../context/RadioContext';
import { Play, Pause, Volume2, Disc, Bird } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalPlayer() {
  // Vučemo sve funkcije iz našeg mozga
  const { activeStation, isPlaying, volume, togglePlay, setVolume } = useRadio();

  // Ako nemamo stanica, prikaži empty state
  if (!activeStation) {
    return (
      <div className="h-28 bg-[#0a0c14] border-t-2 border-[#1f2230] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCA0IDQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMTcxNzE3Ii8+CjxwYXRoIGQ9Ik0wIDBMMiAyTDMgM0w0IDRNMCA0TDIgMkwzIDFMNCAwIiBzdHJva2U9IiMyYTJhMmEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')]"></div>
        <Bird className="w-6 h-6 mr-3 text-orange-600/50" />
        <span>Povezivanje sa Zazu mrežom...</span>
      </div>
    );
  }

  // Prečice za podatke trenutne pjesme
  const song = activeStation.now_playing.song;
  const isLive = activeStation.live?.is_live;

  return (
    <div className="h-32 bg-gradient-to-b from-[#12141d] to-[#0a0c14] border-t-2 border-orange-500/20 flex items-center justify-between px-8 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCA0IDQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMTcxNzE3Ii8+CjxwYXRoIGQ9Ik0wIDBMMiAyTDMgM0w0IDRNMCA0TDIgMkwzIDFMNCAwIiBzdHJva2U9IiMyYTJhMmEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')]"></div>
      {isPlaying && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-orange-600/20 blur-[80px] pointer-events-none"></div>}

      {/* LJEVA SEKCIJA: Detaljna Vinyl Ploča */}
      <div className="flex items-center w-1/3 relative z-10">
        <div className="relative w-28 h-20 mr-5 flex items-center">
          
          <motion.div 
            animate={{ x: isPlaying ? 40 : 0, rotate: isPlaying ? 360 : 0 }}
            transition={{ x: { type: "spring", stiffness: 80, damping: 15 }, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
            className="absolute left-0 w-20 h-20 bg-[#0a0a0a] rounded-full flex items-center justify-center border-2 border-[#1a1a1a] z-0 shadow-[0_5px_20px_rgba(0,0,0,0.7)]"
            style={{ backgroundImage: 'repeating-radial-gradient(circle at center, #1a1a1a 0, #1a1a1a 1px, #0a0a0a 2px, #0a0a0a 4px)' }}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-orange-600/50 z-10 bg-orange-600 relative">
              {song.art && <img src={song.art} alt="Label" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/80 to-transparent"></div>
            </div>
            <div className="absolute w-1.5 h-1.5 bg-[#0a0a0a] rounded-full z-20 border border-[#2a2a2a]"></div>
          </motion.div>

          <div className="relative w-20 h-20 bg-[#0a0c14] rounded-xl overflow-hidden z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-[#1f2230]">
            {song.art ? (
              <img src={song.art} alt="Album" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0a0c14]">
                <Disc className="text-[#1f2230] w-8 h-8" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
          </div>
        </div>
        
        <div className="flex flex-col truncate pr-4">
          <span className="text-slate-100 font-black truncate text-xl uppercase tracking-tight shadow-black drop-shadow-md">
            {song.title || "Zazu Stream"}
          </span>
          <span className="text-orange-500 font-bold text-sm truncate uppercase tracking-wider">
            {song.artist || "DJ Hornbill"}
          </span>
        </div>
      </div>

      {/* SREDNJA SEKCIJA: Vatreno Play Dugme */}
      <div className="flex flex-col items-center justify-center w-1/3 relative z-10">
        <button 
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_40px_rgba(234,88,12,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_60px_rgba(234,88,12,0.6)] ${isPlaying ? 'bg-gradient-to-br from-orange-500 to-red-600 border-4 border-[#0a0c14]' : 'bg-[#1a1c2e] border-4 border-orange-600/20 group-hover:border-orange-600'}`}
        >
          {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 ml-1 fill-current text-orange-500" />}
        </button>
        {isLive && (
          <div className="mt-3 flex items-center space-x-2 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
            <span className="text-[10px] font-black text-red-400 tracking-[0.2em]">ON AIR</span>
          </div>
        )}
      </div>

      {/* DESNA SEKCIJA: Zvuk (Fader) */}
      <div className="flex items-center justify-end w-1/3 space-x-5 relative z-10">
        <Volume2 className="w-6 h-6 text-orange-600/50" />
        <div className="relative w-32 h-10 flex items-center">
            <input 
            title="Sound"
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute w-full h-1.5 bg-[#0a0a0a] border border-[#1f2230] rounded-full appearance-none cursor-pointer z-10"
            style={{ backgroundImage: `linear-gradient(to right, #ea580c ${volume * 100}%, #0a0a0a ${volume * 100}%)` }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1 pointer-events-none">
                {[...Array(11)].map((_, i) => (
                    <div key={i} className={`w-0.5 h-2 ${i % 5 === 0 ? 'h-3 bg-orange-600/30' : 'bg-[#1f2230]'}`}></div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}