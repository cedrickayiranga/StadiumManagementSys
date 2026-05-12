import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#1a1a1a] py-6 px-12 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="font-['Bebas_Neue'] text-[#D4AF37] text-2xl tracking-[3px]">
          AMAHORO
        </div>

        {/* Center */}
        <div className="text-[9px] uppercase tracking-[3px] text-[#555] text-center">
          Stadium Management System — AUCA Software Engineering 2026
        </div>

        {/* Right */}
        <div className="flex gap-6 text-[10px] uppercase tracking-[2px] text-[#888]">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link to="/events" className="hover:text-[#D4AF37] transition-colors">Events</Link>
          <Link to="/my-tickets" className="hover:text-[#D4AF37] transition-colors">My Tickets</Link>
        </div>
      </div>
    </footer>
  );
}
