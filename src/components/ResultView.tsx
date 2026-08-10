'use client';

import React, { useState } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Edit, Clipboard, Check, Loader2, AlertCircle } from 'lucide-react';

interface ResultViewProps {
  imageDataUrl: string;
  name: string;
  isCard: boolean;
  onEditDetails: () => void;
  onRestart: () => void;
}

export default function ResultView({
  imageDataUrl,
  name,
  isCard,
  onEditDetails,
  onRestart,
}: ResultViewProps) {
  const [sharing, setSharing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFilename = () => {
    const baseName = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'builder';
    const type = isCard ? 'builder-card' : 'pfp-frame';
    return `${baseName}-hhgoa-2026-${type}.png`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = getFilename();
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareToX = async () => {
    setSharing(true);
    setError(null);

    const caption = `Framed for HH Goa 2026! 🚀\n\nBuilding, shipping, and showing up in Goa.\n\n#FrameInGoa`;

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl,
          filename: getFilename(),
        }),
      });

      const result = await response.json();

      if (result.success && result.url) {
        const host = window.location.origin;
        const pageUrl = `${host}/share/badge?img=${encodeURIComponent(result.url)}&name=${encodeURIComponent(name || 'Builder')}`;
        setShareUrl(pageUrl);

        const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(pageUrl)}`;
        window.open(xUrl, '_blank', 'noopener,noreferrer');
      } else {
        await navigator.clipboard.writeText(caption);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 3000);

        setError('Vercel Blob token is missing. Sharing via direct tweet text, please download and attach your badge manually.');
        
        const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}`;
        window.open(xUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: unknown) {
      console.error('Sharing failed:', err);
      setError('Could not generate share URL. Sharing via direct tweet text, please download and attach your badge manually.');
      
      const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}`;
      window.open(xUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fadeIn text-[#0b4f30]">
      {/* Dynamic reveal title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] text-[10px] font-mono tracking-wider mb-3">
          ✦ COMPOSITION LOCKED ✦
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-serif uppercase tracking-tight text-[#faf8f0] mb-2 leading-tight">
          YOUR BUILD IS<br/>
          <span className="text-[#fadb14] drop-shadow-md">GOA READY.</span>
        </h2>
        <p className="text-[#faf8f0]/85 text-xs font-mono max-w-xs mx-auto">
          Pass generated successfully. Download and share to the hacker wall.
        </p>
      </div>

      {/* Generated Preview Card */}
      <div className="relative overflow-hidden border-3 border-[#0a2e1d] bg-[#faf8f0] p-3 shadow-[8px_8px_0px_0px_#0a2e1d]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUrl}
          alt="HH Goa Generated Badge"
          className="w-full h-auto object-contain border-2 border-[#0a2e1d]/20 shadow-inner"
        />
      </div>

      {/* Status messages */}
      {error && (
        <div className="p-3.5 border-2 border-[#0a2e1d] bg-[#faf8f0] flex items-start gap-3 text-[#ff007f] text-xs font-mono shadow-[3px_3px_0px_0px_#0a2e1d]">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sharing link */}
      {shareUrl && (
        <div className="p-4 border-2 border-[#0a2e1d] bg-[#faf8f0] flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#0a2e1d]">
          <div className="truncate text-xs text-[#0a2e1d]/75 font-mono select-all">
            {shareUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#0a2e1d] hover:bg-[#ff007f] hover:text-[#faf8f0] text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" /> Copy URL
              </>
            )}
          </button>
        </div>
      )}

      {/* CTAs styled as retro poster buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleDownload}
          className="retro-button-yellow py-3.5 px-6 flex items-center justify-center gap-2"
        >
          <Download className="w-4.5 h-4.5" />
          DOWNLOAD BADGE
        </button>

        <button
          onClick={handleShareToX}
          disabled={sharing}
          className="retro-button-pink py-3.5 px-6 flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {sharing ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              POSTING LINK...
            </>
          ) : (
            <>
              <Share2 className="w-4.5 h-4.5" />
              SHARE TO X
            </>
          )}
        </button>
      </div>

      {/* Options */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#faf8f0]/10">
        {isCard && (
          <button
            onClick={onEditDetails}
            className="text-xs font-black uppercase font-vt text-[#faf8f0] hover:text-[#fadb14] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" /> EDIT DETAILS
          </button>
        )}
        <button
          onClick={onRestart}
          className="text-xs font-black uppercase font-vt text-[#faf8f0] hover:text-[#fadb14] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> CREATE ANOTHER
        </button>
      </div>
    </div>
  );
}
