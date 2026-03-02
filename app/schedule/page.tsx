'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRadio } from '../../context/RadioContext';
import { Clock, Radio, Info, Disc, X, Calendar as CalendarIcon, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Struktura podataka koju dobijamo sa AzuraCast-a
interface ScheduleItem {
  id: number;
  name: string;
  description: string; // Ovdje povlačimo opis i playlistu
  start_timestamp: number;
  end_timestamp: number;
  is_now: boolean;
}

export default function SchedulePage() {
  const { stations, activeStation } = useRadio();
  
  // Stanja aplikacije
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stanje za Pop-up prozor (Modal)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // Postavljanje početnog taba na stanicu koja trenutno svira
  useEffect(() => {
    if (selectedTabId === null && stations.length > 0) {
      setSelectedTabId(activeStation?.id || stations[0].id);
    }
  }, [stations, activeStation, selectedTabId]);

  // Povlačenje rasporeda kada se promijeni tab
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

  // Formatiranje vremena
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
  };

  const selectedStation = stations.find(s => s.id === selectedTabId);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      
      {/* HEADER */}
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-600/20 blur-[60px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 relative z-10">
          Radio <span className="text-orange-500">Raspored</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto relative z-10">
          Pretraži raspored za sve naše stanice. Trenutno pregledaš: <strong className="text-white">{selectedStation?.name || '...'}</strong>
        </p>
      </div>

      {/* TABOVI (STANICE) */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
        {stations.map((station) => {
          const isActiveTab = selectedTabId === station.id;
          return (
            <button
              key={station.id}
              onClick={() => setSelectedTabId(station.id)}
              className={`flex items-center px-6 py-3 rounded-full font-bold uppercase tracking-wider transition-all duration-300 ${
                isActiveTab 
                  ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] border-2 border-orange-400' 
                  : 'bg-[#12141d] text-slate-400 border-2 border-[#1f2230] hover:border-orange-500/50 hover:text-white'
              }`}
            >
              <Disc className={`w-5 h-5 mr-2 ${isActiveTab ? 'animate-spin-slow text-white' : 'text-slate-500'}`} />
              {station.name}
            </button>
          );
        })}
      </div>

      {/* SADRŽAJ (TIMELINE) */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : schedule.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#12141d]/80 backdrop-blur-md border border-[#1f2230] rounded-3xl p-12 text-center shadow-2xl relative z-10"
        >
          <div className="w-20 h-20 bg-[#1a1c2e] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#2a2d3d]">
            <Info className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Nema zakazanih emisija</h3>
          <p className="text-slate-400">
            Za <strong className="text-orange-400">{selectedStation?.name}</strong> trenutno svira AutoDJ ili raspored još nije unesen.
          </p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Centralna magistrala */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/50 via-[#1f2230] to-transparent -translate-x-1/2 rounded-full"></div>

          <div className="space-y-12 relative z-10">
            <AnimatePresence mode="popLayout">
              {schedule.map((item, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    key={`${selectedTabId}-${item.id}`}
                    onClick={() => setSelectedEvent(item)} // KLIK OTVARA MODAL
                    className={`flex flex-col md:flex-row items-center cursor-pointer group ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:block w-1/2"></div>
                    
                    {/* Tačka na liniji */}
                    <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-[#0a0c14] z-20 ${item.is_now ? 'bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.8)]' : 'bg-[#2a2d3d]'}`}>
                      {item.is_now && <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-50"></div>}
                    </div>

                    {/* Kartica emisije */}
                    <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                      <div className={`bg-[#12141d] border-2 transition-all duration-300 rounded-2xl p-6 shadow-xl relative overflow-hidden group ${item.is_now ? 'border-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.15)]' : 'border-[#1f2230] hover:border-orange-500/50 hover:bg-[#161925]'}`}>
                        
                        {item.is_now && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-red-500"></div>
                        )}

                        <div className={`flex flex-wrap items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                          {item.is_now && (
                            <span className="bg-red-500/20 text-red-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/30 flex items-center">
                              <Radio className="w-3 h-3 mr-1 animate-pulse" /> Uživo
                            </span>
                          )}
                          <div className="flex items-center text-slate-400 bg-[#0a0c14] px-3 py-1 rounded-full border border-[#1f2230]">
                            <Clock className="w-3 h-3 mr-2 text-orange-500" />
                            <span className="text-sm font-bold uppercase tracking-wider">
                              {formatTime(item.start_timestamp)} - {formatTime(item.end_timestamp)}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 uppercase">{item.name}</h3>
                        <p className="text-orange-500/80 text-xs mt-3 uppercase tracking-widest flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 justify-start md:justify-end">
                          <Info className="w-4 h-4 mr-1" /> Klikni za detalje
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* MODAL / POP-UP PROZOR */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-[#0a0c14]/90 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-gradient-to-b from-[#1a1c2e] to-[#12141d] border border-orange-500/30 w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-orange-600/20 p-4 rounded-full border border-orange-500/30">
                    <Music className="w-6 h-6 text-orange-500" />
                  </div>
                  <button 
                    title='event'
                    onClick={() => setSelectedEvent(null)} 
                    className="bg-[#0a0c14] p-2 rounded-full text-slate-500 hover:text-white hover:bg-orange-600 transition-colors border border-[#1f2230]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h2 className="text-3xl font-black text-white uppercase mb-4 leading-tight">
                  {selectedEvent.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div className="flex items-center text-sm uppercase tracking-widest bg-[#0a0c14] px-4 py-2 rounded-full border border-[#1f2230] text-slate-300">
                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                    {formatTime(selectedEvent.start_timestamp)} - {formatTime(selectedEvent.end_timestamp)}
                  </div>
                </div>

                <div className="bg-[#0a0c14] p-6 rounded-2xl border border-[#1f2230] shadow-inner mb-8">
                  <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" /> O Emisiji / Playlista
                  </h4>
                  <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {selectedEvent.description || "Za ovu emisiju trenutno nema unesenog opisa ili specijalne playliste. Pripremite se za vrhunski Zazu odabir muzike!"}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]"
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