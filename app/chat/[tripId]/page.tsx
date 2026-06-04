import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBar from '@/app/custom_components/SideBar'
import MainChat from '@/app/custom_components/MainChat'
import Itennarary from '@/app/custom_components/Itennarary'

// Next.js 15+ mein dynamic params async hote hain
export default async function ChatPage({ params }: { params: Promise<{ tripId: string }> }) {
  // URL se tripId nikaal li (e.g., /chat/123 -> tripId '123' hogi)
  const { tripId } = await params;

  return (
     <SidebarProvider>
      <SideBar />
      <main className='flex-1 w-full'>
        <div className='flex flex-row gap-12 w-full h-screen overflow-hidden'>
          <SidebarTrigger />
          <div className='flex-1'>
            
            <MainChat existingTripId={tripId} />
          </div>
          
        </div>
      </main>
    </SidebarProvider>
  )
}