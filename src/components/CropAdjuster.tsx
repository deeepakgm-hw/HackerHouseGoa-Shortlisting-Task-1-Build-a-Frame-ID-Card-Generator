'use client';

import React, { useRef, useEffect, useState, PointerEvent } from 'react';
import { ZoomIn, Move, RefreshCw } from 'lucide-react';
import { ImageSettings, BuilderDetails, drawPfpFrame, drawBuilderCard } from '../lib/canvasDraw';

interface CropAdjusterProps {
  photoUrl: string;
  isCard: boolean;
  settings: ImageSettings;
  onChange: (settings: ImageSettings) => void;
  details: BuilderDetails;
  variantIndex: number;
}

export default function CropAdjuster({
  photoUrl,
  isCard,
  settings,
  onChange,
  details,
  variantIndex,
}: CropAdjusterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load the image
  useEffect(() => {
    if (!photoUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [photoUrl]);

  // Redraw canvas on settings or state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isCard) {
      drawBuilderCard(canvas, image, settings, details, variantIndex);
    } else {
      drawPfpFrame(canvas, image, settings, variantIndex);
    }
  }, [image, isCard, settings, details, variantIndex]);

  // Pointer event handlers for dragging (Mouse + Touch support via pointer API)
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - settings.panX,
      y: e.clientY - settings.panY,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    onChange({
      ...settings,
      panX: newPanX,
      panY: newPanY,
    });
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      zoom: parseFloat(e.target.value),
    });
  };

  const handleReset = () => {
    onChange({
      zoom: 1.0,
      panX: 0,
      panY: 0,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto text-[#0b4f30]">
      <div className="text-center space-y-1.5">
        <h3 className="font-heading-lg text-[#faf8f0] uppercase">
          FRAME YOUR BUILD.
        </h3>
        <p className="font-body-md text-[#faf8f0]/85 font-sans leading-relaxed">
          Drag your photo to position it inside the frame. Use scale slider to fit.
        </p>
      </div>

      {/* Interactive Drag Container (Retro poster frame) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative touch-none cursor-move select-none overflow-hidden border-3 border-[#0a2e1d] bg-[#faf8f0] shadow-[8px_8px_0px_0px_#0a2e1d] group"
        style={{
          width: 'min(100%, 350px)',
          aspectRatio: isCard ? '4/5' : '1/1',
        }}
      >
        <canvas
          ref={canvasRef}
          width={isCard ? 1080 : 1080}
          height={isCard ? 1350 : 1080}
          className="w-full h-full pointer-events-none"
        />
        {/* Glow indicator on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#ff007f]/45 pointer-events-none transition-colors duration-300" />
      </div>

      {/* Control sliders */}
      <div className="w-full px-4 flex flex-col gap-4 bg-[#faf8f0] p-5 border-3 border-[#0a2e1d] shadow-[4px_4px_0px_0px_#0a2e1d]">
        <div className="flex items-center justify-between">
          <span className="font-label-lg text-[#0a2e1d] flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-[#ff007f]" /> Scale Image
          </span>
          <span className="font-label-lg text-[#0a2e1d]/85">{settings.zoom.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.05"
            value={settings.zoom}
            onChange={handleZoomChange}
            className="w-full h-2 bg-[#faf8f0] border-2 border-[#0a2e1d] rounded-lg appearance-none cursor-pointer accent-[#ff007f] focus:outline-none"
          />
          <button
            onClick={handleReset}
            type="button"
            className="p-2 text-[#0b4f30] hover:text-[#faf8f0] border-2 border-[#0a2e1d] bg-[#faf8f0] hover:bg-[#ff007f] transition-colors cursor-pointer"
            title="Reset position"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
