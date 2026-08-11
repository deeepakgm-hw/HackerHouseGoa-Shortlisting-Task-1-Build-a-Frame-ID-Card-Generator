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
      <header className="w-full border-b-3 border-[#0a2e1d] z-20 bg-[#0b4f30]">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Official Hacker House Goa Logo Component */}
          <div className="flex items-center gap-4">
            <div className="relative flex flex-col font-serif text-[#fadb14] leading-none select-none py-1.5 pr-2">
              <span className="text-xl md:text-2xl font-black tracking-wider leading-none">HACKER</span>
              <span className="text-xl md:text-2xl font-black tracking-wider leading-none mt-1">HOUSE</span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-[#ff007f] text-[#fadb14] border-2 border-[#0a2e1d] rounded-full px-2 py-0.5 text-xs md:text-sm font-black tracking-normal rotate-[-10deg] shadow-[2px_2px_0px_0px_#0a2e1d] font-sans">
                  गोवा
                </span>
              </div>
            </div>
            <div className="hidden sm:block border-l-2 border-[#faf8f0]/20 pl-4 space-y-0.5">
              <span className="text-xs font-black text-[#fadb14] tracking-widest font-mono block uppercase leading-none">BUILDER HOUSE</span>
              <span className="text-[11px] font-bold text-[#faf8f0]/70 font-mono block leading-none">OCT 28-31, 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* 2:47 PM Studio Logo */}
            <div className="h-10 md:h-12 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/studio-logo.png"
                alt="2:47 PM Studio Logo"
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </div>
            <a
              href="https://x.com/hashtag/FrameInGoa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2.5 border-2 border-[#0a2e1d] bg-[#faf8f0] hover:bg-[#ff007f] hover:text-[#faf8f0] text-[#0b4f30] font-bold font-mono tracking-wide transition-all duration-200 flex items-center gap-2 shadow-[2px_2px_0px_0px_#0a2e1d] cursor-pointer"
            >
              <Compass className="w-4.5 h-4.5 text-[#0b4f30] shrink-0" />
              <span className="hidden sm:inline">JOIN BUILDER WALL</span>
              <span className="sm:hidden">JOIN WALL ↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="w-full flex-1 flex flex-col z-20">
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
              <h4 className="text-lg md:text-xl font-extrabold uppercase font-serif text-[#0b4f30]">Join the Builders in Goa</h4>
              <p className="text-[#0a2e1d]/85 text-sm font-mono mt-0.5">Generate your pass, tweet it on social media, and unlock your house access code.</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] text-sm font-extrabold font-mono shadow-[2px_2px_0px_0px_#0a2e1d] rotate-[-1deg]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" /> #FrameInGoa
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[#faf8f0]/70 text-sm py-6 border-t border-[#faf8f0]/10 z-20 font-mono">
        <p>© 2026 Hacker House Goa. Built for the builder community.</p>
      </footer>
    </div>
  );
}
