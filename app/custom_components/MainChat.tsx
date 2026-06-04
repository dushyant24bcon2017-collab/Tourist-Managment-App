// import React from 'react'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// const MainChat = () => {
//   return (
//  <>
//  <div className='flex flex-col h-screen w-full'>
//     <div className="flex-1 overflow-y-auto p-4">
      
//       </div>
//       <div className='flex justify-center items-end '> 
// <Input className='flex  mb-24 w-2xl border-3 h-13' placeholder='Please Enter Where Do You Wanna Go For Your Dream Vacation 🌍'>

// </Input>
// <Button className='mb-24 w-20 h-13'> Search</Button>
// </div>

// </div>
//  </>
//   )
// }

// export default MainChat
// 'use client';

// import { useChat } from '@ai-sdk/react';
// import { useState, useEffect } from 'react';
// import { useRef } from 'react';

// interface MainChatProps {
//   existingTripId?: string;
// }

// export default function MainChat({ existingTripId }: MainChatProps) {
  
//   const [currentTripId, setCurrentTripId] = useState<string | null>(existingTripId || null);

//   const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
//     api: '/api/chat',
    
//     body: {
//       tripId: currentTripId 
//     },
//     onError: (error) => {
//       console.error("🚨 2. SDK KE ANDAR ERROR AAYA:", error);
//       alert("Bhai SDK Phat Gaya! Error: " + error.message);
//     },
    
//     onResponse: (response) => {
//       const newTripId = response.headers.get('x-trip-id');
      
      
//       if (newTripId && !currentTripId) {
//         setCurrentTripId(newTripId);
//         console.log("Naya Trip ID mil gaya:", newTripId);
        
        
//         window.history.pushState({}, '', `/chat/${newTripId}`);
//       }
//     }
//   });

 
//   useEffect(() => {
//     if (existingTripId) {
     
//       const fetchOldMessages = async () => {
//         try {
//           // Humari banayi hui GET API ko call maaro
//           const res = await fetch(`/api/trips/${existingTripId}`);
//           const data = await res.json();

//           if (data.trip && data.trip.messages) {
           
//             const formattedMessages = data.trip.messages.map((m: any) => ({
//               id: m.id,
//               role: m.role === 'AI' ? 'assistant' : 'user', 
//               content: m.content
//             }));
            
            
//             setMessages(formattedMessages);
//           }
//         } catch (error) {
//           console.error("Purani chat laane mein kalesh ho gaya:", error);
//         }
//       };

//       fetchOldMessages();
//     }
//   }, [existingTripId]);

//   return (
//     <div className="flex flex-col h-[85vh] w-full max-w-3xl mx-auto  bg-white">
      
//       {/* Header section */}
//       <div className=" pb-3 mb-3 text-center">
//         <h2 className="text-xl font-bold text-gray-800"> AI Travel Planner</h2>
       
//       </div>

//       {/* Chat History Area */}
//       <div className="flex-1 overflow-y-auto mb-4 p-10 space-y-6 ">
//         {messages.length === 0 ? (
//           <div className="flex flex-col items-center justify-start h-full space-y-4 mt-10">
           
//             <p className="text-center text-4xl font-extrabold tracking-tight text-balance">Welcome traveler! Ready to explore?🌴</p>
//             <p className="text-sm">Tell me your destination and I'll guide you.</p>
//           </div>
//         ) : (
//           messages.map((m) => (
//             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div 
//                 className={`px-5 py-3 max-w-[85%] shadow-sm ${
//                   m.role === 'user' 
//                     ? 'bg-blue-600 text-white rounded-2xl ' 
//                     : 'bg-gray-50 text-gray-800  '
//                 }`}
//               >
//                 {/* Pre-wrap ensures that line breaks from AI are rendered properly */}
//                 {/* <span className="whitespace-pre-wrap leading-relaxed">{m.content}</span> */}
//                 <span className="whitespace-pre-wrap leading-relaxed">
//   {typeof m.content === 'string'
//     ? m.content
//     : m.parts
//         ?.filter((p: any) => p.type === 'text')
//         .map((p: any) => p.text)
//         .join('') ?? ''}
// </span>
//               </div>
//             </div>
//           ))
//         )}
        
//         {/* Typing Indicator */}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className=" text-gray-500 px-5 py-3 flex gap-1 items-center ">
//               <span className="animate-bounce">●</span>
//               <span className="animate-bounce delay-100">●</span>
//               <span className="animate-bounce delay-200">●</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input Form */}
//       <form onSubmit={handleSubmit} className="flex gap-1 p-2 bg-white  pt-4 ">
     
