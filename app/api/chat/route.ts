import { streamText} from 'ai';
import { tool } from 'ai';
import { google } from '@ai-sdk/google';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import {z}from 'zod'

interface TokenPayload {
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
   
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    const userId = decoded.userId;

    const { messages, tripId } = await req.json();
    
  
    
    const lastMessage = messages[messages.length - 1];

    let currentTripId = tripId;

    
    // if (!currentTripId) {
    //   const newTrip = await prisma.trip.create({
    //     data: {
    //       userId: userId,
    //       places: [] 
    //     }
    //   });
    //   currentTripId = newTrip.id;
    // }
if (!currentTripId) {
      const newTrip = await prisma.trip.create({
        data: {
          userId: userId,
          places: [],
          // Pehle message ke 30 characters ko title bana diya
          title: lastMessage.content.slice(0, 30) + (lastMessage.content.length > 30 ? "..." : "")
        }
      });
      currentTripId = newTrip.id;

    await prisma.message.create({
      data: {
        tripId: currentTripId,
        role: "USER",
        content: lastMessage.content
      }
    });}

    

    
const systemPrompt = `
      You are an expert AI Travel Planner. Your goal is to help users plan trips efficiently.

      RULES:
      1. CONVERSATION: Be friendly and concise. 
      2. DATA OUTPUT: Whenever a user asks to plan a trip, YOU MUST CALL the 'updateItinerary' tool.
      3. CRITICAL JSON STRUCTURE: The 'itinerary' array MUST be a FLAT list of objects. DO NOT create nested 'activities' arrays. DO NOT add fields like 'theme' or 'description'. 
      
      You MUST strictly follow this exact structure for every single place in the itinerary array:
      [
        {
          "day": 1,
          "location": "Amber Fort",
          "activity": "Explore the stunning architecture.",
          "duration_hours": 2,
          "category": "sightseeing" 
        },
        {
          "day": 1,
          "location": "Local Restaurant",
          "activity": "Eat traditional Rajasthani food.",
          "category": "food"
        }
      ]
      Note: 'category' MUST ONLY be one of: 'sightseeing', 'food', 'adventure', or 'rest'.

      4. FORBIDDEN: DO NOT print the full list of activities or day-by-day plan in your text response. 
      5. TEXT RESPONSE: Keep text responses to 1-2 sentences. Example: "I've added the places to your trip plan! Check the itinerary on the right."
    `;
  
    const result = streamText({
      model: google('gemini-2.5-flash'), 
      system: systemPrompt,
      temperature: 0.3,
      maxSteps: 3,
      messages: messages, 
   onError: ({ error }) => {
        console.error("🚨 ASLI STREAM ERROR YAHAN HAI:", error);
      },


      tools: {
        updateItinerary: tool({
          description: 'Updates the structured JSON itinerary in the database when places are added, changed, or finalized.',
          parameters: z.object({
            itinerary: z.array(
              z.object({
                day: z.number().describe('Day number, e.g., 1, 2, 3'),
                location: z.string().describe('Name of the spot or city'),
                activity: z.string().describe('What to do there'),
                duration_hours: z.number().optional(),                 
                category: z.enum(['sightseeing', 'food', 'adventure', 'rest'])
              })
            ).describe("The array containing the list of all daily activities and places to visit."),
          }),
          //@ts-ignore
          execute: async ({ itinerary}:any) => {
           
            await prisma.trip.update({
              where: { id: currentTripId },
              data: { places: itinerary as any },
            });
            return { message: 'Itinerary updated successfully in sidebar!' };
          },
        }),
      },
     
      async onFinish({ text }) {
       
        await prisma.message.create({
          data: {
            tripId: currentTripId,
            role: "AI",
            content: text
          }
        });
       
      },
    });

    
    return result.toDataStreamResponse({
        headers: {
            'x-trip-id': currentTripId
        }
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "AI phat gaya bhai" }, { status: 500 });
  }
}
