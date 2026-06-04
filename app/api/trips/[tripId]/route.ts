
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> } 
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tripId } = await params;

   
    const tripData = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!tripData) {
      return NextResponse.json({ error: "Trip  not found " }, { status: 404 });
    }

    return NextResponse.json({ trip: tripData });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}