//         <input
//           value={input}
//           onChange={handleInputChange}
//           placeholder="e.g. Plan a 3-day trip to Goa with beaches and clubs..."
//           className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none shadow-inner text-black"
//         />
      
//         <button 
//           type="submit" 
//           disabled={isLoading || !input}
//           className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-md"
//         >
//           Send
//         </button>
       
//       </form>
//     </div>
//   );
// }
'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import Itennarary from './Itennarary'; // 👈 DHYAN DE: Component import kiya hai

interface MainChatProps {
  existingTripId?: string;
}

export default function MainChat({ existingTripId }: MainChatProps) {
  
  const [currentTripId, setCurrentTripId] = useState<string | null>(existingTripId || null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    
    body: {
      tripId: currentTripId 
    },
    onError: (error) => {
      console.error("🚨 2. SDK KE ANDAR ERROR AAYA:", error);
      alert("SDK error: " + error.message);
    },
    
    onResponse: (response) => {
      const newTripId = response.headers.get('x-trip-id');
      
      if (newTripId && !currentTripId) {
        setCurrentTripId(newTripId);
        console.log("Naya Trip ID mil gaya:", newTripId);
        window.history.pushState({}, '', `/chat/${newTripId}`);
      }
    }
  });

  useEffect(() => {
    if (existingTripId) {
      const fetchOldMessages = async () => {
        try {
          const res = await fetch(`/api/trips/${existingTripId}`);
          const data = await res.json();

          if (data.trip && data.trip.messages) {
            const formattedMessages = data.trip.messages.map((m: any) => ({
              id: m.id,
              role: m.role === 'AI' ? 'assistant' : 'user', 
              content: m.content
            }));
            
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Purani chat laane mein kalesh ho gaya:", error);
        }
      };

      fetchOldMessages();
    }
  }, [existingTripId, setMessages]);

  // 🚨 ASLI JADOO YAHAN HAI: Messages array se live tool data nikaalo
  const latestToolInvocation = messages
    .flatMap((m) => m.toolInvocations || [])
    .filter((tool) => tool.toolName === 'updateItinerary')
    .pop(); // Sabse aakhiri (latest) wala nikaal lo

  const liveItineraryData = latestToolInvocation ? latestToolInvocation.args : null;

  return (
    // Pura screen 2 hisso mein divide kiya hai: Left (Chat) aur Right (Itinerary)
    <div className="flex w-full h-screen overflow-hidden bg-white">
      
      {/* 🟢 LEFT SIDE: TERA CHAT SECTION */}
      <div className="flex-1 flex flex-col h-full border-r">
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto relative pt-4">
          
          {/* Header section */}
          <div className="pb-3 mb-3 text-center">
            <h2 className="text-xl font-bold text-gray-800">AI Travel Planner</h2>
          </div>

          {/* Chat History Area */}
          <div className="flex-1 overflow-y-auto mb-20 p-4 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-start h-full space-y-4 mt-10">
                <p className="text-center text-4xl font-extrabold tracking-tight text-balance">Welcome traveler! Ready to explore? 🌴</p>
                <p className="text-sm">Tell me your destination and I'll guide you.</p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`px-5 py-3 max-w-[85%] shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl' 
                        : 'bg-gray-50 text-gray-800'
                    }`}
                  >
                    <span className="whitespace-pre-wrap leading-relaxed">
                      {typeof m.content === 'string'
                        ? m.content
                        : m.parts
                            ?.filter((p: any) => p.type === 'text')
                            .map((p: any) => p.text)
                            .join('') ?? ''}
                    </span>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="text-gray-500 px-5 py-3 flex gap-1 items-center">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="absolute bottom-4 left-4 right-4 flex gap-2 bg-white">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="e.g. Plan a 3-day trip to Goa with beaches and clubs..."
              className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none shadow-inner text-black"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input}
              className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-md"
            >
              Send
            </button>
          </form>

        </div>
      </div>

      {/* 🔴 RIGHT SIDE: TERA LIVE ITINERARY PANEL */}
      <div className="w-[450px] hidden lg:block bg-gray-50 h-full">
        <Itennarary 
          // 🚨 LIVE DATA YAHAN PASS HO RAHA HAI
          data={liveItineraryData ? { 
            destination: "Your Custom Trip", // Tu baad mein API se city name nikaal ke yahan daal sakta hai
            itinerary: liveItineraryData.itinerary 
          } : null} 
        />
      </div>

    </div>
  );
}