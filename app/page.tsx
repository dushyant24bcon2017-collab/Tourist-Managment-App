import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBar from './custom_components/SideBar'
import MainChat from './custom_components/MainChat'
import Itennarary from './custom_components/Itennarary'
const page = () => {
  return (
     <SidebarProvider>
      <SideBar />
      <main className=' flex-1 w-full'>

        <div className='flex flex-row gap-12 w-full h-screen overflow-hidden'>
          <SidebarTrigger />
        <div className='flex-1'>
        <MainChat/>
        </div>
       
        </div>
        
      </main>
    </SidebarProvider>
   
  )
}

export default page
