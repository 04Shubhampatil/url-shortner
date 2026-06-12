import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Url from '@/models/Url';

export async function GET(request, { params }) {
  const { shortId } = await params;

  try {
    await dbConnect();
    const urlEntry = await Url.findOne({ shortId });

    if (!urlEntry) {
      return NextResponse.json({ message: 'URL not found' }, { status: 404 });
    }

    urlEntry.visitHistory.push({ timestamp: Date.now() });
    await urlEntry.save();

    return NextResponse.redirect(urlEntry.redirectURL);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
