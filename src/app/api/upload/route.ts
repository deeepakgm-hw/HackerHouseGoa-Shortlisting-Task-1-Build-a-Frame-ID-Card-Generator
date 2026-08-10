import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { image, filename } = await request.json();

    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({ success: false, error: 'Invalid image data' }, { status: 400 });
    }

    // Check if token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN is not configured. Saving generated assets is disabled.');
      return NextResponse.json({
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is missing',
        message: 'Cloud saving is disabled. Falling back to local sharing options.'
      });
    }

    // Extract base64 content
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const cleanFilename = (filename || 'hh-goa-builder').replace(/[^a-zA-Z0-9-]/g, '') + '.png';

    // Upload to Vercel Blob
    const blob = await put(`hh-goa-2026/${Date.now()}-${cleanFilename}`, buffer, {
      contentType: 'image/png',
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (err: unknown) {
    console.error('Image upload failed:', err);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
