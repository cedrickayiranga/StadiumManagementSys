import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // First get user's bookings (which now include tickets due to JPA mapping)
        const bookingsRes = await api.get(`/api/bookings/by-user/${user.id}`);
        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        
        // Flatten all tickets from all bookings
        const allTickets = bookings.flatMap(b => (b.tickets || []).map(t => ({
          ...t,
          event: b.event // Ensure event data is attached if missing in ticket
        })));
        
        setTickets(allTickets);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchTickets();
  }, [user?.id]);

  const getEventColor = (name) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('united') || n.includes('chelsea')) return '#C8102E';
    if (n.includes('madrid') || n.includes('barcelona')) return '#003DA5';
    if (n.includes('amavubi') || n.includes('rwanda')) return '#009A44';
    return '#D4AF37';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] bg-[#0a0a0a]">
        <div className="border-4 border-t-[#C8102E] rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-12 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-12 print:hidden">
        <h1 className="font-['Bebas_Neue'] text-3xl tracking-[3px] text-white flex items-center">
          <span className="text-[#C8102E] mr-2">//</span> MY TICKETS — {user?.name?.toUpperCase()}
        </h1>
        <button 
          onClick={() => window.print()}
          className="bg-[#D4AF37] text-black px-6 py-2 font-['Bebas_Neue'] text-lg tracking-[2px] hover:bg-[#b8962d] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          PRINT ALL
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .ticket-card { 
            break-inside: avoid; 
            border: 2px solid black !important;
            margin-bottom: 20px !important;
            background: white !important;
            color: black !important;
          }
          .ticket-card * { color: black !important; border-color: #ddd !important; }
          .ticket-header-strip { background: black !important; -webkit-print-color-adjust: exact; }
          .qr-code { border: 1px solid black !important; }
        }
      `}} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block">
        {tickets.length > 0 ? (
          tickets.map(ticket => {
            const color = getEventColor(ticket.event?.name);
            const ticketDate = new Date(ticket.event?.date);
            
            return (
              <div key={ticket.id} className="ticket-card bg-[#111] border border-[#1e1e1e] relative overflow-hidden flex flex-col print:mb-8">
                {/* Top colored strip */}
                <div className="h-1 ticket-header-strip" style={{ backgroundColor: color }}></div>
                
                {/* Body */}
                <div className="p-6 flex justify-between items-start gap-4">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="font-['Bebas_Neue'] text-xl text-white tracking-[1px] leading-tight">
                        {ticket.event?.name}
                      </h3>
                      <div className="text-[10px] text-[#666] uppercase tracking-[2px] mt-1">
                        {ticketDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        <br />
                        {ticket.event?.stadium?.name || 'AMAHORO STADIUM'}, KIGALI
                        <br />
                        <span className="font-bold text-[#888]">TIME: {ticket.event?.time ? ticket.event.time.substring(0, 5) : '12:00'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-8">
                      <div>
                        <div className="text-[8px] text-[#444] uppercase tracking-[2px] mb-1">SECTION</div>
                        <div className="text-[11px] text-[#D4AF37] uppercase tracking-[1px] font-bold">{ticket.section || 'GENERAL'}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-[#444] uppercase tracking-[2px] mb-1">PRICE</div>
                        <div className="text-[11px] text-[#D4AF37] uppercase tracking-[1px] font-bold">${ticket.price}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-[#444] uppercase tracking-[2px] mb-1">SEAT</div>
                        <div className="text-[11px] text-[#eee] uppercase tracking-[1px] font-bold">GA-{Math.floor(Math.random() * 500) + 1}</div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="qr-code w-[80px] h-[80px] bg-[#1a1a1a] border border-[#222] p-2 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#333]">
                      <rect width="100" height="100" fill="none" />
                      <path d="M10,10 H30 V30 H10 Z M70,10 H90 V30 H70 Z M10,70 H30 V90 H10 Z M40,40 H60 V60 H40 Z" fill="currentColor" />
                      <rect x="15" y="15" width="5" height="5" fill="#444" />
                      <rect x="75" y="15" width="5" height="5" fill="#444" />
                      <rect x="15" y="75" width="5" height="5" fill="#444" />
                    </svg>
                  </div>
                </div>

                {/* Bottom dashed separator */}
                <div className="border-t border-dashed border-[#222] mx-6"></div>

                {/* Footer Strip */}
                <div className="bg-[#0d0d0d] px-6 py-3 flex justify-between items-center">
                  <div className="text-[9px] uppercase tracking-[2px] text-[#555]">
                    REF: AMA-2026-{ticket.id.toString().substring(0, 8).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009A44]"></span>
                    <span className="text-[9px] uppercase tracking-[1px] text-[#009A44] font-bold">VALID TICKET</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-32 text-center border border-dashed border-[#1a1a1a]">
            <p className="text-[#444] text-[10px] uppercase tracking-[3px]">You haven't booked any tickets yet</p>
            <Link to="/events" className="text-[#D4AF37] text-[10px] uppercase tracking-[2px] mt-4 inline-block hover:underline">
              Browse Upcoming Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
