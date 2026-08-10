import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download } from 'lucide-react';

interface SharePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SharePageProps) {
  const resolvedSearchParams = await searchParams;
  const imgUrl = (resolvedSearchParams.img as string) || '';
  const name = (resolvedSearchParams.name as string) || 'Builder';

  const title = `HH Goa 2026 Badge — ${name}`;
  const description = `${name} is framed and locked for HH Goa 2026! Check out their official builder card.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imgUrl ? [{ url: imgUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imgUrl ? [imgUrl] : [],
    },
  };
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const imgUrl = (resolvedSearchParams.img as string) || '';
  const name = (resolvedSearchParams.name as string) || 'Builder';

  const isCrew = id === 'crew';

  return (
    <div className="min-h-screen bg-[#0b4f30] text-[#faf8f0] flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden font-serif select-none">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-[#fadb14]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-[#ff007f]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[#faf8f0] hover:text-[#fadb14] transition-colors text-xs font-bold font-mono uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Generate Yours</span>
        </Link>
        
        <div className="text-right">
          <span className="text-[10px] font-bold text-[#fadb14] tracking-widest block font-mono">HH GOA 2026</span>
          <span className="text-[#faf8f0]/80 text-[11px] font-bold font-mono">BUILDER PASS VERIFIED</span>
        </div>
      </header>

      {/* Main Content (Retro Cream Card layout) */}
      <main className="w-full max-w-lg flex flex-col items-center justify-center gap-6 z-10 flex-1 my-auto text-[#0b4f30]">
        <div className="text-center text-[#faf8f0]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007f]/10 border border-[#ff007f]/25 text-[#ff007f] text-[10px] font-mono tracking-wider mb-3">
            ✦ {isCrew ? 'OFFICIAL CREW POSTER' : 'OFFICIAL EVENT PASS'} ✦
          </div>
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight mb-2 leading-tight">
            {isCrew ? `${name} Crew` : `${name}'s Badge`}
          </h1>
          <p className="text-[#faf8f0]/80 text-xs font-mono max-w-sm mx-auto">
            {isCrew 
              ? 'This poster represents a verified builder collective shipping to HH Goa 2026.' 
              : 'This card represents a verified builder heading to HH Goa 2026.'}
          </p>
        </div>

        {/* Display Graphic Card */}
        {imgUrl ? (
          <div className="relative border-3 border-[#0a2e1d] bg-[#faf8f0] p-3 shadow-[8px_8px_0px_0px_#0a2e1d] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgUrl} 
              alt={isCrew ? `${name} Crew Poster` : `${name}'s Badge`} 
              className="w-full h-auto object-contain border-2 border-[#0a2e1d]/20 shadow-inner"
            />
          </div>
        ) : (
          <div className="w-full aspect-square border-3 border-dashed border-[#0a2e1d] bg-[#faf8f0] flex flex-col items-center justify-center text-[#0b4f30] p-8 text-center shadow-[6px_6px_0px_0px_#0a2e1d]">
            <p className="font-mono text-xs">No badge graphic found. Make sure to generate one using the generator tool.</p>
            <Link href="/" className="retro-button-yellow mt-4 px-5 py-2.5">
              GO TO GENERATOR
            </Link>
          </div>
        )}

        {/* Action Buttons in Retro style */}
        {imgUrl && (
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
            <a
              href={imgUrl}
              download={`${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-hhgoa-2026.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-button-pink flex-1 py-3.5 px-6 flex items-center justify-center gap-2"
            >
              <Download className="w-4.5 h-4.5" />
              DOWNLOAD BADGE
            </a>
            
            <Link
              href="/"
              className="retro-button-yellow flex-1 py-3.5 px-6 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4.5 h-4.5" />
              CREATE YOURS
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[#faf8f0]/40 text-xs mt-8 z-10 border-t border-[#faf8f0]/10 pt-6 font-mono">
        <p>© 2026 Hacker House Goa. All rights reserved.</p>
      </footer>
    </div>
  );
}
