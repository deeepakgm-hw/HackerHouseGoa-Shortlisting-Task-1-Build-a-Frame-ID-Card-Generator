'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Copy, Clipboard, Check, Trash2, ArrowRight, ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import { Crew, Member, calculateCrewClass, calculateCrewStack } from '../lib/crewDb';
import { preloadCrewImages, drawCrewCard, drawCrewPoster, drawCrewPfp, BuilderDetails } from '../lib/canvasDraw';

interface CrewWorkspaceProps {
  initialCode?: string;
  defaultDetails?: BuilderDetails;
  defaultPhotoUrl?: string;
}

export default function CrewWorkspace({ initialCode, defaultDetails, defaultPhotoUrl }: CrewWorkspaceProps) {
  const [crew, setCrew] = useState<Crew | null>(null);
  const [code, setCode] = useState(initialCode || '');
  const [ownerToken, setOwnerToken] = useState('');
  
  // Navigation inside Crew mode
  const [view, setView] = useState<'landing' | 'create' | 'dashboard' | 'join' | 'result'>('landing');
  
  // Forms state
  const [createForm, setCreateForm] = useState({
    name: '',
    tagline: '',
    creatorName: defaultDetails?.name || '',
    creatorRole: defaultDetails?.role || '',
    creatorStack: defaultDetails?.stack || '',
    creatorTwitter: defaultDetails?.twitter || '',
    creatorPhoto: defaultPhotoUrl || '',
  });
  
  const [joinForm, setJoinForm] = useState({ name: '', role: '', stack: '', xHandle: '', photo: '' });
  
  // Update creator form values if parent props load asynchronously
  useEffect(() => {
    if (defaultDetails || defaultPhotoUrl) {
      setCreateForm((prev) => ({
        ...prev,
        creatorName: prev.creatorName || defaultDetails?.name || '',
        creatorRole: prev.creatorRole || defaultDetails?.role || '',
        creatorStack: prev.creatorStack || defaultDetails?.stack || '',
        creatorTwitter: prev.creatorTwitter || defaultDetails?.twitter || '',
        creatorPhoto: prev.creatorPhoto || defaultPhotoUrl || '',
      }));
    }
  }, [defaultDetails, defaultPhotoUrl]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Generated images
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [generatedPosterUrl, setGeneratedPosterUrl] = useState<string | null>(null);
  const [generatedPfpUrl, setGeneratedPfpUrl] = useState<string | null>(null);
  const [activeResultType, setActiveResultType] = useState<'card' | 'poster' | 'pfp'>('card');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  // Load crew from URL parameters or local storage
  useEffect(() => {
    if (initialCode) {
      fetchCrew(initialCode);
    }
  }, [initialCode]);

  // Load owner credentials if stored locally
  useEffect(() => {
    if (crew) {
      const storedToken = localStorage.getItem(`crew-owner-${crew.code}`);
      if (storedToken) {
        setOwnerToken(storedToken);
      }
    }
  }, [crew]);

  const fetchCrew = async (crewCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/crew?code=${crewCode.toUpperCase().trim()}`);
      const data = await res.json();
      if (data.success) {
        setCrew(data.crew);
        setView('dashboard');
      } else {
        setError(data.error || 'Failed to find crew.');
      }
    } catch (err: unknown) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) return;
    
    if (!createForm.creatorName || !createForm.creatorRole || !createForm.creatorStack || !createForm.creatorPhoto) {
      setError('Creator photo, name, stack, and role are required to create a crew.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: createForm.name,
          tagline: createForm.tagline,
          creatorName: createForm.creatorName,
          creatorRole: createForm.creatorRole,
          creatorStack: createForm.creatorStack,
          creatorTwitter: createForm.creatorTwitter,
          creatorPhoto: createForm.creatorPhoto,
        }),
      });
      const data = await res.json();
      
      if (data.success && data.crew) {
        // Save owner credentials locally
        localStorage.setItem(`crew-owner-${data.crew.code}`, data.crew.ownerToken);
        setOwnerToken(data.crew.ownerToken);
        setCrew(data.crew);
        setCode(data.crew.code);
        setView('dashboard');
      } else {
        setError(data.error || 'Failed to create crew.');
      }
    } catch (err: unknown) {
      setError('Failed to connect to builder server.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, role, stack, xHandle, photo } = joinForm;
    if (!name || !role || !stack || !photo) {
      setError('All fields and photo are required to join.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          code,
          name,
          role,
          stack,
          xHandle,
          photo,
        }),
      });
      const data = await res.json();
      
      if (data.success && data.crew) {
        setCrew(data.crew);
        // Reset join form
        setJoinForm({ name: '', role: '', stack: '', xHandle: '', photo: '' });
        setView('dashboard');
      } else {
        setError(data.error || 'Failed to join crew.');
      }
    } catch (err: unknown) {
      setError('Connection failed. Could not join.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this builder from your crew?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          code,
          ownerToken,
          memberId,
        }),
      });
      const data = await res.json();
      
      if (data.success && data.crew) {
        setCrew(data.crew);
      } else {
        alert(data.error || 'Failed to remove member.');
      }
    } catch (err: unknown) {
      alert('Network failure. Could not remove member.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!crew || crew.members.length < 1) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Preload all member photos
      const loadedImages = await preloadCrewImages(crew.members);

      // 2. Render Crew Card (1080 x 1080)
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 1080;
      cardCanvas.height = 1080;
      drawCrewCard(cardCanvas, crew, loadedImages);
      const cardUrl = cardCanvas.toDataURL('image/png');
      setGeneratedCardUrl(cardUrl);

      // 3. Render Crew Poster (1080 x 1350)
      const posterCanvas = document.createElement('canvas');
      posterCanvas.width = 1080;
      posterCanvas.height = 1350;
      drawCrewPoster(posterCanvas, crew, loadedImages);
      const posterUrl = posterCanvas.toDataURL('image/png');
      setGeneratedPosterUrl(posterUrl);

      // 4. Render Crew PFP (1080 x 1080)
      const pfpCanvas = document.createElement('canvas');
      pfpCanvas.width = 1080;
      pfpCanvas.height = 1080;
      drawCrewPfp(pfpCanvas, crew, loadedImages);
      const pfpUrl = pfpCanvas.toDataURL('image/png');
      setGeneratedPfpUrl(pfpUrl);

      setView('result');
    } catch (err: unknown) {
      console.error('Crew rendering failed:', err);
      setError('Failed to assemble builder cards into graphics.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareToX = async () => {
    const activeImage = 
      activeResultType === 'card' ? generatedCardUrl : 
      activeResultType === 'poster' ? generatedPosterUrl : 
      generatedPfpUrl;
    if (!activeImage || !crew) return;
    
    setSharing(true);
    setError(null);

    const builderPlural = crew.members.length === 1 ? 'builder' : 'builders';
    const caption = `Meet ${crew.name} — a crew of ${crew.members.length} ${builderPlural} heading to HH Goa 2026.\n\n${crew.generatedClass} is ready! 🌴\n\n#FrameInGoa`;

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: activeImage,
          filename: `${crew.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-crew.png`,
        }),
      });

      const result = await response.json();

      if (result.success && result.url) {
        const host = window.location.origin;
        const pageUrl = `${host}/share/crew?img=${encodeURIComponent(result.url)}&name=${encodeURIComponent(crew.name)}`;
        setShareUrl(pageUrl);

        const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(pageUrl)}`;
        window.open(xUrl, '_blank', 'noopener,noreferrer');
      } else {
        await navigator.clipboard.writeText(caption);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
        setError('Storage token missing. Opening X share intent; copy caption and attach image manually.');
        
        const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}`;
        window.open(xUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: unknown) {
      console.error('Sharing crew poster failed:', err);
      const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}`;
      window.open(xUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setSharing(false);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/?crew=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCrewCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    if (!crew) return;
    const link = document.createElement('a');
    const suffix = activeResultType === 'card' ? 'card' : activeResultType === 'poster' ? 'poster' : 'pfp';
    link.download = `${crew.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-crew-${suffix}.png`;
    link.href = activeResultType === 'card' ? generatedCardUrl! : activeResultType === 'poster' ? generatedPosterUrl! : generatedPfpUrl!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestart = () => {
    setCrew(null);
    setCode('');
    setOwnerToken('');
    setGeneratedCardUrl(null);
    setGeneratedPosterUrl(null);
    setGeneratedPfpUrl(null);
    setView('landing');
  };

  const inviteLinkUrl = crew ? `${window.location.origin}/?crew=${crew.code}` : '';

  return (
    <div className="w-full max-w-4xl mx-auto text-[#0b4f30]">
      {/* 1. CREW MODE LANDING ENTRY */}
      {view === 'landing' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] text-[10px] font-mono tracking-wider">
              ⚡ NEW FEATURE // MULTI-BUILDER ⚡
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-serif text-[#faf8f0] uppercase tracking-tight leading-none">
              BUILD TOGETHER.<br/>
              <span className="text-[#fadb14]">SHOW UP TOGETHER.</span>
            </h2>
            <p className="text-[#faf8f0]/85 text-sm font-mono max-w-md mx-auto">
              Bring your teammates into one combined frame. Create an official HH Goa 2026 collective poster.
            </p>
          </div>

          {/* Action Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
            {/* Create Crew Card */}
            <div className="p-6 border-3 border-[#0a2e1d] bg-[#faf8f0] flex flex-col justify-between gap-4 shadow-[4px_4px_0px_0px_#0a2e1d]">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#ff007f] font-mono">✦ INITIATE</span>
                <h3 className="text-xl font-bold font-serif uppercase tracking-tight">Create a Crew</h3>
                <p className="text-xs text-[#0a2e1d]/75 font-mono">
                  Set up a collective board, invite your teammates via link, and assign your crew class.
                </p>
              </div>
              <button
                onClick={() => setView('create')}
                className="retro-button-yellow w-full py-3 text-center"
              >
                CREATE YOUR CREW
              </button>
            </div>

            {/* Join Crew Card */}
            <div className="p-6 border-3 border-[#0a2e1d] bg-[#faf8f0] flex flex-col justify-between gap-4 shadow-[4px_4px_0px_0px_#0a2e1d]">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#ff007f] font-mono">✦ COLLABORATE</span>
                <h3 className="text-xl font-bold font-serif uppercase tracking-tight">Enter Crew Code</h3>
                <p className="text-xs text-[#0a2e1d]/75 font-mono">
                  Already invited? Enter the 4-digit code to add your pass card to the collective.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. K9X2"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg px-3 outline-none text-xs"
                />
                <button
                  onClick={() => fetchCrew(code)}
                  disabled={loading || !code}
                  className="retro-button-pink px-5 py-2.5 shrink-0"
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="max-w-md mx-auto p-3.5 border-2 border-[#0a2e1d] bg-[#faf8f0] text-[#ff007f] text-xs font-mono shadow-[2px_2px_0px_0px_#0a2e1d]">
              {error}
            </div>
          )}
        </div>
      )}

      {/* 2. CREATE CREW SCREEN */}
      {view === 'create' && (
        <div className="max-w-md mx-auto animate-fadeIn bg-[#faf8f0] border-3 border-[#0a2e1d] p-6 shadow-[6px_6px_0px_0px_#0a2e1d]">
          <div className="border-b border-[#0a2e1d]/20 pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif uppercase tracking-tight">Create Crew</h3>
            <button
              type="button"
              onClick={() => setView('landing')}
              className="text-xs font-bold font-mono uppercase text-[#ff007f] hover:underline"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateCrew} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider font-vt">Crew Name *</label>
              <input
                type="text"
                placeholder="e.g. Midnight Builders"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                maxLength={30}
                className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2.5 px-3 outline-none text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider font-vt">Crew Tagline</label>
              <input
                type="text"
                placeholder="e.g. We ship after midnight."
                value={createForm.tagline}
                onChange={(e) => setCreateForm({ ...createForm, tagline: e.target.value })}
                maxLength={50}
                className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2.5 px-3 outline-none text-xs"
              />
            </div>

            {/* Creator Profile Section */}
            <div className="border-t border-[#0a2e1d]/20 pt-4 mt-4 space-y-4">
              <span className="text-[10px] font-bold text-[#ff007f] font-mono tracking-widest block uppercase">✦ Member #1 Profile (Creator)</span>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider font-vt">Your Photo *</label>
                {createForm.creatorPhoto ? (
                  <div className="relative w-20 h-20 border-2 border-[#0a2e1d] rounded overflow-hidden mb-1 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={createForm.creatorPhoto} alt="Creator Photo Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCreateForm(prev => ({ ...prev, creatorPhoto: '' }))}
                      className="absolute inset-0 bg-black/65 text-white text-[9px] font-black opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      CHANGE
                    </button>
                  </div>
                ) : (
                  <PhotoUpload onPhotoSelected={(url) => setCreateForm(prev => ({ ...prev, creatorPhoto: url }))} />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider font-vt">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    value={createForm.creatorName}
                    onChange={(e) => setCreateForm({ ...createForm, creatorName: e.target.value })}
                    className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider font-vt">Twitter/X Handle</label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    value={createForm.creatorTwitter}
                    onChange={(e) => setCreateForm({ ...createForm, creatorTwitter: e.target.value })}
                    className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider font-vt">Primary Stack *</label>
                  <select
                    value={createForm.creatorStack}
                    required
                    onChange={(e) => setCreateForm({ ...createForm, creatorStack: e.target.value })}
                    className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs text-[#0a2e1d]"
                  >
                    <option value="">Select your stack</option>
                    <option value="React/Frontend">React / Frontend</option>
                    <option value="Node/Backend">Node / Backend</option>
                    <option value="Python/AI/ML">Python / AI</option>
                    <option value="Solidity/Web3">Solidity / Web3</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AWS/DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider font-vt">Role *</label>
                  <select
                    value={createForm.creatorRole}
                    required
                    onChange={(e) => setCreateForm({ ...createForm, creatorRole: e.target.value })}
                    className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs text-[#0a2e1d]"
                  >
                    <option value="">Select your role</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Architect">Architect</option>
                    <option value="Hacker">Hacker</option>
                    <option value="Wizard">Wizard</option>
                    <option value="Maker">Maker</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-[#ff007f] font-mono mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading || !createForm.name || !createForm.creatorName || !createForm.creatorRole || !createForm.creatorStack || !createForm.creatorPhoto}
              className="retro-button-yellow w-full py-3.5 mt-2"
            >
              {loading ? 'CREATING...' : 'CREATE CREW →'}
            </button>
          </form>
        </div>
      )}

      {/* 3. CREW EDITOR / DASHBOARD */}
      {view === 'dashboard' && crew && (
        <div className="space-y-8 animate-fadeIn w-full px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#faf8f0]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] text-[#fadb14] font-bold font-mono tracking-widest uppercase">
                ✦ Crew Code: {crew.code}
              </div>
              <h2 className="text-3xl font-black font-serif text-[#faf8f0] uppercase tracking-tight">
                {crew.name}
              </h2>
              {crew.tagline && <p className="text-xs text-[#faf8f0]/80 font-mono italic mt-0.5">&ldquo;{crew.tagline}&rdquo;</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('landing')}
                className="px-4 py-2 border-2 border-[#0a2e1d] bg-[#faf8f0] hover:bg-[#ff007f] hover:text-[#faf8f0] text-xs font-bold font-mono transition-colors shadow-[2px_2px_0px_0px_#0a2e1d] cursor-pointer"
              >
                LEAVE WORKSPACE
              </button>
            </div>
          </div>

          {/* Share Invitation links Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-5 border-3 border-[#0a2e1d] bg-[#faf8f0] space-y-4 shadow-[4px_4px_0px_0px_#0a2e1d]">
              <span className="text-[10px] font-bold text-[#ff007f] font-mono tracking-widest block uppercase">✦ Bring Your Build Partners</span>
              <p className="text-xs text-[#0a2e1d]/85 font-mono leading-relaxed">
                {crew.members.length === 1 
                  ? "Invite up to two more builders to complete your crew."
                  : crew.members.length === 2 
                    ? "Invite one more builder to complete your crew."
                    : "Your crew is complete and locked!"
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Invite link input copy */}
                <div className="flex-1 flex items-center justify-between border-2 border-[#0a2e1d] bg-white rounded-lg px-3 py-2 truncate text-xs font-mono">
                  <span className="truncate select-all mr-2">{inviteLinkUrl}</span>
                  <button onClick={copyInviteLink} className="text-[#0b4f30] hover:text-[#ff007f] cursor-pointer">
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Code Copy */}
                <button
                  onClick={copyCrewCode}
                  className="retro-button-yellow px-4 py-2 flex items-center gap-1.5 shrink-0 justify-center text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                  COPY CODE ({crew.code})
                </button>
              </div>
            </div>

            {/* QR Invite Mock */}
            <div className="p-4 border-3 border-[#0a2e1d] bg-[#faf8f0] flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#0a2e1d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(inviteLinkUrl)}`}
                alt="Crew Join QR Code"
                className="w-24 h-24 border-2 border-[#0a2e1d] p-1 bg-white mb-2"
              />
              <span className="text-[9px] font-bold font-mono text-[#0a2e1d]/70 uppercase">Scan to join crew</span>
            </div>
          </div>

          {/* Members List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#faf8f0]/10 pb-2">
              <h3 className="text-xl font-bold font-serif text-[#faf8f0] uppercase tracking-tight">Crew Members</h3>
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${crew.members.length === 3 ? 'text-[#ff007f]' : 'text-[#faf8f0]/70'}`}>
                {crew.members.length === 3 ? 'CREW COMPLETE ✓ ' : ''} 0{crew.members.length} / 03 BUILDERS
              </span>
            </div>

            {/* Members cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-[#0b4f30]">
              {crew.members.map((m) => (
                <div key={m.id} className="relative border-3 border-[#0a2e1d] bg-[#faf8f0] overflow-hidden flex flex-col justify-between shadow-[3px_3px_0px_0px_#0a2e1d] group">
                  {/* Photo container */}
                  <div className="relative aspect-square w-full border-b-2 border-[#0a2e1d] bg-slate-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    
                    {/* Owner deletion button */}
                    {ownerToken && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-[#ff007f] border-2 border-[#0a2e1d] text-white hover:bg-red-750 transition-colors shadow-[2px_2px_0px_0px_#0a2e1d] cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Member details info */}
                  <div className="p-4 space-y-1 bg-[#faf8f0]">
                    <span className="text-[8px] font-bold text-[#ff007f] font-mono tracking-widest uppercase">{m.xHandle || '@HACKER'}</span>
                    <h4 className="text-base font-extrabold uppercase font-serif text-[#0b4f30] truncate">{m.name}</h4>
                    <p className="text-[10px] font-mono text-[#0a2e1d]/75 truncate">{m.role.toUpperCase()} // {m.stack.toUpperCase()}</p>
                    
                    {/* Assigned Title */}
                    <div className="pt-2">
                      <span className="inline-block px-2 py-0.5 bg-[#fadb14] text-[#0b4f30] border border-[#0a2e1d] text-[9px] font-extrabold font-mono tracking-tight rounded">
                        {m.builderTitle}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting Placeholder Slot (Only show 1 slot if crew is not full!) */}
              {crew.members.length < 3 && (
                <div
                  onClick={() => setView('join')}
                  className="border-3 border-dashed border-[#faf8f0]/30 hover:border-[#faf8f0]/75 hover:bg-[#faf8f0]/5 text-[#faf8f0]/40 hover:text-[#faf8f0] transition-all flex flex-col items-center justify-center min-h-[300px] text-center cursor-pointer p-6 shadow-[3px_3px_0px_0px_#faf8f0]/10"
                >
                  <span className="text-3xl font-serif text-[#faf8f0]/20 mb-2">+</span>
                  <span className="text-xs font-bold font-serif uppercase tracking-wider block">Add Builder</span>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    {crew.members.length === 1 ? 'Add up to 2 more builders' : 'Add 1 more builder'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs: Generate Crew Card/Poster */}
          {crew.members.length >= 1 ? (
            <div className="p-5 border-3 border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#0a2e1d]">
              <div>
                <h4 className="text-lg font-black font-serif uppercase leading-none">
                  {crew.members.length === 3 ? 'Crew Complete! ✓' : 'Your Crew has started!'}
                </h4>
                <p className="text-xs font-mono text-[#0a2e1d]/85 mt-1">
                  {crew.members.length === 3 ? 'Three builders. One identity.' : 'Invite partners or compile cards now.'}
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="retro-button-yellow py-3.5 px-6 shrink-0 font-vt uppercase tracking-wider font-extrabold"
              >
                CREATE CREW PASS →
              </button>
            </div>
          ) : (
            <div className="p-5 border-3 border-dashed border-[#faf8f0]/20 text-center font-mono text-xs text-[#faf8f0]/65">
              Add at least one builder to unlock Crew Mode graphics generation.
            </div>
          )}
        </div>
      )}

      {/* 4. JOIN CREW WORKSPACE */}
      {view === 'join' && crew && (
        <div className="max-w-lg mx-auto animate-fadeIn bg-[#faf8f0] border-3 border-[#0a2e1d] p-6 shadow-[6px_6px_0px_0px_#0a2e1d]">
          {crew.members.length >= 3 ? (
            <div className="text-center space-y-4 py-8">
              <h3 className="text-2xl font-black font-serif uppercase tracking-tight text-[#ff007f]">THIS CREW IS FULL</h3>
              <p className="text-xs font-mono text-[#0a2e1d]/85">
                Maximum 3/3 builders have already joined &ldquo;{crew.name}&rdquo;.<br/>
                Ask the crew owner to create a new crew.
              </p>
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="retro-button-yellow px-5 py-2.5 mt-2"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          ) : (
            <>
              <div className="border-b border-[#0a2e1d]/20 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-serif uppercase tracking-tight">Join Crew</h3>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">Crew: {crew.name} ({crew.members.length}/3 Builders)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('dashboard')}
                  className="text-xs font-bold font-mono uppercase text-[#ff007f] hover:underline"
                >
                  Back
                </button>
              </div>

              <form onSubmit={handleJoinCrew} className="space-y-4">
                {/* Photo upload zone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider font-vt">Member Photo *</label>
                  <PhotoUpload onPhotoSelected={(url) => setJoinForm({ ...joinForm, photo: url })} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider font-vt">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya"
                      required
                      value={joinForm.name}
                      onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                      className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider font-vt">Twitter/X Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. @ananya"
                      value={joinForm.xHandle}
                      onChange={(e) => setJoinForm({ ...joinForm, xHandle: e.target.value })}
                      className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider font-vt">Primary Stack *</label>
                    <select
                      value={joinForm.stack}
                      required
                      onChange={(e) => setJoinForm({ ...joinForm, stack: e.target.value })}
                      className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs"
                    >
                      <option value="">Select Stack</option>
                      <option value="React/Frontend">React / Frontend</option>
                      <option value="Node/Backend">Node / Backend</option>
                      <option value="Python/AI/ML">Python / AI</option>
                      <option value="Solidity/Web3">Solidity / Web3</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="AWS/DevOps">DevOps</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider font-vt">Role *</label>
                    <select
                      value={joinForm.role}
                      required
                      onChange={(e) => setJoinForm({ ...joinForm, role: e.target.value })}
                      className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] font-mono rounded-lg py-2 px-3 outline-none text-xs"
                    >
                      <option value="">Select Role</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Architect">Architect</option>
                      <option value="Hacker">Hacker</option>
                      <option value="Wizard">Wizard</option>
                      <option value="Maker">Wizard</option>
                    </select>
                  </div>
                </div>

                {error && <p className="text-xs text-[#ff007f] font-mono">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !joinForm.photo || !joinForm.name || !joinForm.stack || !joinForm.role}
                  className="retro-button-yellow w-full py-3.5 mt-2"
                >
                  {loading ? 'JOINING...' : 'JOIN CREW'}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* 5. CREW RESULTS / DOWNLOAD / SHARE */}
      {view === 'result' && crew && (
        <div className="w-full max-w-xl mx-auto space-y-6 animate-fadeIn text-[#0b4f30]">
          <div className="text-center text-[#faf8f0]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] text-[10px] font-mono tracking-wider mb-3">
              ✦ COLLECTIVE LOCK COMPLETED ✦
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-serif uppercase tracking-tight leading-none mb-2">
              YOUR CREW IS<br/>
              <span className="text-[#fadb14] drop-shadow-md">GOA READY.</span>
            </h2>
            <p className="text-xs font-mono max-w-xs mx-auto">
              Generated shared cards and campaign posters. Ready for download.
            </p>
          </div>

          {/* Toggle selector between card, poster and pfp */}
          <div className="flex border-3 border-[#0a2e1d] bg-[#faf8f0] p-1.5 shadow-[3px_3px_0px_0px_#0a2e1d] max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveResultType('card')}
              className={`flex-1 py-2 text-center text-xs font-black uppercase font-vt cursor-pointer border-2 transition-all ${
                activeResultType === 'card'
                  ? 'bg-[#fadb14] border-[#0a2e1d] text-[#0b4f30]'
                  : 'bg-transparent border-transparent text-[#0b4f30]/60 hover:text-[#0b4f30]'
              }`}
            >
              CREW PASS
            </button>
            <button
              type="button"
              onClick={() => setActiveResultType('poster')}
              className={`flex-1 py-2 text-center text-xs font-black uppercase font-vt cursor-pointer border-2 transition-all ${
                activeResultType === 'poster'
                  ? 'bg-[#fadb14] border-[#0a2e1d] text-[#0b4f30]'
                  : 'bg-transparent border-transparent text-[#0b4f30]/60 hover:text-[#0b4f30]'
              }`}
            >
              CREW POSTER
            </button>
            <button
              type="button"
              onClick={() => setActiveResultType('pfp')}
              className={`flex-1 py-2 text-center text-xs font-black uppercase font-vt cursor-pointer border-2 transition-all ${
                activeResultType === 'pfp'
                  ? 'bg-[#fadb14] border-[#0a2e1d] text-[#0b4f30]'
                  : 'bg-transparent border-transparent text-[#0b4f30]/60 hover:text-[#0b4f30]'
              }`}
            >
              CREW PFP
            </button>
          </div>

          {/* Canvas Image Display */}
          <div className="relative overflow-hidden border-3 border-[#0a2e1d] bg-[#faf8f0] p-3 shadow-[8px_8px_0px_0px_#0a2e1d]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                activeResultType === 'card' ? generatedCardUrl! : 
                activeResultType === 'poster' ? generatedPosterUrl! : 
                generatedPfpUrl!
              }
              alt="Generated Crew Image"
              className="w-full h-auto object-contain border-2 border-[#0a2e1d]/20 shadow-inner"
            />
          </div>

          {/* Warning state */}
          {error && (
            <div className="p-3.5 border-2 border-[#0a2e1d] bg-[#faf8f0] flex items-start gap-3 text-[#ff007f] text-xs font-mono shadow-[3px_3px_0px_0px_#0a2e1d]">
              <span>{error}</span>
            </div>
          )}

          {/* Share links */}
          {shareUrl && (
            <div className="p-4 border-2 border-[#0a2e1d] bg-[#faf8f0] flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#0a2e1d]">
              <div className="truncate text-xs text-[#0a2e1d]/75 font-mono select-all">
                {shareUrl}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#0a2e1d] hover:bg-[#ff007f] hover:text-[#faf8f0] text-xs font-bold font-mono transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy URL
              </button>
            </div>
          )}

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              className="retro-button-yellow py-3.5 px-6 flex items-center justify-center gap-2"
            >
              <Download className="w-4.5 h-4.5" />
              DOWNLOAD {activeResultType.toUpperCase()}
            </button>

            <button
              onClick={handleShareToX}
              disabled={sharing}
              className="retro-button-pink py-3.5 px-6 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {sharing ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  POSTING...
                </>
              ) : (
                <>
                  <Share2 className="w-4.5 h-4.5" />
                  SHARE TO X
                </>
              )}
            </button>
          </div>

          {/* Back actions */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#faf8f0]/10">
            <button
              onClick={() => setView('dashboard')}
              className="text-xs font-black uppercase font-vt text-[#faf8f0] hover:text-[#fadb14] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> EDIT MEMBERS
            </button>
            <button
              onClick={handleRestart}
              className="text-xs font-black uppercase font-vt text-[#faf8f0] hover:text-[#fadb14] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> CREATE NEW CREW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
