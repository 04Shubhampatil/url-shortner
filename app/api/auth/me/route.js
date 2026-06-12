import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ name: user.name, email: user.email }, { status: 200 });
  } catch (error) {
    console.error('Fetch me error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
