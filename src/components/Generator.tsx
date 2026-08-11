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
    <div className="w-full font-sans select-none flex flex-col items-center">
      {/* 1. Main Tab Navigation Header Section (Full-Width Viewport-Wide Band with 3 Individual Cards) */}
      <section className="w-full border-t-2 border-b-2 border-[#0a2e1d] bg-[#0b4f30] pt-5 pb-6 z-20">
        <div className="w-full max-w-[1200px] mx-auto px-6 overflow-x-auto scrollbar-none py-1">
          <div className="grid grid-cols-3 gap-3 min-w-[500px] sm:min-w-0">
            {/* Button 1: MY FRAME */}
            <button
              type="button"
              onClick={() => { setActiveTab('frame'); setStep('upload'); }}
              className={`relative h-[52px] md:h-[60px] px-6 flex items-center justify-center rounded-[3px] border-2 border-[#0a2e1d] font-bold uppercase tracking-wider cursor-pointer transition-all duration-150 outline-none ${
                activeTab === 'frame'
                  ? 'bg-[#fadb14] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d]'
                  : 'bg-[#faf8f0] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d] hover:bg-[#fadb14]/10 hover:translate-y-[-1.5px] hover:shadow-[3px_4.5px_0px_0px_#0a2e1d]'
              }`}
            >
              {activeTab === 'frame' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff007f] block" />
              )}
              <span className="text-xs sm:text-sm md:text-base flex items-center justify-center">
                <span className="hidden sm:inline">MY FRAME</span>
                <span className="sm:hidden">FRAME</span>
                <span className="text-[#0a2e1d]/50 font-mono text-[11px] ml-1.5">⌖</span>
              </span>
            </button>

            {/* Button 2: BUILDER PASS */}
            <button
              type="button"
              onClick={() => { setActiveTab('pass'); setStep('upload'); }}
              className={`relative h-[52px] md:h-[60px] px-6 flex items-center justify-center rounded-[3px] border-2 border-[#0a2e1d] font-bold uppercase tracking-wider cursor-pointer transition-all duration-150 outline-none ${
                activeTab === 'pass'
                  ? 'bg-[#fadb14] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d]'
                  : 'bg-[#faf8f0] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d] hover:bg-[#fadb14]/10 hover:translate-y-[-1.5px] hover:shadow-[3px_4.5px_0px_0px_#0a2e1d]'
              }`}
            >
              {activeTab === 'pass' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff007f] block" />
              )}
              <span className="text-xs sm:text-sm md:text-base flex items-center justify-center">
                <span className="hidden sm:inline">BUILDER PASS</span>
                <span className="sm:hidden">PASS</span>
                <span className="text-[#ff007f] text-[11px] ml-1.5">★</span>
              </span>
            </button>

            {/* Button 3: CREW MODE */}
            <button
              type="button"
              onClick={() => { setActiveTab('crew'); }}
              className={`relative h-[52px] md:h-[60px] px-6 flex items-center justify-center rounded-[3px] border-2 border-[#0a2e1d] font-bold uppercase tracking-wider cursor-pointer transition-all duration-150 outline-none ${
                activeTab === 'crew'
                  ? 'bg-[#fadb14] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d]'
                  : 'bg-[#faf8f0] text-[#0b4f30] shadow-[3px_3px_0px_0px_#0a2e1d] hover:bg-[#fadb14]/10 hover:translate-y-[-1.5px] hover:shadow-[3px_4.5px_0px_0px_#0a2e1d]'
              }`}
            >
              {activeTab === 'crew' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff007f] block" />
              )}
              <span className="text-xs sm:text-sm md:text-base flex items-center justify-center">
                <span className="hidden sm:inline">CREW MODE</span>
                <span className="sm:hidden">CREW</span>
                <span className="text-[#ff007f] text-[13px] ml-1.5">✦</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* RENDER CREW WORKSPACE */}
      {activeTab === 'crew' ? (
        <div className="w-full max-w-[1200px] mx-auto px-6 py-8 md:py-12">
          <CrewWorkspace
            initialCode={initialCrewCode}
            defaultDetails={details}
            defaultPhotoUrl={photoUrl || undefined}
          />
        </div>
      ) : (
        /* RENDER INDIVIDUAL BUILDER WORKSPACE */
        <div className="w-full max-w-[850px] mx-auto px-6 py-8 md:py-12 space-y-6 flex flex-col items-center">
          {/* Refined Step Progress Header in Retro style */}
          <div className="w-full max-w-[480px] mx-auto mb-8 text-center">
            <div className="w-full flex items-center text-xs md:text-sm font-bold tracking-wider mb-2.5 text-[#faf8f0]/50">
              <span className={`w-[33.333%] text-center ${
                step === 'upload' ? 'text-[#fadb14]' : 
                (step === 'adjust' || step === 'result') ? 'text-[#faf8f0]/30 line-through' : ''
              }`}>
                {step !== 'upload' ? '1. UPLOAD ✓' : '1. UPLOAD'}
              </span>
              <span className={`w-[33.333%] text-center ${
                step === 'adjust' ? 'text-[#fadb14]' : 
                step === 'result' ? 'text-[#faf8f0]/30 line-through' : ''
              }`}>
                {step === 'result' ? '2. CUSTOMIZE ✓' : '2. CUSTOMIZE'}
              </span>
              <span className={`w-[33.333%] text-center ${step === 'result' ? 'text-[#fadb14]' : ''}`}>
                3. EXPORT
              </span>
            </div>
            <div className="w-full h-[5px] bg-[#0a2e1d] rounded-full overflow-hidden flex">
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
            <div className="space-y-4">
              <div className="text-center max-w-2xl mx-auto mb-3 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] text-xs sm:text-[13px] font-mono tracking-wider uppercase">
                  ✦ HH GOA BUILDER HOUSE 2026 ✦
                </div>
                <h2 className="text-4xl md:text-5xl font-black font-serif text-white tracking-tight leading-tight uppercase">
                  {activeTab === 'frame' ? 'FRAME YOUR BUILD.' : 'CREATE YOUR PASS.'}
                </h2>
                <p className="text-[#faf8f0]/85 text-sm sm:text-base font-sans font-medium max-w-md mx-auto leading-relaxed">
                  {activeTab === 'frame'
                    ? 'Create your HH Goa 2026 identity frame for your profile.'
                    : 'Design your personalized hackathon builder pass with custom stack labels.'}
                </p>
              </div>
              
              <PhotoUpload onPhotoSelected={handlePhotoSelected} />

              {/* Crew promotion teaser under photo upload */}
              <div className="max-w-xl mx-auto pt-8 border-t border-[#faf8f0]/10 text-center animate-fadeIn">
                <div className="p-5 border-3 border-[#0a2e1d] bg-[#faf8f0] text-[#0b4f30] text-center shadow-[4px_4px_0px_0px_#0a2e1d] max-w-md mx-auto space-y-3">
                  <h4 className="text-base font-black font-serif uppercase leading-none">BUILD TOGETHER?</h4>
                  <p className="font-body-md text-[#0a2e1d]/85 leading-relaxed">
                    Your individual pass is only the start. Team up with your squad and build a collective Goa poster pass.
                  </p>
                  <button
                    onClick={() => setActiveTab('crew')}
                    className="retro-button-pink py-2.5 px-6 font-label-lg uppercase cursor-pointer"
                  >
                    LAUNCH CREW STUDIO →
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
                  type="button"
                  onClick={() => setStep('upload')}
                  className="font-label-lg text-[#faf8f0] hover:text-[#fadb14] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Upload
                </button>
                <span className="font-caption text-[#faf8f0]/60">Configuring Badge</span>
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
                    {isCard && (!details.name.trim() || !details.stack || !details.role) && (
                      <p className="text-[13px] font-bold font-mono text-[#ff007f] text-center mb-2.5 uppercase tracking-wider">
                        ✦ Enter name, stack & role to unlock pass ✦
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={generating || (isCard && (!details.name.trim() || !details.stack || !details.role))}
                      className={`w-full py-4 px-6 flex items-center justify-center gap-2 group transition-all ${
                        isCard && (!details.name.trim() || !details.stack || !details.role)
                          ? 'bg-[#faf8f0]/10 border-2 border-dashed border-[#faf8f0]/20 text-[#faf8f0]/30 shadow-none cursor-not-allowed'
                          : 'retro-button-yellow cursor-pointer'
                      }`}
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-label-lg text-base tracking-wider">
                            {isCard ? 'GENERATING YOUR PASS...' : 'FRAMING YOUR BUILD...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span className="font-label-lg text-base tracking-wider">
                            {isCard ? 'CREATE MY BUILDER PASS →' : 'CREATE MY FRAME →'}
                          </span>
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
        </div>
      )}
    </div>
  );
}
