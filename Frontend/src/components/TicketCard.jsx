import React from 'react';

export default function TicketCard({ ticket }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] flex overflow-hidden group">
      {/* Side Color Bar */}
      <div className="w-1.5 bg-[#C8102E]"></div>
      
      <div className="p-4 flex-1 flex justify-between items-center">
        <div>
          <div className="text-[9px] text-[#666] uppercase tracking-[2px] mb-1">Section: {ticket.section}</div>
          <h4 className="font-['Bebas_Neue'] text-lg text-[#eee] tracking-[1px] group-hover:text-[#D4AF37] transition-colors">
            {ticket.event?.name}
          </h4>
          <div className="text-[10px] text-[#444] mt-1 uppercase tracking-[1px]">
            Ticket ID: {ticket.id}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[14px] font-['Bebas_Neue'] text-[#D4AF37] tracking-[1px]">${ticket.price}</div>
          <div className="text-[8px] text-[#009A44] uppercase font-bold tracking-[1px]">Valid</div>
        </div>
      </div>
    </div>
  );
}
