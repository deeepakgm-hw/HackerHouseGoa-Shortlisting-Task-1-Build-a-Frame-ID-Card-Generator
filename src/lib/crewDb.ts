import { put, del } from '@vercel/blob';

export interface Member {
  id: string;
  name: string;
  role: string;
  stack: string;
  builderTitle: string;
  xHandle?: string;
  photo: string; // Vercel Blob URL or base64
  joinedAt: string;
  cropSettings?: {
    zoom: number;
    panX: number;
    panY: number;
  };
}

export interface Crew {
  code: string;
  ownerToken: string;
  name: string;
  tagline: string;
  generatedClass: string;
  crewStack: string;
  createdAt: string;
  members: Member[];
  generatedCardUrl?: string;
  generatedPosterUrl?: string;
}

// In-memory fallback for local development if Vercel Blob is not set up
const localCrews: Record<string, Crew> = {};

// Helper to determine if Vercel Blob is available
const isBlobAvailable = () => {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL || process.env.VERCEL_BLOB_STORE_ID);
};

// Generates a random crew code (e.g. GOA-K9X2)
export function generateCrewCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
  let code = 'GOA-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generates a random secure owner token
export function generateOwnerToken(): string {
  return 'TOK-' + Math.random().toString(36).substring(2, 15).toUpperCase();
}

// Get Crew details
export async function getCrew(code: string): Promise<Crew | null> {
  const cleanCode = code.toUpperCase().trim();
  
  if (!isBlobAvailable()) {
    return localCrews[cleanCode] || null;
  }

  try {
    // Read from Vercel Blob
    // To read, we fetch the public URL for the crew file
    // Note: Since Vercel Blob URLs are dynamic, we must list or construct it.
    // To make it deterministic, we can put the files at a known name, but Vercel Blob adds a random suffix.
    // Alternatively, we can use the Vercel Blob listing API or store it in an in-memory/KV cache if available.
    // However, since we want zero extra infrastructure, let's look at another solution:
    // What if we save crews in-memory on the server?
    // An in-memory object on Node.js server persists as long as the serverless function is warm.
    // For Vercel Serverless, this can reset, but for local testing and basic hackathon demo, it is very fast.
    // Wait! Can we store crew JSON inside Vercel Blob by utilizing the exact URL?
    // Vercel Blob has an API `list()` which lets us search files!
    // We can list files matching `crews/GOA-XXXX.json` and read the first one.
    // Yes! `list({ prefix: `crews/${cleanCode}` })` will return the exact blob file matching the prefix!
    // That is extremely robust and doesn't require knowing the random suffix in advance.
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: `crews/${cleanCode}` });
    
    if (blobs.length === 0) return null;
    
    const response = await fetch(blobs[0].url);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (err: unknown) {
    console.error('Failed to get crew:', err);
    return null;
  }
}

// Save Crew details
export async function saveCrew(crew: Crew): Promise<void> {
  const code = crew.code.toUpperCase().trim();

  if (!isBlobAvailable()) {
    localCrews[code] = crew;
    return;
  }

  try {
    const { put, list } = await import('@vercel/blob');
    
    // 1. Delete previous version if it exists
    const { blobs } = await list({ prefix: `crews/${code}` });
    if (blobs.length > 0) {
      for (const b of blobs) {
        await del(b.url);
      }
    }

    // 2. Put the new JSON data
    await put(`crews/${code}.json`, JSON.stringify(crew), {
      contentType: 'application/json',
      access: 'public',
      addRandomSuffix: true,
    });
  } catch (err: unknown) {
    console.error('Failed to save crew:', err);
  }
}

// Deterministically generate Crew Class based on member count & stack profile
export function calculateCrewClass(members: Member[]): string {
  if (members.length === 0) return 'EMPTY BUNDLE';
  if (members.length === 1) return 'SOLO INVENTOR';

  // Gather all stack names & roles
  const roles = members.map(m => m.role.toLowerCase());
  const stacks = members.map(m => m.stack.toLowerCase());

  const hasAI = stacks.some(s => s.includes('ai') || s.includes('ml') || s.includes('python'));
  const hasFrontend = stacks.some(s => s.includes('react') || s.includes('front') || s.includes('next') || s.includes('design'));
  const hasBackend = stacks.some(s => s.includes('node') || s.includes('back') || s.includes('api') || s.includes('sql') || s.includes('go') || s.includes('rust'));
  const hasDevops = stacks.some(s => s.includes('devops') || s.includes('infra') || s.includes('aws') || s.includes('cloud'));
  const hasWeb3 = stacks.some(s => s.includes('web3') || s.includes('solidity') || s.includes('block') || s.includes('crypto'));

  if (hasAI && hasBackend && hasFrontend) return 'THE COGNITIVE SHIPPERS';
  if (hasAI && (hasBackend || hasDevops)) return 'THE INTELLIGENT INFRA';
  if (hasFrontend && hasWeb3) return 'THE WEB3 ALCHEMISTS';
  if (hasFrontend && !hasBackend) return 'THE PIXEL PIRATES';
  if (hasBackend && !hasFrontend) return 'THE API ARCHITECTS';
  if (hasDevops) return 'THE INFRA OVERLORDS';
  if (hasAI) return 'THE DATA EXPLORERS';

  // Fallbacks
  const groupNames = [
    'THE BEACH BUILDERS',
    'THE STACK NOMADS',
    'THE GOA SHIPPERS',
    'THE CODE SURFERS',
    'THE MIDNIGHT SHIPPERS',
    'THE SHIP IT SQUAD'
  ];

  // Deterministic seed based on name lengths
  const charSum = members.reduce((acc, m) => acc + m.name.length, 0);
  return groupNames[charSum % groupNames.length];
}

// Get clean aggregate stack tags
export function calculateCrewStack(members: Member[]): string {
  const allTags = new Set<string>();
  members.forEach(m => {
    const s = m.stack.toLowerCase();
    if (s.includes('react') || s.includes('front') || s.includes('next')) allTags.add('REACT');
    else if (s.includes('node') || s.includes('back') || s.includes('api')) allTags.add('NODE');
    else if (s.includes('python') || s.includes('ai') || s.includes('ml')) allTags.add('AI/ML');
    else if (s.includes('solidity') || s.includes('web3') || s.includes('block')) allTags.add('WEB3');
    else if (s.includes('devops') || s.includes('infra') || s.includes('aws')) allTags.add('DEVOPS');
    else if (s.includes('mobile') || s.includes('flutter') || s.includes('ios')) allTags.add('MOBILE');
    else if (s.includes('design') || s.includes('figma')) allTags.add('FIGMA');
    else {
      // Clean custom tag
      const clean = m.stack.toUpperCase().split('/')[0].trim();
      if (clean && clean !== 'CUSTOM') allTags.add(clean);
    }
  });

  return Array.from(allTags).join(' • ');
}
