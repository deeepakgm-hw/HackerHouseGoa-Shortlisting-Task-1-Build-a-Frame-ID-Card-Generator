'use client';

import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelected: (imgUrl: string, file: File) => void;
}

export default function PhotoUpload({ onPhotoSelected }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setLoading(true);

    const fileNameLower = file.name.toLowerCase();
    const isHeic = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('Photo exceeds size limit. Keep it under 15MB.');
      setLoading(false);
      return;
    }

    try {
      if (isHeic) {
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8,
        });

        const blob = Array.isArray(converted) ? converted[0] : converted;
        const convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        
        const url = URL.createObjectURL(blob);
        onPhotoSelected(url, convertedFile);
      } else if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        onPhotoSelected(url, file);
      } else {
        setError('Unsupported file type. Upload JPG, PNG, or HEIC.');
      }
    } catch (err: unknown) {
      console.error('File processing error:', err);
      setError('Could not read image file. Try another JPG or PNG.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative border-3 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] group ${
          isDragActive
            ? 'border-[#ff007f] bg-[#ff007f]/10 scale-[1.01] shadow-[6px_6px_0px_0px_#0a2e1d]'
            : 'border-[#0a2e1d] bg-[#faf8f0] hover:bg-[#faf8f0]/95 hover:shadow-[6px_6px_0px_0px_#0a2e1d]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.heic,.heif,image/png,image/jpeg,image/heic,image/heif"
          onChange={handleChange}
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse text-[#0b4f30]">
            <Loader2 className="w-12 h-12 text-[#ff007f] animate-spin" />
            <p className="text-[#0b4f30] text-base font-bold font-serif uppercase tracking-tight">Processing your photo...</p>
            <p className="text-slate-500 text-xs font-mono">Converting HEIC formats.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-[#0b4f30]">
            {/* Retro Illustrated Upload Stamp */}
            <div className="w-16 h-16 rounded-2xl bg-[#ff007f] border-2 border-[#0a2e1d] flex items-center justify-center text-white shadow-[3px_3px_0px_0px_#0a2e1d] group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
              <Upload className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase font-serif tracking-tight">
                Upload your builder photo
              </h3>
              
              <p className="text-slate-500 text-xs font-mono max-w-xs mx-auto">
                Drag & drop or tap to select from device
              </p>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="px-2 py-0.5 rounded border border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] text-[10px] font-extrabold font-mono">PNG</span>
                <span className="px-2 py-0.5 rounded border border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] text-[10px] font-extrabold font-mono">JPG</span>
                <span className="px-2 py-0.5 rounded border border-[#0a2e1d] bg-[#fadb14] text-[#0b4f30] text-[10px] font-extrabold font-mono">HEIC</span>
              </div>
              
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Supports portrait, landscape & square. Max 15MB.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#ff007f]/10 border-2 border-[#0a2e1d] flex items-center gap-3 text-[#ff007f] text-xs font-mono shadow-[2px_2px_0px_0px_#0a2e1d]">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
