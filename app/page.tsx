'use client'; 

import { useAudioStore } from '../store/useAudioStore';
import { Play, Radio, Music, Disc, Bird } from 'lucide-react';
import { motion } from 'framer-motion';

const DEMO_STATIONS = [
  {
    id: '1',
    name: 'Indie & Rock',
    listen_url: 'https://radio.zazuradio.com/listen/zazu_radio/radio.mp3',
    genre: 'Rock n Roll / Indie',
    description: 'Gitare, dobar ritam i zvuk sa pucketanjem.',
  },
  {
    id: 'rock',
    name: 'Zazu Rock',
    listen_url: 'https://radio.zazuradio.com/listen/zazu_rock/radio.mp3',
    api_url: 'https://radio.zazuradio.com/api/nowplaying/zazu_rock'
  },
];

export default function Home() {
  const { currentStation, setCurrentStation, isPlaying, togglePlayPause, songHistory } = useAudioStore();

  const handleStationClick = (station: any) => {
    if (currentStation?.id === station.id) {
      togglePlayPause();
    } else {
      setCurrentStation(station);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20">
      
      {/* Hero Sekcija */}
      <div className="mb-24 text-center relative">
        {/* Ikona ptice sa vatrenim odsjajem */}
        <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-orange-600 blur-[60px] opacity-40 rounded-full"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#1a1c2e] to-[#0a0c14] border border-orange-500/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.5)]">
                <Bird className="w-12 h-12 text-orange-500" />
            </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-orange-200 to-slate-100 mb-6 tracking-tight uppercase">
          Hornbill <span className="text-orange-500">Vinyl</span> Radio
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          Tvoj zvuk, serviran na vrućem vosku. Retro vajb, moderan stream.
        </p>
      </div>

      {/* Grid sa VINYL Stanicama */}
      <div className="mb-20">
        <div className="flex items-center mb-12">
            <Disc className="w-8 h-8 mr-4 text-orange-500 animate-spin-slow" />
            <h2 className="text-3xl font-bold text-slate-100 tracking-wide uppercase">
            Kolekcija Ploča
            </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 px-4">
          {DEMO_STATIONS.map((station) => {
            const isThisStationPlaying = currentStation?.id === station.id && isPlaying;

            return (
              <div 
                key={station.id}
                className={`relative group cursor-pointer rounded-3xl p-8 transition-all duration-500 ${
                  isThisStationPlaying 
                    ? 'bg-gradient-to-br from-[#1a1c2e] to-[#0a0c14] border-2 border-orange-500/50 shadow-[0_0_60px_rgba(234,88,12,0.3)]' 
                    : 'bg-[#12141d] border-2 border-[#1f2230] hover:border-orange-500/30 hover:bg-[#151824]'
                }`}
                onClick={() => handleStationClick(station)}
              >
                <div className="flex flex-col md:flex-row items-center">
                    {/* LIJEVI DIO: Vinyl Ploča koja se okreće */}
                    <div className="relative w-48 h-48 flex-shrink-0 mb-6 md:mb-0 md:mr-10">
                        {/* Pozadinski sjaj kad je aktivno */}
                        {isThisStationPlaying && <div className="absolute inset-0 bg-orange-600 rounded-full blur-[50px] opacity-40"></div>}
                        
                        {/* Glavna ploča */}
                        <motion.div
                             animate={{ rotate: isThisStationPlaying ? 360 : 0 }}
                             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                             className={`w-full h-full rounded-full bg-[#0a0a0a] border-4 ${isThisStationPlaying ? 'border-orange-500' : 'border-[#2a2d3d]'} flex items-center justify-center relative overflow-hidden shadow-2xl`}
                             style={{ backgroundImage: 'repeating-radial-gradient(circle at center, #1a1a1a 0, #1a1a1a 2px, #0a0a0a 3px, #0a0a0a 6px)' }} // Vinyl brazde
                        >
                            {/* Centar ploče (Label) */}
                            <div className={`w-20 h-20 rounded-full ${isThisStationPlaying ? 'bg-orange-600' : 'bg-[#2a2d3d]'} flex items-center justify-center border-4 border-[#0a0a0a] z-10 transition-colors`}>
                                {isThisStationPlaying ? (
                                    <Music className="w-8 h-8 text-white animate-pulse" />
                                ) : (
                                    <Radio className="w-8 h-8 text-slate-500 group-hover:text-slate-300" />
                                )}
                            </div>
                        </motion.div>

                        {/* Play dugme preko ploče */}
                        <div className={`absolute bottom-0 right-0 translate-x-2 translate-y-2 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 z-20 ${
                            isThisStationPlaying ? 'bg-slate-100 text-orange-600 scale-110' : 'bg-orange-600 text-white group-hover:scale-110 group-hover:bg-orange-500'
                        }`}>
                            {isThisStationPlaying ? (
                            <div className="w-5 h-5 bg-orange-600 rounded-sm" /> 
                            ) : (
                            <Play className="w-7 h-7 ml-1 fill-current" />
                            )}
                        </div>
                    </div>

                    {/* DESNI DIO: Tekst */}
                    <div className="text-center md:text-left">
                        <span className="inline-block px-3 py-1 bg-[#1f2230] rounded text-xs font-bold text-orange-400 mb-4 tracking-wider uppercase border border-orange-500/20">
                            {station.genre}
                        </span>
                        <h3 className="text-3xl font-black text-slate-100 mb-3 uppercase tracking-tight">{station.name}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed text-lg">
                            {station.description}
                        </p>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEKCIJA: Istorija Pjesama (Refined) */}
      {songHistory.length > 0 && (
        <div className="mt-24 mb-12 relative">
          {/* Pozadinski sjaj */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-orange-600/10 blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center justify-center uppercase tracking-wider relative z-10">
            <Music className="w-6 h-6 mr-3 text-orange-500" />
            Upravo Vrti
          </h2>
          
          <div className="bg-[#12141d]/80 backdrop-blur-xl border border-[#1f2230] rounded-3xl p-6 shadow-2xl relative z-10 max-w-4xl mx-auto">
            {songHistory.slice(0, 5).map((historyItem: any, index: number) => (
              <div 
                key={historyItem.sh_id} 
                className={`flex items-center p-5 hover:bg-[#1a1c2e] transition-colors rounded-2xl ${
                  index !== songHistory.slice(0, 5).length - 1 ? 'border-b border-[#1f2230]' : ''
                }`}
              >
                <div className="w-16 h-16 bg-[#0a0a0a] rounded-lg overflow-hidden mr-6 flex-shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-[#2a2d3d] relative group">
                  {historyItem.song.art ? (
                    <img src={historyItem.song.art} alt="Album" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Disc className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-bold text-lg line-clamp-1">{historyItem.song.title}</span>
                    <span className="text-orange-500/80 font-semibold text-sm uppercase tracking-wider">{historyItem.song.artist}</span>
                  </div>
                  
                  <div className="text-slate-500 text-xs mt-3 sm:mt-0 font-bold bg-[#0a0c14] px-4 py-2 rounded-full border border-[#1f2230] uppercase tracking-widest">
                    {Math.round((Date.now() / 1000 - historyItem.played_at) / 60)} MIN AGO
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}