import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  // Function to determine banner color based on event name
  const getBannerColor = (name) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('united') || n.includes('chelsea')) return '#C8102E'; // Red
    if (n.includes('madrid') || n.includes('barcelona')) return '#003DA5'; // Blue
    if (n.includes('amavubi') || n.includes('rwanda')) return '#009A44'; // Green
    return '#2a2a2a'; // Default Gray
  };

  const bannerColor = getBannerColor(event.name);

  // Extract team names for "VS" display if applicable
  const teams = event.name?.split(' vs ') || event.name?.split(' VS ') || [event.name, ''];

  return (
    <div 
      onClick={() => navigate(`/events/${event.id}`)}
      className="bg-[#111] border border-[#1e1e1e] cursor-pointer group hover:border-[#D4AF37] transition-all"
    >
      {/* Top Banner */}
      <div 
        className="h-[80px] relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bannerColor }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        <div className="flex flex-col items-center z-10">
          <span className="font-['Bebas_Neue'] text-2xl text-white tracking-[2px]">
            {teams[1] ? 'VS' : 'EVENT'}
          </span>
          {teams[1] && (
            <div className="text-[8px] uppercase tracking-[1px] text-white/70">
              {teams[0]} — {teams[1]}
            </div>
          )}
        </div>

        {/* Optional Tag */}
        {event.isHot && (
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#111] px-2 py-0.5 text-[8px] font-bold tracking-[1px] uppercase">
            HOT
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="text-[10px] uppercase text-[#D4AF37] tracking-[2px] mb-1">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="text-[13px] font-medium text-[#eee] mb-3 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
          {event.name}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-[#666] uppercase tracking-[1px]">
            {event.seatsRemaining || '600+'} Seats Left
          </div>
          <div className="text-[12px] font-['Bebas_Neue'] text-[#C8102E] tracking-[1px]">
            FROM ${event.price || '40'}
          </div>
        </div>
      </div>
    </div>
  );
}
