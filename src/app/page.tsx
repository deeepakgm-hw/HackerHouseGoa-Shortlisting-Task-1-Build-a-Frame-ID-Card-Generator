import React from 'react';
import { Sparkles, Compass, Users } from 'lucide-react';
import Generator from '../components/Generator';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b4f30] text-[#faf8f0] flex flex-col items-center relative overflow-hidden font-serif select-none">
      {/* Background paper texture & grids are managed globally via body CSS */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] aspect-square rounded-full bg-[#fadb14]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-[#ff007f]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl px-6 py-4 flex items-center justify-between border-b-3 border-[#0a2e1d] z-20 bg-[#0b4f30]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#0a2e1d] bg-[#fadb14] flex items-center justify-center font-bold text-lg text-[#0b4f30] shadow-[2px_2px_0px_0px_#0a2e1d] rotate-[-2deg]">
            H
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-widest text-[#faf8f0] leading-none font-serif">HH GOA</h1>
            <span className="text-[10px] font-black text-[#fadb14] tracking-widest font-mono">BUILDER HOUSE 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://x.com/hashtag/FrameInGoa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-2 border-2 border-[#0a2e1d] bg-[#faf8f0] hover:bg-[#ff007f] hover:text-[#faf8f0] text-[#0b4f30] font-black font-mono tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0a2e1d]"
          >
            <Compass className="w-3.5 h-3.5 text-[#0b4f30]" />
            <span className="hidden sm:inline">JOIN BUILDER WALL</span>
            <span className="sm:hidden">WALL ↗</span>
          </a>
        </div>
      </header>

      {/* Main Section */}
      <main className="w-full max-w-6xl px-6 py-4 md:py-8 flex-1 flex flex-col items-center justify-center z-20">
        <Generator />
      </main>

      {/* Subtle Community Counter Footer (Retro card layout style) */}
      <div className="w-full max-w-4xl px-6 pb-8 z-20">
        <div className="p-5 border-3 border-[#0a2e1d] bg-[#faf8f0] text-[#0b4f30] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-[4px_4px_0px_0px_#0a2e1d]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 border-2 border-[#0a2e1d] bg-[#ff007f] flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_0px_#0a2e1d] rotate-[3deg]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold uppercase font-serif text-[#0b4f30]">Join the Builders in Goa</h4>
              <p className="text-[#0a2e1d]/75 text-xs font-mono">Generate your pass, tweet it on social media, and unlock your house access code.</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] text-xs font-extrabold font-mono shadow-[2px_2px_0px_0px_#0a2e1d] rotate-[-1deg]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" /> #FrameInGoa
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[#faf8f0]/40 text-xs py-6 border-t border-[#faf8f0]/10 z-20 font-mono">
        <p>© 2026 Hacker House Goa. Built for the builder community.</p>
      </footer>
    </div>
  );
}
