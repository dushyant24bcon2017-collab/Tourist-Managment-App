'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Plus, LogOut, MessageSquare } from 'lucide-react';

import { jwtDecode } from 'jwt-decode';

const SideBar = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('User');
  const router = useRouter();

  useEffect(() => {
    
    const fetchTrips = async () => {
      try {
        const res = await fetch('/api/trips'); 
        const data = await res.json();
        if (data.trips) setTrips(data.trips);
      } catch (error) {
        console.error("Sidebar trips fetch kalesh:", error);
      }
    };
    fetchTrips();

    
    const decodeToken = () => {
      try {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token='));

        if (!tokenCookie) {
          console.error('Unauthorized: No auth token found in cookies');
          return;
        }

        // Token nikaalo ('auth_token=eyJ...' se sirf 'eyJ...' lo)
        const tokenString = tokenCookie.split('=')[1];
        
        // Token decode karo
        const decoded: any = jwtDecode(tokenString);
        
        // Agar token mein 'name' save hai toh usko state mein set kardo
        if (decoded && decoded.name) {
          setUserName(decoded.name);
        }
      } catch (error) {
        console.error("Token decoding mein kalesh:", error);
      }
    };
    
    decodeToken();
  }, []);

  const handleLogout = async() => {
    
    await fetch('/api/logout', { method: 'POST' }); 
    router.push('/login')
  };
  return (
    <Sidebar>
      {/* TERI PURANI BOLD TYPOGRAPHY WAPAS LAA DI HAI */}
      <SidebarHeader className='text-center text-4xl font-extrabold tracking-tight text-balance p-6 pb-2'>
        Hello {userName}
      </SidebarHeader>

      <div className="px-4 pb-4">
        {/* New Chat Button */}
        <SidebarMenuButton 
         onClick={() => window.location.href = '/'}
          className="w-full bg-black text-white hover:bg-gray-800 flex justify-center py-5 rounded-lg"
        >
          <Plus size={18} /> <span className="text-base">New Chat</span>
        </SidebarMenuButton>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold">Recent Trips</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trips.map((trip) => (
                <SidebarMenuItem key={trip.id}>
                  <SidebarMenuButton asChild className="hover:bg-gray-100 transition-colors">
                    <Link href={`/chat/${trip.id}`}>
                      <MessageSquare size={16} />
                      <span className="font-medium truncate">
                        {trip.title || "New Conversation"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:bg-red-50">
          <LogOut size={16} /> Logout
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;