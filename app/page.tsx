'use client'; 

import { Play, Pause, Disc, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudioStore } from '../store/useAudioStore';
import { Skeleton } from '../components/ui/Skeleton'; 

export default function Home() {
  const { stations, activeStationId, isPlaying, isLoading, togglePlay, setActiveStationId } = useAudioStore();

  const activeStation = stations.find(s => s.id === activeStationId);
  const songHistory = activeStation?.song_history || [];

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-32">
      
      {/* 1. MALI TABOVI ZA IZBOR STANICE (Odmah ispod navigacije) */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-20">
        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="w-32 h-10 rounded-full" />
            <Skeleton className="w-32 h-10 rounded-full" />
          </div>
        ) : (
          stations.map(station => {
            const isActive = activeStationId === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setActiveStationId(station.id)}
                className={`px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 flex items-center ${
                  isActive
                    ? 'bg-zazu-turquoise text-zazu-darker shadow-[0_0_20px_rgba(5,213,250,0.5)] scale-105'
                    : 'bg-zazu-dark text-white border border-[#1f2230] hover:border-zazu-turquoise/50 hover:text-zazu-turquoise'
                }`}
              >
                <Radio className={`w-4 h-4 mr-2 ${isActive ? 'text-zazu-darker animate-pulse' : 'text-slate-500'}`} />
                {station.name}
              </button>
            );
          })
        )}
      </div>

      {/* 2. GLAVNI EKRAN (Veliki plan) */}
      {isLoading || !activeStation ? (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
           <Skeleton className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl flex-shrink-0 bg-white/5" />
           <div className="w-full max-w-lg space-y-4">
             <Skeleton className="w-24 h-6 rounded-full bg-zazu-red/20" />
             <Skeleton className="w-full h-12 rounded-lg bg-white/5" />
             <Skeleton className="w-48 h-8 rounded-lg bg-zazu-turquoise/20" />
           </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-16 lg:gap-40 mt-10">
          
          {/* LIJEVA STRANA: Omot i Ploča (Viri 70%) */}
          <div 
            className="relative flex-shrink-0 w-64 h-64 sm:w-80 sm:h-80 cursor-pointer group z-10" 
            onClick={togglePlay}
          >
            {/* PLOČA (Ispod omota, pomjerena 65-70% udesno) */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className={`absolute top-0 left-[65%] w-full h-full rounded-full bg-[#050505] shadow-[20px_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center z-0 transition-colors duration-500 border-2 ${isPlaying ? 'border-zazu-turquoise/40' : 'border-[#111]'}`}
              style={{ backgroundImage: 'repeating-radial-gradient(circle at center, #111 0, #111 1px, #050505 2px, #050505 5px)' }}
            >
              {/* Centralna labela ploče sa Zazu Logom */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zazu-dark flex items-center justify-center border-4 border-[#050505] shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-zazu-turquoise opacity-10"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/Zazu-Radio-logo.png" 
                  alt="Zazu Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90 drop-shadow-md" 
                  style={{ mixBlendMode: 'screen' }}
                />
                <div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-[#050505] rounded-full border border-[#222]"></div>
              </div>
            </motion.div>

            {/* OMOT ALBUMA (Iznad ploče) */}
            <div className="relative z-10 w-full h-full rounded-xl bg-zazu-dark border border-[#1f2230] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
              {activeStation.now_playing?.song?.art ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeStation.now_playing.song.art} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zazu-dark to-[#050505]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/zazu-logo.png" className="w-32 h-32 opacity-20" alt="Zazu" style={{ mixBlendMode: 'screen' }} />
                </div>
              )}
              
              {/* Tamni overlay pri prelasku mišem sa Play/Pause ikonicom (Tirkizna) */}
              <div className="absolute inset-0 bg-zazu-darker/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-full bg-zazu-turquoise flex items-center justify-center text-zazu-darker shadow-[0_0_30px_rgba(5,213,250,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 ml-2 fill-current" />}
                </div>
              </div>
            </div>
          </div>

          {/* DESNA STRANA: Informacije i Istorija */}
          <div className="flex-grow w-full max-w-md lg:max-w-lg relative z-20 mt-10 lg:mt-0">
            
            {/* Info Sekcija */}
            <div className="mb-12 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-5">
                {activeStation.live?.is_live && (
                  <span className="bg-zazu-red/10 text-zazu-red border border-zazu-red/30 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center shadow-[0_0_15px_rgba(255,51,102,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-zazu-red animate-pulse mr-2 shadow-[0_0_5px_rgba(255,51,102,1)]"></span>
                    Uživo
                  </span>
                )}
                <span className="text-zazu-orange font-black uppercase tracking-[0.15em] text-sm bg-zazu-orange/10 px-3 py-1.5 rounded-full border border-zazu-orange/20">
                  {activeStation.name}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 drop-shadow-lg line-clamp-2">
                {activeStation.now_playing?.song?.title || 'Zazu Stream'}
              </h1>
              
              <h2 className="text-xl sm:text-2xl font-bold text-zazu-turquoise tracking-wide drop-shadow-md">
                {activeStation.now_playing?.song?.artist || 'Učitavanje zvuka...'}
              </h2>
            </div>

            {/* Istorija pjesama */}
            {songHistory.length > 0 && (
              <div className="bg-zazu-darker/50 p-6 rounded-3xl border border-[#1f2230] shadow-2xl backdrop-blur-md">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center">
                  <Disc className="w-4 h-4 mr-2" /> Prethodno na radiju
                </h3>
                
                <div className="flex flex-col gap-4">
                  {songHistory.slice(0, 4).map((historyItem: any, i: number) => (
                    <div key={historyItem.sh_id || i} className="flex items-center group">
                      {/* Mali omot pjesme u istoriji */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#050505] border border-[#1f2230] overflow-hidden mr-4 flex-shrink-0 group-hover:border-zazu-turquoise/50 transition-colors relative">
                        {historyItem.song.art ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={historyItem.song.art} alt="Art" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Radio className="w-5 h-5 text-slate-700" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-grow truncate">
                        <span className="text-white font-bold text-sm sm:text-base truncate group-hover:text-zazu-turquoise transition-colors">
                          {historyItem.song.title}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-slate-400 text-xs truncate uppercase tracking-wider font-medium">
                            {historyItem.song.artist}
                          </span>
                          <span className="text-zazu-darker bg-slate-300 text-[10px] px-2 py-0.5 rounded font-bold ml-2">
                            {Math.round((Date.now() / 1000 - historyItem.played_at) / 60)}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}