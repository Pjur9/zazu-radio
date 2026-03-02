import './globals.css';
import GlobalPlayer from '../components/audio/GlobalPlayer';
import Navigation from '../components/layout/Navigation';

// 1. DODATO: Importujemo tvoj novi RadioContext
import { RadioProvider } from '../context/RadioContext';

export const metadata = {
  title: 'Hornbill Radio | Vinyl Vibe',
  description: 'Najbolji zvuk u retro vinyl stilu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0c14] text-slate-200 flex flex-col min-h-screen relative overflow-x-hidden font-sans">
        
        {/* 2. DODATO: Omotavamo CIJELU aplikaciju u RadioProvider */}
        <RadioProvider>
          
          {/* POZADINSKA SLIKA ZAZU PTICE (Tvoj originalni dizajn ostaje) */}
          <div className="fixed inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
              style={{ 
              backgroundImage: "url('/images/zazu-vinyl-bg.png')",
              mixBlendMode: 'luminosity' 
              }} 
            />
            {/* Tamni gradijent preko slike da tekst bude čitljiv */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c14] via-[#0a0c14]/80 to-[#141824]/50" />
            
            {/* Suptilna tekstura "šuma" (noise) za vinyl osjećaj */}
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
          </div>

          {/* Navigacija */}
          <div className="relative z-40">
            <Navigation />
          </div>

          {/* Glavni sadržaj */}
          <main className="flex-grow pb-36 relative z-10"> 
            {children}
          </main>

          {/* Plejer na dnu */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <GlobalPlayer />
          </div>

        </RadioProvider>
        {/* Kraj RadioProvidera */}

      </body>
    </html>
  );
}