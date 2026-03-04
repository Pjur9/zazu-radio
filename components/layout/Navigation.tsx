'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, Info } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname(); // Da znamo na kojoj smo stranici i ofarbamo to dugme

  const navItems = [
    { name: 'Početna', path: '/', icon: <Radio className="w-5 h-5 mr-2" /> },
    { name: 'Raspored', path: '/schedule', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: 'O Nama', path: '/o-nama', icon: <Info className="w-5 h-5 mr-2" /> },
  ];

  return (
    <nav className="bg-zazu-darker/90 backdrop-blur-xl border-b border-[#1f2230] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO SEKCIJA */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/Zazu-Radio-logo.png" 
              alt="Zazu Logo" 
              className="w-48 h-48 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(5,213,250,0.3)]" 
              onError={(e) => {
                // Ako logo još nije učitan, sakrij ga da ne lomi dizajn
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Link>

          {/* MENI LINKOVI */}
          <div className="hidden md:flex space-x-10 h-full">
            {navItems.map((item) => {
              // Provjera da li je aktivan tab (sa malim fix-om za podstranice)
              const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
              
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center text-sm font-bold uppercase tracking-widest transition-all h-full border-b-2 mt-[2px] ${
                    isActive 
                      ? 'text-zazu-turquoise border-zazu-turquoise drop-shadow-[0_0_10px_rgba(5,213,250,0.5)]' 
                      : 'text-slate-400 border-transparent hover:text-white hover:border-[#1f2230]'
                  }`}
                >
                  {/* Ikonica će dobiti boju teksta iz parent klase automatski */}
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Ovdje ćemo kasnije ubaciti tvoj "Language Switcher" (BS/EN/DE) */}
          <div className="hidden md:block">
            <span className="text-xs font-bold uppercase tracking-widest px-5 py-2.5 bg-[#0f111a] border border-[#1f2230] text-slate-400 rounded-full cursor-pointer hover:border-zazu-turquoise/50 hover:text-zazu-turquoise hover:shadow-[0_0_15px_rgba(5,213,250,0.15)] transition-all">
              Jezik (Uskoro)
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}