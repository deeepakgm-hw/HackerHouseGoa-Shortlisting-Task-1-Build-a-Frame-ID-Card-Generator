'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import CropAdjuster from './CropAdjuster';
import BuilderForm from './BuilderForm';
import DesignSelector from './DesignSelector';
import ResultView from './ResultView';
import CrewWorkspace from './CrewWorkspace';
import { ImageSettings, BuilderDetails, drawPfpFrame, drawBuilderCard } from '../lib/canvasDraw';

type Step = 'upload' | 'adjust' | 'result';
type Tab = 'frame' | 'pass' | 'crew';

export default function Generator() {
  const [activeTab, setActiveTab] = useState<Tab>('frame');
  const [initialCrewCode, setInitialCrewCode] = useState('');
  
  const [step, setStep] = useState<Step>('upload');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);

  const [imgSettings, setImgSettings] = useState<ImageSettings>({
    zoom: 1.0,
    panX: 0,
    panY: 0,
  });

  const [details, setDetails] = useState<BuilderDetails>({
    name: '',
    role: '',
    stack: '',
    location: '',
    twitter: '',
    title: '',
  });

  // Client-side parsing of URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const crewCode = params.get('crew');
      if (crewCode) {
        setActiveTab('crew');
        setInitialCrewCode(crewCode);
      }
    }
  }, []);

  const handleRestart = () => {
    setPhotoUrl(null);
    setGeneratedDataUrl(null);
    setImgSettings({ zoom: 1.0, panX: 0, panY: 0 });
    setDetails({ name: '', role: '', stack: '', location: '', twitter: '', title: '' });
    setStep('upload');
  };

  const handlePhotoSelected = (url: string) => {
    setPhotoUrl(url);
    setStep('adjust');
  };

  const handleGenerate = () => {
    if (!photoUrl) return;
    setGenerating(true);

    const isCard = activeTab === 'pass';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = isCard ? 1350 : 1080;

      if (isCard) {
        drawBuilderCard(canvas, img, imgSettings, details, variantIndex);
      } else {
        drawPfpFrame(canvas, img, imgSettings, variantIndex);
      }

      setTimeout(() => {
        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedDataUrl(dataUrl);
        setStep('result');
        setGenerating(false);
      }, 800);
    };
    img.onerror = () => {
      setGenerating(false);
      alert("Error loading photo. Please try uploading a different JPG or PNG image.");
    };
  };

  const isCard = activeTab === 'pass';

  return (
    <div className="w-full font-sans select-none">
      {/* 1. Main Tab Navigation Header */}
      <div className="flex border-3 border-[#0a2e1d] bg-[#faf8f0] p-1.5 shadow-[4px_4px_0px_0px_#0a2e1d] max-w-md mx-auto mb-8 text-[#0b4f30]">
        <button
          onClick={() => { setActiveTab('frame'); setStep('upload'); }}
          className={`flex-1 py-2 text-center text-xs font-black uppercase font-vt cursor-pointer border-2 transition-all ${
            activeTab === 'frame'
              ? 'bg-[#fadb14] border-[#0a2e1d] text-[#0b4f30]'
              : 'bg-transparent border-transparent text-[#0b4f30]/60 hover:text-[#0b4f30]'
          }`}
        >
          MY FRAME
        </button>
        <button
          onClick={() => { setActiveTab('pass'); setStep('upload'); }}
          className={`flex-1 py-2 text-center text-xs font-black uppercase font-vt cursor-pointer border-2 transition-all ${
            activeTab === 'pass'
              ? 'bg-[#fadb14] border-[#0a2e1d] text-[#0b4f30]'
              : 'bg-transparent border-transparent text-[#0b4f30]/60 hover:text-[#0b4f30]'
          }`}
        >
          BUILDER PASS
        </button>
        <button
          onClick={() => { setActiveTab('crew'); }}
          className={`flex-1 py-2 text-center text-xs font-black uppercase font-vt cursor-pointer border-2 transition-all relative ${
            activeTab === 'crew'
              ? 'bg-[#ff007f] border-[#0a2e1d] text-[#faf8f0] shadow-[2px_2px_0px_0px_#0a2e1d] translate-y-[-1px]'
              : 'bg-transparent border-transparent text-[#0b4f30]/60 hover:text-[#0b4f30]'
          }`}
        >
          CREW MODE ⚡
        </button>
      </div>

      {/* RENDER CREW WORKSPACE */}
      {activeTab === 'crew' ? (
        <CrewWorkspace initialCode={initialCrewCode} />
      ) : (
        /* RENDER INDIVIDUAL BUILDER WORKSPACE */
        <>
          {/* Refined Step Progress Header in Retro style */}
          <div className="max-w-xs mx-auto mb-8 text-center">
            <div className="flex items-center justify-between text-xs font-black uppercase font-vt tracking-widest text-[#faf8f0]/60 mb-2 px-1">
              <span className={step === 'upload' ? 'text-[#fadb14]' : ''}>[ 1. UPLOAD ]</span>
              <span className={step === 'adjust' ? 'text-[#fadb14]' : ''}>[ 2. CUSTOMIZE ]</span>
              <span className={step === 'result' ? 'text-[#fadb14]' : ''}>[ 3. EXPORT ]</span>
            </div>
            <div className="w-full h-1 bg-[#0a2e1d] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#fadb14] transition-all duration-500 ease-out"
                style={{
                  width: step === 'upload' ? '33.3%' : step === 'adjust' ? '66.6%' : '100%',
                }}
              />
            </div>
          </div>

          {/* Main Switcher */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] text-xs font-mono tracking-wider">
                  ✦ HH GOA BUILDER HOUSE 2026 ✦
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight leading-tight uppercase">
                  YOUR HH GOA<br/>
                  <span className="text-[#fadb14] drop-shadow-md">
                    {activeTab === 'frame' ? 'AVATAR OVERLAY' : 'BUILDER IDENTITY'}
                  </span>
                </h2>
                <p className="text-[#faf8f0]/85 text-sm leading-relaxed max-w-lg mx-auto font-mono">
                  {activeTab === 'frame'
                    ? 'Generate your custom beach-themed avatar frame, perfect for your X profile picture.'
                    : 'Design your personalized hackathon builder pass card with custom stack labels.'}
                </p>
              </div>
              
              <PhotoUpload onPhotoSelected={handlePhotoSelected} />

              {/* Crew promotion teaser under photo upload */}
              <div className="max-w-xl mx-auto pt-8 border-t border-[#faf8f0]/10 text-center animate-fadeIn">
                <div className="p-5 border-3 border-[#0a2e1d] bg-[#faf8f0] text-[#0b4f30] text-center shadow-[4px_4px_0px_0px_#0a2e1d] max-w-md mx-auto space-y-3">
                  <h4 className="text-base font-black font-serif uppercase leading-none">BUILD TOGETHER?</h4>
                  <p className="text-xs font-mono text-[#0a2e1d]/75">
                    Your individual pass is only the start. Team up with your squad and build a collective Goa poster pass.
                  </p>
                  <button
                    onClick={() => setActiveTab('crew')}
                    className="retro-button-pink py-2 px-4 text-xs font-bold"
                  >
                    LAUNCH CREW STUDIO ⚡
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'adjust' && photoUrl && (
            <div className="space-y-6 w-full">
              {/* Back Action Row */}
              <div className="flex items-center justify-between max-w-5xl mx-auto w-full px-4 border-b border-[#faf8f0]/10 pb-3">
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs font-black uppercase font-vt text-[#faf8f0] hover:text-[#fadb14] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Upload
                </button>
                <span className="text-xs text-[#faf8f0]/60 font-mono">Configuring Badge</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto w-full px-4">
                {/* Left Adjuster */}
                <div className="space-y-6">
                  <CropAdjuster
                    photoUrl={photoUrl}
                    isCard={isCard}
                    settings={imgSettings}
                    onChange={setImgSettings}
                    details={details}
                    variantIndex={variantIndex}
                  />
                </div>

                {/* Right Customizers */}
                <div className="space-y-6">
                  <DesignSelector
                    isCard={isCard}
                    setIsCard={(val) => setActiveTab(val ? 'pass' : 'frame')}
                    variantIndex={variantIndex}
                    setVariantIndex={setVariantIndex}
                  />

                  {isCard && <BuilderForm details={details} onChange={setDetails} />}

                  {/* Generate Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="retro-button-yellow w-full py-4 px-6 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          GENERATING PASS...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          GENERATE {isCard ? 'BUILDER PASS' : 'PFP OVERLAY'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && generatedDataUrl && (
            <ResultView
              imageDataUrl={generatedDataUrl}
              name={details.name}
              isCard={isCard}
              onEditDetails={() => setStep('adjust')}
              onRestart={handleRestart}
            />
          )}
        </>
      )}
    </div>
  );
}
