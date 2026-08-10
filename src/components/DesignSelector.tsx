'use client';

import React from 'react';
import { User, Award, Layers } from 'lucide-react';

interface DesignSelectorProps {
  isCard: boolean;
  setIsCard: (isCard: boolean) => void;
  variantIndex: number;
  setVariantIndex: (variantIndex: number) => void;
}

const VARIANTS = [
  { name: 'Goa Sunset', desc: 'Sunset & palm trees theme' },
  { name: 'Retro Green', desc: 'Classic official green theme' },
  { name: 'Hacker Stamp', desc: 'Minimalist brand print theme' },
];

export default function DesignSelector({
  isCard,
  setIsCard,
  variantIndex,
  setVariantIndex,
}: DesignSelectorProps) {
  return (
    <div className="w-full space-y-6 bg-[#faf8f0] p-6 border-3 border-[#0a2e1d] shadow-[4px_4px_0px_0px_#0a2e1d] text-[#0b4f30]">
      {/* Format Selectors */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e1d] font-vt block border-b border-[#0a2e1d]/20 pb-1">
          ✦ Select Badge Format
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setIsCard(false)}
            className={`flex flex-col items-center justify-center p-4 border-3 transition-all text-center gap-2 cursor-pointer outline-none ${
              !isCard
                ? 'border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d] translate-x-[-2px] translate-y-[-2px]'
                : 'border-[#0a2e1d]/40 bg-[#faf8f0] hover:border-[#0a2e1d] text-[#0b4f30]/65 hover:text-[#0b4f30]'
            }`}
          >
            <User className="w-6 h-6 shrink-0" />
            <div>
              <span className="block text-xs font-black uppercase tracking-wider font-vt">PFP Overlay</span>
              <span className="block text-[9px] text-[#0a2e1d]/70 mt-0.5">Avatar frame overlay</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsCard(true)}
            className={`flex flex-col items-center justify-center p-4 border-3 transition-all text-center gap-2 cursor-pointer outline-none ${
              isCard
                ? 'border-[#0a2e1d] bg-[#ff007f] text-[#faf8f0] shadow-[3px_3px_0px_0px_#0a2e1d] translate-x-[-2px] translate-y-[-2px]'
                : 'border-[#0a2e1d]/40 bg-[#faf8f0] hover:border-[#0a2e1d] text-[#0b4f30]/65 hover:text-[#0b4f30]'
            }`}
          >
            <Award className="w-6 h-6 shrink-0" />
            <div>
              <span className="block text-xs font-black uppercase tracking-wider font-vt">Builder Card</span>
              <span className="block text-[9px] hover:text-[#faf8f0]/80 mt-0.5">Official pass card</span>
            </div>
          </button>
        </div>
      </div>

      {/* Style Variation Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e1d] font-vt block border-b border-[#0a2e1d]/20 pb-1">
          ✦ Select Art Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {VARIANTS.map((v, idx) => (
            <button
              key={v.name}
              type="button"
              onClick={() => setVariantIndex(idx)}
              className={`flex flex-col items-center justify-center p-3 border-2 transition-all text-center cursor-pointer outline-none text-xs font-black uppercase font-vt ${
                variantIndex === idx
                  ? 'border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] shadow-[2px_2px_0px_0px_#0a2e1d] translate-x-[-1px] translate-y-[-1px]'
                  : 'border-[#0a2e1d]/30 bg-[#faf8f0] hover:border-[#0a2e1d] text-[#0b4f30]/70 hover:text-[#0b4f30]'
              }`}
            >
              <span className="block text-[11px] tracking-tight">{v.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
