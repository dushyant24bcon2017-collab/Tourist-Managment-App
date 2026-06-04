
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    
    
    const trips = await prisma.trip.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          take: 1, 
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return NextResponse.json({ trips });
  } catch (error) {
    return NextResponse.json({ error: "sever error" }, { status: 500 });
  }
}