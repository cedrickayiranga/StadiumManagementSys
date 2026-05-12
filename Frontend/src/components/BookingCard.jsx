import React from 'react';

export default function BookingCard({ booking }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#D4AF37] transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] text-[#D4AF37] uppercase tracking-[2px] mb-1">Booking #{booking.id}</div>
          <h3 className="font-['Bebas_Neue'] text-xl text-white tracking-[1px]">{booking.event?.name}</h3>
        </div>
        <div className="bg-[rgba(0,154,68,0.1)] border border-[rgba(0,154,68,0.2)] text-[#009A44] text-[9px] px-2 py-0.5 font-bold uppercase tracking-[1px]">
          Confirmed
        </div>
      </div>

      <div className="flex gap-8 text-[10px] uppercase tracking-[1px] text-[#666]">
        <div>
          <span className="block text-[8px] text-[#333] mb-1">Date</span>
          <span className="text-[#aaa]">{new Date(booking.event?.date).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block text-[8px] text-[#333] mb-1">Time</span>
          <span className="text-[#aaa]">{new Date(booking.event?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
