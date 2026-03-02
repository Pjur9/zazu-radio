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
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Radio className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-100 tracking-tight">Premium<span className="text-indigo-400">Radio</span></span>
          </Link>

          {/* Meni linkovi */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-indigo-400 border-b-2 border-indigo-400' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Ovdje ćemo kasnije ubaciti tvoj "Language Switcher" (BS/EN/DE) */}
          <div className="hidden md:block">
            <span className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-800 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">
              Jezik (Uskoro)
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}