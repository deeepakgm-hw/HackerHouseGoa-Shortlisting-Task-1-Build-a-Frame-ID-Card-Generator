import { NextResponse } from 'next/server';
import { getCrew, saveCrew, generateCrewCode, generateOwnerToken, calculateCrewClass, calculateCrewStack, Crew, Member } from '../../../lib/crewDb';
import { generateBuilderTitle } from '../../../lib/titleGenerator';
import { put } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ success: false, error: 'Code parameter is required' }, { status: 400 });
  }

  const crew = await getCrew(code);
  if (!crew) {
    return NextResponse.json({ success: false, error: 'Crew not found' }, { status: 404 });
  }

  // Remove ownerToken from public responses for privacy
  const publicCrew = {
    ...crew,
    ownerToken: '', // Obfuscated
  };

  return NextResponse.json({ success: true, crew: publicCrew });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. CREATE CREW ACTION
    if (action === 'create') {
      const { name, tagline, creatorName, creatorRole, creatorStack, creatorTwitter, creatorPhoto } = body;
      if (!name) {
        return NextResponse.json({ success: false, error: 'Crew name is required' }, { status: 400 });
      }

      const code = generateCrewCode();
      const ownerToken = generateOwnerToken();

      let members: Member[] = [];

      if (creatorName && creatorRole && creatorStack && creatorPhoto) {
        let finalPhotoUrl = creatorPhoto;
        
        // Upload photo to Vercel Blob if configured
        if ((process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL) && creatorPhoto.startsWith('data:image/')) {
          try {
            const base64Data = creatorPhoto.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = await put(`crews/photos/${Date.now()}-${creatorName.replace(/[^a-zA-Z0-9]/g, '')}.png`, buffer, {
              contentType: 'image/png',
              access: 'public',
            });
            finalPhotoUrl = blob.url;
          } catch (err: unknown) {
            console.error('Failed to upload creator photo to Vercel Blob:', err);
          }
        }

        const builderTitle = generateBuilderTitle(creatorName, creatorStack, creatorRole);
        
        members.push({
          id: 'MEM-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          name: creatorName.substring(0, 20),
          role: creatorRole,
          stack: creatorStack,
          builderTitle,
          xHandle: creatorTwitter ? (creatorTwitter.startsWith('@') ? creatorTwitter : '@' + creatorTwitter).substring(0, 20) : undefined,
          photo: finalPhotoUrl,
          joinedAt: new Date().toISOString(),
        });
      }

      const newCrew: Crew = {
        code,
        ownerToken,
        name: name.substring(0, 30),
        tagline: (tagline || '').substring(0, 50),
        generatedClass: members.length > 0 ? calculateCrewClass(members) : 'SOLO INVENTOR',
        crewStack: members.length > 0 ? calculateCrewStack(members) : '',
        createdAt: new Date().toISOString(),
        members,
        variantIndex: typeof body.variantIndex === 'number' ? body.variantIndex : 0,
      };

      await saveCrew(newCrew);
      return NextResponse.json({ success: true, crew: newCrew });
    }

    // 2. JOIN CREW ACTION
    if (action === 'join') {
      const { code, name, role, stack, xHandle, photo } = body;

      if (!code || !name || !role || !stack || !photo) {
        return NextResponse.json({ success: false, error: 'Missing required join details' }, { status: 400 });
      }

      const crew = await getCrew(code);
      if (!crew) {
        return NextResponse.json({ success: false, error: 'Crew not found' }, { status: 404 });
      }

      // Check max members
      if (crew.members.length >= 3) {
        return NextResponse.json({ success: false, error: 'Crew is full. Maximum 3 members allowed.' }, { status: 400 });
      }

      // Generate member details
      const builderTitle = generateBuilderTitle(name, stack, role);
      
      let finalPhotoUrl = photo;
      
      // Upload member photo to Vercel Blob if configured and photo is base64
      if ((process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL) && photo.startsWith('data:image/')) {
        try {
          const base64Data = photo.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const blob = await put(`crews/photos/${Date.now()}-${name.replace(/[^a-zA-Z0-9]/g, '')}.png`, buffer, {
            contentType: 'image/png',
            access: 'public',
          });
          finalPhotoUrl = blob.url;
        } catch (err: unknown) {
          console.error('Failed to upload member photo to Vercel Blob, using base64:', err);
        }
      }

      const newMember: Member = {
        id: 'MEM-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        name: name.substring(0, 20),
        role,
        stack,
        builderTitle,
        xHandle: xHandle ? (xHandle.startsWith('@') ? xHandle : '@' + xHandle).substring(0, 20) : undefined,
        photo: finalPhotoUrl,
        joinedAt: new Date().toISOString(),
      };

      // Add to crew list
      crew.members.push(newMember);

      // Recalculate crew metadata
      crew.generatedClass = calculateCrewClass(crew.members);
      crew.crewStack = calculateCrewStack(crew.members);

      await saveCrew(crew);

      // Return public crew (clean token)
      return NextResponse.json({
        success: true,
        crew: { ...crew, ownerToken: '' },
        joinedMember: newMember,
      });
    }

    // 3. REMOVE MEMBER ACTION
    if (action === 'remove') {
      const { code, ownerToken, memberId } = body;

      if (!code || !ownerToken || !memberId) {
        return NextResponse.json({ success: false, error: 'Missing crew credentials or member id' }, { status: 400 });
      }

      const crew = await getCrew(code);
      if (!crew) {
        return NextResponse.json({ success: false, error: 'Crew not found' }, { status: 404 });
      }

      // Validate ownerToken
      if (crew.ownerToken !== ownerToken) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Invalid owner token' }, { status: 403 });
      }

      // Filter out member
      crew.members = crew.members.filter(m => m.id !== memberId);

      // Recalculate metadata
      crew.generatedClass = calculateCrewClass(crew.members);
      crew.crewStack = calculateCrewStack(crew.members);

      await saveCrew(crew);

      return NextResponse.json({ success: true, crew: { ...crew, ownerToken: '' } });
    }

    // 4. UPDATE CROP ACTION
    if (action === 'updateCrop') {
      const { code, memberId, cropSettings } = body;

      if (!code || !memberId || !cropSettings) {
        return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
      }

      const crew = await getCrew(code);
      if (!crew) {
        return NextResponse.json({ success: false, error: 'Crew not found' }, { status: 404 });
      }

      crew.members = crew.members.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            cropSettings
          };
        }
        return m;
      });

      await saveCrew(crew);
      return NextResponse.json({ success: true, crew: { ...crew, ownerToken: '' } });
    }

    // 6. UPDATE THEME ACTION
    if (action === 'updateTheme') {
      const { code, ownerToken, variantIndex } = body;

      if (!code || !ownerToken || typeof variantIndex !== 'number') {
        return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
      }

      const crew = await getCrew(code);
      if (!crew) {
        return NextResponse.json({ success: false, error: 'Crew not found' }, { status: 404 });
      }

      // Validate ownerToken
      if (crew.ownerToken !== ownerToken) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Invalid owner token' }, { status: 403 });
      }

      crew.variantIndex = variantIndex;

      await saveCrew(crew);
      return NextResponse.json({ success: true, crew: { ...crew, ownerToken: '' } });
    }

    // 5. SAVE GENERATED URLS ACTION
    if (action === 'saveUrls') {
      const { code, generatedCardUrl, generatedPosterUrl } = body;

      if (!code) {
        return NextResponse.json({ success: false, error: 'Missing crew code' }, { status: 400 });
      }

      const crew = await getCrew(code);
      if (!crew) {
        return NextResponse.json({ success: false, error: 'Crew not found' }, { status: 404 });
      }

      if (generatedCardUrl) crew.generatedCardUrl = generatedCardUrl;
      if (generatedPosterUrl) crew.generatedPosterUrl = generatedPosterUrl;

      await saveCrew(crew);
      return NextResponse.json({ success: true, crew: { ...crew, ownerToken: '' } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    console.error('API crew failed:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
