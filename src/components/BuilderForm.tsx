'use client';

import React, { ChangeEvent } from 'react';
import { generateBuilderTitle } from '../lib/titleGenerator';
import { BuilderDetails } from '../lib/canvasDraw';

interface BuilderFormProps {
  details: BuilderDetails;
  onChange: (details: BuilderDetails) => void;
}

const STACKS = ['React / Frontend', 'Node.js / Backend', 'Python / AI / ML', 'Solidity / Web3', 'Flutter / iOS / Android', 'AWS / DevOps', 'UI/UX Design'];
const ROLES = ['Developer', 'Engineer', 'Hacker', 'Designer', 'Architect', 'Wizard', 'Maker'];

export default function BuilderForm({ details, onChange }: BuilderFormProps) {
  const updateField = (field: keyof BuilderDetails, value: string) => {
    const updated = { ...details, [field]: value };
    if (field === 'name' || field === 'stack' || field === 'role') {
      updated.title = generateBuilderTitle(updated.name, updated.stack, updated.role);
    }
    onChange(updated);
  };

  const handleInputChange = (field: keyof BuilderDetails) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateField(field, e.target.value);
  };

  return (
    <div className="w-full space-y-6 bg-[#faf8f0] p-6 border-3 border-[#0a2e1d] shadow-[4px_4px_0px_0px_#0a2e1d] text-[#0b4f30]">
      <div className="border-b border-[#0a2e1d]/20 pb-3">
        <h3 className="text-xl font-bold uppercase font-serif tracking-tight text-[#0b4f30] mb-0.5">Hacker Details</h3>
        <p className="text-xs text-[#0a2e1d]/70 font-mono">Fill in metadata to imprint your Goa Pass.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="name" className="text-sm font-label-lg uppercase tracking-wider text-[#0a2e1d]">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            value={details.name}
            onChange={handleInputChange('name')}
            maxLength={25}
            className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] focus:bg-white focus:ring-2 focus:ring-[#fadb14] text-[#0b4f30] font-sans font-medium rounded-lg py-2.5 px-3 outline-none transition-all text-base placeholder-[#0b4f30]/40"
          />
        </div>

        {/* Stack Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="stack" className="text-sm font-label-lg uppercase tracking-wider text-[#0a2e1d]">Primary Stack</label>
          <select
            id="stack"
            value={details.stack}
            onChange={handleInputChange('stack')}
            className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] focus:bg-white text-[#0b4f30] font-sans font-medium rounded-lg py-2.5 px-3 outline-none transition-all text-base"
          >
            <option value="">Select your stack</option>
            {STACKS.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
            <option value="custom">Other / Custom</option>
          </select>
        </div>

        {/* Custom Stack */}
        {details.stack === 'custom' && (
          <div className="flex flex-col gap-1.5 animate-fadeIn">
            <label htmlFor="custom-stack" className="text-sm font-label-lg uppercase tracking-wider text-[#0a2e1d]">Specify Stack</label>
            <input
              id="custom-stack"
              type="text"
              placeholder="e.g. C++ / Web Assembly"
              onChange={(e) => updateField('stack', e.target.value)}
              className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] focus:bg-white text-[#0b4f30] font-sans font-medium rounded-lg py-2.5 px-3 outline-none transition-all text-base placeholder-[#0b4f30]/40"
            />
          </div>
        )}

        {/* Role Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="role" className="text-sm font-label-lg uppercase tracking-wider text-[#0a2e1d]">Your Role</label>
          <select
            id="role"
            value={details.role}
            onChange={handleInputChange('role')}
            className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] focus:bg-white text-[#0b4f30] font-sans font-medium rounded-lg py-2.5 px-3 outline-none transition-all text-base"
          >
            <option value="">Select your role</option>
            {ROLES.map(rl => (
              <option key={rl} value={rl}>{rl}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-label-lg uppercase tracking-wider text-[#0a2e1d]">Location (Optional)</label>
          <input
            id="location"
            type="text"
            placeholder="Your city or 'Remote'"
            value={details.location}
            onChange={handleInputChange('location')}
            maxLength={20}
            className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] focus:bg-white text-[#0b4f30] font-sans font-medium rounded-lg py-2.5 px-3 outline-none transition-all text-base placeholder-[#0b4f30]/40"
          />
        </div>

        {/* Handle */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="handle" className="text-sm font-label-lg uppercase tracking-wider text-[#0a2e1d]">X/Twitter Handle (Optional)</label>
          <input
            id="handle"
            type="text"
            placeholder="@yourhandle"
            value={details.twitter}
            onChange={handleInputChange('twitter')}
            maxLength={20}
            className="w-full bg-[#faf8f0] border-2 border-[#0a2e1d] focus:bg-white text-[#0b4f30] font-sans font-medium rounded-lg py-2.5 px-3 outline-none transition-all text-base placeholder-[#0b4f30]/40"
          />
        </div>
      </div>

      {/* Generated Title Sticker Badge */}
      {details.title && (
        <div className="mt-4 p-4 border-2 border-[#0a2e1d] bg-[#ff007f] text-[#faf8f0] shadow-[2px_2px_0px_0px_#0a2e1d] flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <span className="text-[9px] font-bold text-[#faf8f0]/80 uppercase tracking-widest block mb-0.5 font-mono">✦ TITLE ASSIGNED</span>
            <span className="font-extrabold text-base font-serif uppercase tracking-tight">{details.title}</span>
          </div>
          <span className="px-3 py-1 bg-[#faf8f0] text-[#ff007f] text-[10px] font-bold font-mono rounded border border-[#0a2e1d]">
            VERIFIED
          </span>
        </div>
      )}
    </div>
  );
}
