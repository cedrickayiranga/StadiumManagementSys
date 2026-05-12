import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] bg-[#0a0a0a]">
        <div className="border-4 border-t-[#C8102E] rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-12 text-center">
        <h2 className="font-['Bebas_Neue'] text-4xl text-[#C8102E] tracking-[2px] mb-4">EVENT NOT FOUND</h2>
        <p className="text-[#666] mb-8 uppercase tracking-[1px] text-xs">The event you are looking for does not exist or has been removed.</p>
        <Link to="/events" className="bg-[#D4AF37] text-[#111] px-8 py-3 font-['Bebas_Neue'] text-xl tracking-[3px]">BACK TO EVENTS</Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Event Header Section */}
      <div className="relative h-[400px] bg-[#111] border-b border-[#222] overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 1000" className="w-full h-full opacity-20">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" />
            </pattern>
            <rect width="1000" height="1000" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>

        <div className="relative z-10 h-full flex flex-col justify-end px-12 pb-12 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#C8102E] text-white text-[10px] font-bold px-3 py-1 tracking-[2px] uppercase">
              Live Event
            </span>
            <span className="text-[#D4AF37] text-[10px] tracking-[2px] uppercase">
              AMAHORO STADIUM
            </span>
          </div>
          
          <h1 className="font-['Bebas_Neue'] text-white text-[72px] leading-none tracking-[2px] mb-4">
            {event.name}
          </h1>

          <div className="flex gap-12 text-[#888] text-xs uppercase tracking-[2px]">
            <div>
              <span className="block text-[#444] text-[8px] mb-1">DATE</span>
              {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div>
              <span className="block text-[#444] text-[8px] mb-1">TIME</span>
              {event.time ? event.time.substring(0, 5) : '12:00'}
            </div>
            <div>
              <span className="block text-[#444] text-[8px] mb-1">LOCATION</span>
              {event.stadium?.name || 'AMAHORO STADIUM'}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1200px] mx-auto px-12 py-16 grid grid-cols-3 gap-16">
        <div className="col-span-2 space-y-12">
          <div>
            <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-[2px] mb-6 flex items-center">
              <span className="text-[#C8102E] mr-2">//</span> EVENT DESCRIPTION
            </h3>
            <p className="text-[#aaa] leading-relaxed">
              Experience the thrill of {event.name} at the iconic Amahoro Stadium. 
              Join thousands of fans for this spectacular event. Amahoro Stadium offers 
              world-class facilities and an electric atmosphere that makes every event unforgettable.
            </p>
          </div>

          <div>
            <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-[2px] mb-6 flex items-center">
              <span className="text-[#C8102E] mr-2">//</span> VENUE INFO
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-[#111] p-6 border border-[#1a1a1a]">
                <div className="text-[8px] text-[#444] uppercase tracking-[2px] mb-2">Gate Opening</div>
                <div className="text-[#eee] text-sm uppercase font-bold tracking-[1px]">2 Hours Before Kickoff</div>
              </div>
              <div className="bg-[#111] p-6 border border-[#1a1a1a]">
                <div className="text-[8px] text-[#444] uppercase tracking-[2px] mb-2">Capacity</div>
                <div className="text-[#eee] text-sm uppercase font-bold tracking-[1px]">60,000 Seats</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-[#111] border border-[#1e1e1e] p-8 sticky top-[80px]">
            <div className="text-[9px] uppercase tracking-[3px] text-[#666] mb-2">Starting From</div>
            <div className="font-['Bebas_Neue'] text-[48px] text-[#D4AF37] leading-none mb-8">$40</div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-[#aaa] text-[10px] uppercase tracking-[1px]">
                <svg className="w-4 h-4 text-[#009A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Digital Tickets Only
              </div>
              <div className="flex items-center gap-3 text-[#aaa] text-[10px] uppercase tracking-[1px]">
                <svg className="w-4 h-4 text-[#009A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Instant Confirmation
              </div>
              <div className="flex items-center gap-3 text-[#aaa] text-[10px] uppercase tracking-[1px]">
                <svg className="w-4 h-4 text-[#009A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Refundable up to 24h
              </div>
            </div>

            <button 
              onClick={() => navigate(`/events/${id}/book`)}
              className="w-full bg-[#C8102E] text-white py-4 font-['Bebas_Neue'] text-2xl tracking-[4px] hover:bg-[#a00d25] transition-colors"
            >
              BOOK NOW
            </button>
            
            <p className="text-[8px] text-[#444] uppercase tracking-[1px] text-center mt-4">
              Secure Checkout — SSL Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
