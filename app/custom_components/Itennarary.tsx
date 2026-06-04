import React from 'react';
import { MapPin, Clock, CalendarDays, Navigation, Utensils, Camera, Mountain, Coffee } from 'lucide-react';

// 1. Tera Naya TypeScript Schema
export interface ItineraryItem {
  day: number;
  location: string;
  activity: string;
  duration_hours?: number;
  category: 'sightseeing' | 'food' | 'adventure' | 'rest';
}

interface ItineraryProps {
  data: {
    destination?: string; // AI ko destination bhi dene bol dena, warna hum default laga denge
    itinerary: ItineraryItem[];
  } | null;
}

const ItineraryPanel = ({ data }: ItineraryProps) => {
  // Agar data khali hai
  if (!data || !data.itinerary || data.itinerary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
        <Navigation size={48} className="mb-4 text-gray-300" />
        <p className="text-xl font-bold text-gray-700">Trip Canvas is Empty!</p>
        <p className="text-sm text-center mt-2">
         Tell your dream destination to our smart AI, the plan will be displayed here✨
        </p>
      </div>
    );
  }

  // 2. Flat array ko Day ke hisaab se group karo (Frontend Magic)
  // Yeh tere flat array ko { 1: [activities], 2: [activities] } mein convert kar dega
  const groupedItinerary = data.itinerary.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  // 3. Category ke hisaab se mast Icon nikaalne ka function
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils size={18} className="text-orange-500" />;
      case 'adventure': return <Mountain size={18} className="text-green-600" />;
      case 'rest': return <Coffee size={18} className="text-purple-500" />;
      case 'sightseeing': 
      default: return <Camera size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200 custom-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm pb-4 border-b z-10 mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-gray-900">
          <MapPin className="text-blue-600" size={24} />
          {data.destination ? `Trip to ${data.destination}` : "Your Itinerary"}
        </h2>
      </div>

      <div className="space-y-8">
        {/* Object.keys se hum grouped data ko map kar rahe hain */}
        {Object.entries(groupedItinerary).map(([dayString, activities]) => (
          <div key={dayString} className="relative pl-6 border-l-2 border-blue-100">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1 bg-blue-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
            
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays size={20} className="text-blue-500" />
              Day {dayString}
            </h3>
            
            {/* Activities List */}
            <div className="mt-4 space-y-4">
              {activities.map((item, actIndex) => (
                <div key={actIndex} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all">
                  
                  {/* Title & Category Header */}
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      {/* Dynamic Icon yahan aayega */}
                      {getCategoryIcon(item.category)} 
                      {item.location}
                    </h4>
                    
                    {/* Duration Badge */}
                    {item.duration_hours && (
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                        <Clock size={12} /> {item.duration_hours} hrs
                      </span>
                    )}
                  </div>
                  
                  {/* Activity Description */}
                  <p className="text-sm text-gray-600 pl-7">{item.activity}</p>
                  
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryPanel;