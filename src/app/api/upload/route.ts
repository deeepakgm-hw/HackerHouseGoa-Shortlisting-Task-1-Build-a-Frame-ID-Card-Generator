import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { image, filename } = await request.json();

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image data provided' }, { status: 400 });
    }

    // Extract content type and base64 content
    const match = image.match(/^data:(image\/[a-zA-Z+.-]+);base64,/);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Invalid image formatting (must be base64 data URI)' }, { status: 400 });
    }
    
    const contentType = match[1];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ success: false, error: 'Unsupported file format. Please upload PNG, JPG, or WEBP.' }, { status: 400 });
    }

    const base64Data = image.split(',')[1];
    if (!base64Data) {
      return NextResponse.json({ success: false, error: 'Malformed base64 string' }, { status: 400 });
    }

    // Validate size (max 15MB)
    const sizeInBytes = (base64Data.length * 3) / 4;
    if (sizeInBytes > 15 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image file is too large. Maximum size is 15MB.' }, { status: 400 });
    }

    // Check if token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) {
      console.warn('BLOB_READ_WRITE_TOKEN is not configured and not running on Vercel. Saving generated assets is disabled.');
      return NextResponse.json({
        success: false,
        error: 'BLOB_READ_WRITE_TOKEN is missing',
        message: 'Cloud saving is disabled. Please verify Vercel Blob store connection.'
      }, { status: 503 });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create clean file extension based on MIME type
    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
    const cleanFilename = (filename || 'hh-goa-builder').replace(/[^a-zA-Z0-9-]/g, '') + `.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(`hh-goa-2026/${Date.now()}-${cleanFilename}`, buffer, {
      contentType,
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
