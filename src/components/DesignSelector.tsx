'use client';

import React from 'react';
import { User, Award } from 'lucide-react';

interface DesignSelectorProps {
  isCard?: boolean;
  setIsCard?: (isCard: boolean) => void;
  variantIndex: number;
  setVariantIndex: (variantIndex: number) => void;
  hideFormat?: boolean;
}

const VARIANTS = [
  { name: 'Goa Sunset', desc: 'Sunset & palm trees theme' },
  { name: 'Retro Green', desc: 'Classic official green theme' },
  { name: 'Hacker Stamp', desc: 'Minimalist brand print theme' },
];

export default function DesignSelector({
  isCard = false,
  setIsCard = () => {},
  variantIndex,
  setVariantIndex,
  hideFormat = false,
}: DesignSelectorProps) {
  const getThemeButtonStyle = (idx: number, isActive: boolean) => {
    if (!isActive) {
      return 'border-[#0a2e1d]/40 bg-[#faf8f0] hover:border-[#0a2e1d] text-[#0b4f30]/70 hover:text-[#0b4f30] hover:shadow-[2px_2px_0px_0px_#0a2e1d]';
    }
    
    // Active states with custom, high-visibility themes
    if (idx === 0) {
      // Goa Sunset: warm yellow bg with offset shadow
      return 'border-[#0a2e1d] bg-[#fadb14] text-[#0a2e1d] shadow-[3px_3px_0px_0px_#0a2e1d] translate-x-[-1.5px] translate-y-[-1.5px] font-black';
    } else if (idx === 1) {
      // Retro Green: deep green bg with cream text
      return 'border-[#0a2e1d] bg-[#0b4f30] text-[#faf8f0] shadow-[3px_3px_0px_0px_#0a2e1d] translate-x-[-1.5px] translate-y-[-1.5px] font-black';
    } else {
      // Hacker Stamp: hot pink bg with yellow text
      return 'border-[#0a2e1d] bg-[#ff007f] text-[#fadb14] shadow-[3px_3px_0px_0px_#0a2e1d] translate-x-[-1.5px] translate-y-[-1.5px] font-black';
    }
  };

  return (
    <div className="w-full space-y-6 bg-[#faf8f0] p-6 border-3 border-[#0a2e1d] shadow-[4px_4px_0px_0px_#0a2e1d] text-[#0b4f30]">
      {/* Format Selectors */}
      {!hideFormat && (
        <div className="space-y-3">
          <label className="font-label-lg text-[#0a2e1d] block border-b border-[#0a2e1d]/20 pb-1.5 uppercase">
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
                <span className="block font-label-lg uppercase text-[#0b4f30]">PFP Overlay</span>
                <span className="block font-caption text-[#0a2e1d]/75 mt-0.5 font-sans">Avatar frame overlay</span>
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
                <span className={`block font-label-lg uppercase ${isCard ? 'text-[#faf8f0]' : 'text-[#0b4f30]'}`}>Builder Pass</span>
                <span className={`block font-caption mt-0.5 font-sans ${isCard ? 'text-[#faf8f0]/85' : 'text-[#0a2e1d]/75'}`}>Official pass card</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Style Variation Selector */}
      <div className="space-y-3">
        <label className="font-label-lg text-[#0a2e1d] block border-b border-[#0a2e1d]/20 pb-1.5 uppercase">
          ✦ Select Art Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {VARIANTS.map((v, idx) => {
            const isActive = variantIndex === idx;
            return (
              <button
                key={v.name}
                type="button"
                onClick={() => setVariantIndex(idx)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 border-2 transition-all text-center cursor-pointer outline-none font-label-lg uppercase rounded-lg ${getThemeButtonStyle(idx, isActive)}`}
              >
                <span className="block tracking-tight text-[11px] sm:text-xs">{v.name}</span>
                
                {/* Visual Accent previews */}
                {idx === 0 && (
                  <div className="flex gap-1.5 mt-2 justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fadb14] border border-[#0a2e1d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f] border border-[#0a2e1d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0b4f30] border border-[#0a2e1d]" />
                  </div>
                )}
                {idx === 1 && (
                  <div className="flex gap-1.5 mt-2 justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#faf8f0] border border-[#0a2e1d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0b4f30] border border-[#0a2e1d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fadb14]/60 border border-[#0a2e1d]" />
                  </div>
                )}
                {idx === 2 && (
                  <div className="flex gap-1.5 mt-2 justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f] border border-[#0a2e1d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0a2e1d] border border-[#ff007f]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fadb14] border border-[#0a2e1d]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
