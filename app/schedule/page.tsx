// app/schedule/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAudioStore } from '../../store/useAudioStore';
import { Clock, Radio, Info, Disc, X, Calendar as CalendarIcon, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Struktura podataka koju dobijamo sa AzuraCast-a
interface ScheduleItem {
  id: number;
  name: string;
  description: string;
  start_timestamp: number;
  end_timestamp: number;
  is_now: boolean;
}

export default function SchedulePage() {
  const { stations, activeStationId } = useAudioStore();
  
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // Postavljanje početnog taba
  useEffect(() => {
    if (selectedTabId === null && stations.length > 0) {
      setSelectedTabId(activeStationId || stations[0].id);
    }
  }, [stations, activeStationId, selectedTabId]);

  // Povlačenje rasporeda
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedTabId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`https://radio.zazuradio.com/api/station/${selectedTabId}/schedule`);
        setSchedule(response.data);
      } catch (error) {
        console.error("Greška pri povlačenju rasporeda:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedTabId]);

  // Formatiranje vremena (samo sati i minute)
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
  };

  // Grupišemo raspored po danima
  const groupedSchedule = useMemo(() => {
    const groups: { [key: string]: ScheduleItem[] } = {};
    
    schedule.forEach(item => {
      const date = new Date(item.start_timestamp * 1000);
      let dayName = date.toLocaleDateString('bs-BA', { weekday: 'long', day: 'numeric', month: 'numeric' });
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      if (!groups[dayName]) groups[dayName] = [];
      groups[dayName].push(item);
    });
    
    return groups;
  }, [schedule]);

  const selectedStation = stations.find(s => s.id === selectedTabId);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-16 pb-32">
      
      {/* ---------------------------------------------------------------- */}
      {/* NOVI HEADER: Indie Rock Premium Vibe */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col items-center justify-center mb-24 relative">
        {/* Suptilni tirkizni odsjaj u pozadini teksta */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-zazu-turquoise/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* NASLOV: Gig-poster stil (Ogromno, zbijeno, sa outline efektom) */}
        <h1 className="text-center flex flex-col items-center relative z-10 group cursor-default">
          <span className="text-6xl md:text-[5.5rem] lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
            Zazu
          </span>
          <span 
            className="text-7xl md:text-8xl lg:text-[7.5rem] font-black uppercase tracking-tighter leading-[0.85] text-transparent transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(5,213,250,0.4)]"
            style={{ 
              WebkitTextStroke: '2px var(--color-zazu-turquoise)', // Ovaj trik stvara "Indie/Rock" outline
            }}
          >
            Raspored
          </span>
        </h1>

        {/* PODNASLOV: Editorial / Premium detalj */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-4 relative z-10">
          <div className="h-[1px] w-8 lg:w-16 bg-gray-800 hidden md:block"></div>
          
          <span className="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] lg:tracking-[0.4em]">
            Pregledaš program za
          </span>
          
          {/* Naziv stanice kao naljepnica/bedž */}
          <span className="px-5 py-2 bg-[#050505] border border-gray-800 rounded-full text-zazu-orange text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center">
            <Radio className="w-3 h-3 mr-2 text-zazu-orange/70" />
            {selectedStation?.name || '...'}
          </span>
          
          <div className="h-[1px] w-8 lg:w-16 bg-gray-800 hidden md:block"></div>
        </div>
      </div>
      {/* ---------------------------------------------------------------- */}

      {/* TABOVI (STANICE) */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
        {stations.map((station) => {
          const isActiveTab = selectedTabId === station.id;
          return (
            <button
              key={station.id}
              onClick={() => setSelectedTabId(station.id)}
              className={`flex items-center px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                isActiveTab 
                  ? 'bg-zazu-turquoise text-black shadow-[0_0_20px_rgba(5,213,250,0.4)] scale-105' 
                  : 'bg-zazu-dark text-white border border-gray-800 hover:border-zazu-turquoise/50 hover:text-zazu-turquoise'
              }`}
            >
              <Disc className={`w-4 h-4 mr-2 ${isActiveTab ? 'animate-spin-slow text-black' : 'text-gray-500'}`} />
              {station.name}
            </button>
          );
        })}
      </div>

      {/* SADRŽAJ (TABELA) - Netaknuto */}
      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-12 h-12 border-4 border-zazu-turquoise/30 border-t-zazu-turquoise rounded-full animate-spin"></div>
        </div>
      ) : schedule.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zazu-dark border border-gray-800 rounded-3xl p-12 text-center shadow-2xl relative z-10"
        >
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
            <Radio className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Nema zakazanih emisija</h3>
          <p className="text-gray-400">
            Za <strong className="text-zazu-turquoise">{selectedStation?.name}</strong> trenutno svira AutoDJ ili raspored još nije unesen.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
        >
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-zazu-dark text-gray-400 text-xs font-black uppercase tracking-[0.2em] border-b border-gray-800">
                <th className="p-5 md:p-6 w-1/4">Vrijeme</th>
                <th className="p-5 md:p-6 w-1/2">Emisija</th>
                <th className="p-5 md:p-6 w-1/4 text-right">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedSchedule).map(([day, items]) => (
                <React.Fragment key={day}>
                  {/* ZAGLAVLJE ZA DAN */}
                  <tr className="bg-[#111] border-b border-gray-800/80">
                    <td colSpan={3} className="p-4 md:p-5 text-zazu-orange font-black uppercase tracking-widest text-xs md:text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-3" /> {day}
                      </div>
                    </td>
                  </tr>
                  
                  {/* EMISIJE ZA TAJ DAN */}
                  {items.map(item => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedEvent(item)}
                      className={`border-b border-gray-800/40 hover:bg-white/5 transition-colors cursor-pointer group ${
                        item.is_now ? 'bg-zazu-red/5' : ''
                      }`}
                    >
                      {/* Vrijeme */}
                      <td className="p-5 md:p-6 text-sm md:text-base font-bold text-gray-300 whitespace-nowrap">
                        {formatTime(item.start_timestamp)} <span className="text-gray-600 mx-1">-</span> {formatTime(item.end_timestamp)}
                      </td>
                      
                      {/* Naziv emisije i status */}
                      <td className="p-5 md:p-6">
                        <div className="flex items-center gap-3">
                          {item.is_now && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-zazu-red animate-pulse shadow-[0_0_10px_rgba(255,51,102,1)] shrink-0"></span>
                          )}
                          <span className={`font-black uppercase tracking-wide text-base md:text-lg line-clamp-1 ${
                            item.is_now ? 'text-zazu-red' : 'text-white group-hover:text-zazu-turquoise transition-colors'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      
                      {/* Akcija / Detalji */}
                      <td className="p-5 md:p-6 text-right">
                        <button className="flex items-center justify-end w-full text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-zazu-orange transition-colors">
                          <span className="hidden sm:inline mr-2">Info</span>
                          <Info className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* MODAL / POP-UP PROZOR - Netaknuto */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-zazu-dark border border-gray-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-zazu-turquoise/10 p-4 rounded-full border border-zazu-turquoise/20">
                    <Music className="w-6 h-6 text-zazu-turquoise" />
                  </div>
                  <button 
                    title='event'
                    onClick={() => setSelectedEvent(null)} 
                    className="bg-black p-2 rounded-full text-gray-500 hover:text-white hover:bg-zazu-red transition-colors border border-gray-800"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h2 className="text-3xl font-black text-white uppercase mb-4 leading-tight">
                  {selectedEvent.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div className="flex items-center text-sm uppercase tracking-widest bg-black px-4 py-2 rounded-full border border-gray-800 text-gray-300">
                    <Clock className="w-4 h-4 mr-2 text-zazu-orange" />
                    {formatTime(selectedEvent.start_timestamp)} - {formatTime(selectedEvent.end_timestamp)}
                  </div>
                  {selectedEvent.is_now && (
                     <div className="flex items-center text-sm uppercase tracking-widest bg-zazu-red/10 px-4 py-2 rounded-full border border-zazu-red/30 text-zazu-red font-bold">
                       <Radio className="w-4 h-4 mr-2 animate-pulse" /> Uživo
                     </div>
                  )}
                </div>

                <div className="bg-[#050505] p-6 rounded-xl border border-gray-800 shadow-inner mb-8">
                  <h4 className="text-xs font-black text-zazu-turquoise uppercase tracking-widest mb-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" /> O Emisiji / Playlista
                  </h4>
                  <div className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                    {selectedEvent.description || "Za ovu emisiju trenutno nema unesenog opisa ili specijalne playliste. Pripremite se za vrhunski Zazu odabir muzike!"}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Zatvori
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}