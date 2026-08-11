'use client';

import React, { useState } from 'react';
import { Download, Share2, RefreshCw, Edit, Clipboard, Check, Loader2, AlertCircle } from 'lucide-react';
import { createXShareUrl } from '../lib/shareUtils';

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

    const caption = `Just framed my Hacker House Goa 2026 builder identity! 🚀\nBuilding, creating & shipping from Goa.\n#FrameInGoa`;

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

        const xUrl = createXShareUrl({ text: caption, shareUrl: pageUrl });
        window.open(xUrl, '_blank', 'noopener,noreferrer');
      } else {
        setError(`Unable to create the shareable image right now. Please download the ${isCard ? 'pass' : 'frame'} instead.`);
      }
    } catch (err: unknown) {
      console.error('Sharing failed:', err);
      setError(`Unable to create the shareable image right now. Please download the ${isCard ? 'pass' : 'frame'} instead.`);
    } finally {
      setSharing(false);
    }
  };

  const handleNativeShare = async () => {
    const caption = `Just framed my Hacker House Goa 2026 builder identity! 🚀\nBuilding, creating & shipping from Goa.\n#FrameInGoa`;
    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], getFilename(), { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `HH Goa 2026 ${isCard ? 'Pass' : 'Frame'}`,
          text: caption,
        });
      }
    } catch (e) {
      console.warn('Native share failed:', e);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] font-caption tracking-wider mb-3 uppercase">
          ✦ COMPOSITION LOCKED ✦
        </div>
        <h2 className="font-display-lg text-[#faf8f0] uppercase tracking-tight mb-2">
          YOUR BUILD IS<br/>
          <span className="text-[#fadb14] drop-shadow-md">GOA READY.</span>
        </h2>
        <p className="text-[#faf8f0]/85 font-body-md max-w-xs mx-auto leading-relaxed">
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
        <div className="p-3.5 border-2 border-[#0a2e1d] bg-[#faf8f0] flex items-start gap-3 text-[#ff007f] text-sm font-mono shadow-[3px_3px_0px_0px_#0a2e1d] font-bold">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sharing link */}
      {shareUrl && (
        <div className="p-4 border-2 border-[#0a2e1d] bg-[#faf8f0] flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#0a2e1d]">
          <div className="truncate text-sm text-[#0a2e1d]/75 font-mono select-all">
            {shareUrl}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#0a2e1d] hover:bg-[#ff007f] hover:text-[#faf8f0] font-label-md transition-colors cursor-pointer"
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
          type="button"
          onClick={handleDownload}
          className="retro-button-yellow py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4.5 h-4.5" />
          <span className="font-label-lg text-base tracking-wider uppercase">DOWNLOAD {isCard ? 'PASS' : 'FRAME'}</span>
        </button>

        <button
          type="button"
          onClick={handleShareToX}
          disabled={sharing}
          className="retro-button-pink py-3.5 px-6 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
        >
          {sharing ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span className="font-label-lg text-base tracking-wider">POSTING LINK...</span>
            </>
          ) : (
            <>
              <Share2 className="w-4.5 h-4.5" />
              <span className="font-label-lg text-base tracking-wider">SHARE TO X</span>
            </>
          )}
        </button>
      </div>

      {/* Optional native mobile share button */}
      {typeof navigator !== 'undefined' && navigator.share !== undefined && (
        <div className="pt-1">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-3 bg-[#faf8f0] text-[#0b4f30] hover:bg-[#ff007f] hover:text-[#faf8f0] border-2 border-[#0a2e1d] font-label-md uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#0a2e1d] transition-all flex items-center justify-center gap-2 rounded-lg"
          >
            <Share2 className="w-4 h-4" />
            <span>Send to Mobile / Share...</span>
          </button>
        </div>
      )}

      {/* Options */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#faf8f0]/10">
        {isCard && (
          <button
            type="button"
            onClick={onEditDetails}
            className="font-label-lg text-[#faf8f0] hover:text-[#fadb14] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" /> EDIT DETAILS
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="font-label-lg text-[#faf8f0] hover:text-[#fadb14] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> CREATE ANOTHER
        </button>
      </div>
    </div>
  );
}
