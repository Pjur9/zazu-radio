// app/page.tsx
'use client'; 

import { Play, Pause, Disc, Radio } from 'lucide-react';
import { useAudioStore } from '../store/useAudioStore';
import { Skeleton } from '../components/ui/Skeleton'; 

// Tvoja slika koja će ići na centar ploče (može biti kvadratna, CSS će je zaokružiti)
const FALLBACK_ART = '/images/Zazu-Radio-logo.png';
const ZAZU_LOGO_CENTER = '/images/Zazu-Radio-logo.png'; 

export default function Home() {
  const { stations, activeStationId, isPlaying, isLoading, togglePlay, setActiveStationId } = useAudioStore();

  const activeStation = stations.find(s => s.id === activeStationId);
  const songHistory = activeStation?.song_history || [];
  
  const currentSong = activeStation?.now_playing?.song;
  const coverArt = currentSong?.art || FALLBACK_ART;

  return (
    // Dodali smo overflow-x-hidden ovdje kako ploča koja viri ne bi napravila horizontalni scroll na malim ekranima
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 pt-12 pb-32">
        
        {/* STANICE (TABOVI) */}
        <div className="flex flex-wrap justify-center gap-6 mb-24 relative z-20">
          {isLoading ? (
            <div className="flex gap-4">
              <Skeleton className="w-40 h-12 rounded-full" />
              <Skeleton className="w-40 h-12 rounded-full" />
            </div>
          ) : (
            stations.map(station => {
              const isActive = activeStationId === station.id;
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStationId(station.id)}
                  className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center ${
                    isActive
                      ? 'bg-zazu-turquoise text-black shadow-[0_0_25px_rgba(5,213,250,0.4)] scale-105'
                      : 'bg-zazu-dark text-white border border-gray-800 hover:border-zazu-turquoise/50 hover:text-zazu-turquoise'
                  }`}
                >
                  <Radio className={`w-5 h-5 mr-3 ${isActive ? 'text-black animate-pulse' : 'text-gray-500'}`} />
                  {station.name}
                </button>
              );
            })
          )}
        </div>

        {/* GLAVNI GRID */}
        {isLoading || !activeStation ? (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center">
               <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <Skeleton className="w-80 h-80 rounded-xl bg-white/5" />
               </div>
               <div className="lg:col-span-7 space-y-6">
                  <Skeleton className="w-32 h-8 rounded-full bg-zazu-red/20" />
                  <Skeleton className="w-3/4 h-16 rounded-lg bg-white/5" />
                  <Skeleton className="w-1/2 h-10 rounded-lg bg-zazu-turquoise/20" />
               </div>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start">
            
            {/* LIJEVA STRANA: OMOT I REALISTIČNA PLOČA */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative group cursor-pointer z-10" onClick={togglePlay}>
              <div className="relative w-72 h-72 sm:w-[350px] sm:h-[350px]">
                
                {/* PLOČA - KONTEJNER (Viri 70% izvan omota udesno) */}
                <div className="absolute top-0 bottom-0 right-0 w-full h-full z-0 flex items-center justify-center translate-x-[65%] sm:translate-x-[70%]">
                  
                  {/* SAMA PLOČA (Rotira se kompletna - popravljen preskok pauziranja) */}
                  <div
                    className="relative w-[95%] h-[95%] rounded-full bg-black border border-[#222] shadow-[30px_0_70px_rgba(0,0,0,1)] flex items-center justify-center animate-[spin_4s_linear_infinite]"
                    style={{ 
                      // OVO RJEŠAVA PROBLEM: Zamrzava rotaciju tamo gdje jeste kada stisneš pauzu!
                      animationPlayState: isPlaying ? 'running' : 'paused' 
                    }}
                  >
                    {/* Žljebovi ploče i rotirajući bijeli odsjaj */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{ 
                          backgroundImage: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.15) 20deg, transparent 40deg, transparent 180deg, rgba(255,255,255,0.15) 200deg, transparent 220deg), repeating-radial-gradient(circle at center, #111 0, #000 1.5px, #111 3px, #000 4px)' 
                      }}
                    />

                    {/* ROTIRAJUĆI CENTAR (Label sa tvojom slikom) */}
                    <div className="relative w-[36%] h-[36%] rounded-full flex items-center justify-center border-4 border-[#111] shadow-[0_0_20px_rgba(0,0,0,0.8)] z-10 overflow-hidden bg-black">
                        {/* Ovdje mijenjaš sliku centra ploče. "object-cover" osigurava da lijepo popuni krug */}
                        <img src={ZAZU_LOGO_CENTER} alt="Vinyl Label" className="w-full h-full object-cover" />
                        
                        {/* Rupa na sredini ploče */}
                        <div className="absolute w-3.5 h-3.5 bg-black rounded-full border border-[#333] shadow-inner"></div>
                    </div>
                  </div>
                </div>

                {/* OMOT ALBUMA (Fiksiran, prekriva lijevi dio ploče) */}
                <div className="relative z-20 w-full h-full rounded-xl bg-black border border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                  <img src={coverArt} alt="Cover" className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-zazu-turquoise flex items-center justify-center text-black shadow-[0_0_30px_rgba(5,213,250,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 ml-2 fill-current" />}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* DESNA STRANA: Informacije i Istorija */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-12 relative z-20">
              
              <div className="text-center lg:text-left space-y-4 max-w-2xl">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  {activeStation.live?.is_live && (
                    <span className="bg-zazu-red/10 text-zazu-red border border-zazu-red/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center">
                      <span className="w-2 h-2 rounded-full bg-zazu-red animate-pulse mr-2 shadow-[0_0_8px_rgba(255,51,102,1)]"></span>
                      Uživo
                    </span>
                  )}
                  <span className="text-zazu-orange font-black uppercase tracking-[0.15em] text-sm px-4 py-1.5 rounded-full border border-zazu-orange/20 bg-zazu-orange/10">
                    {activeStation.name}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-lg break-words whitespace-normal line-clamp-3">
                  {currentSong?.title || 'Zazu Stream'}
                </h1>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zazu-turquoise tracking-wide">
                  {currentSong?.artist || 'Otkrivanje zvuka...'}
                </h2>
              </div>

              {/* ISTORIJA PJESAMA (Jedna kolona) */}
              {songHistory.length > 0 && (
                <div className="pt-6 border-t border-gray-800 max-w-xl">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                    <Disc className="w-5 h-5 mr-3" /> Prethodno na radiju
                  </h3>
                  
                  <div className="flex flex-col space-y-4">
                    {songHistory.slice(0, 5).map((historyItem: any, i: number) => {
                      const histArt = historyItem.song.art || FALLBACK_ART;
                      return (
                        <div key={historyItem.sh_id || i} className="flex items-center group bg-zazu-dark/30 p-3 rounded-xl hover:bg-zazu-dark transition-colors border border-transparent hover:border-gray-800">
                          <img src={histArt} alt="Art" className="w-14 h-14 rounded-md object-cover mr-4 opacity-80 group-hover:opacity-100 shadow-md" />
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-white font-bold text-sm truncate group-hover:text-zazu-turquoise transition-colors">
                              {historyItem.song.title}
                            </span>
                            <span className="text-gray-400 text-xs truncate uppercase tracking-wider mt-1">
                              {historyItem.song.artist}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}