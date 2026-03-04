// components/layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Početna', path: '/', icon: <Radio className="w-5 h-5 mr-2" /> },
    { name: 'Raspored', path: '/schedule', icon: <Calendar className="w-5 h-5 mr-2" /> },
  ];

  return (
    // Uklonjen max-w-7xl, sada koristimo w-full i px-6 ili px-10 za prozračnost
    <nav className="bg-black/80 backdrop-blur-xl border-b border-[#1f2230] sticky top-0 z-50 shadow-lg">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO SKROZ LIJEVO */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/images/Zazu-Radio-logo.png" 
              alt="Zazu Logo" 
              className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(5,213,250,0.2)]" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Link>

          {/* MENI LINKOVI */}
          <div className="flex space-x-10 h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center text-sm font-bold uppercase tracking-widest transition-all h-full border-b-2 mt-[2px] ${
                    isActive 
                      ? 'text-zazu-turquoise border-zazu-turquoise drop-shadow-[0_0_10px_rgba(5,213,250,0.5)]' 
                      : 'text-gray-400 border-transparent hover:text-white hover:border-[#1f2230]'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}