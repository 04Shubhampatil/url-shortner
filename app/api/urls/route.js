import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongoose';
import Url from '@/models/Url';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    const shortId = uuidv4().split('-')[0];

    await dbConnect();
    const newUrl = await Url.create({
      shortId,
      redirectURL: url,
      userId: user.userId,
      visitHistory: [],
    });

    return NextResponse.json(newUrl, { status: 201 });
  } catch (error) {
    console.error('Create URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const urls = await Url.find({ userId: user.userId }).sort({ createdAt: -1 });

    return NextResponse.json(urls, { status: 200 });
  } catch (error) {
    console.error('Fetch URLs error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await dbConnect();
    const result = await Url.deleteOne({ _id: id, userId: user.userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'URL not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'URL deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
