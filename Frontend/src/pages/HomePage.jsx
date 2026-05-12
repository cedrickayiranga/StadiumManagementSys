import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';

export default function HomePage() {
  const [stats, setStats] = useState({ capacity: '60,000', events: '0', sold: '0' });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, stadiumsRes, ticketsRes] = await Promise.all([
          api.get('/api/events/all'),
          api.get('/api/stadiums/all'),
          api.get('/api/tickets/all').catch(() => ({ data: [] })) // tickets might be empty or restricted
        ]);

        const events = eventsRes.data || [];
        setUpcomingEvents(events.slice(0, 3));
        
        const firstStadium = stadiumsRes.data?.[0];
        setStats({
          capacity: firstStadium?.capacity?.toLocaleString() || '60,000',
          events: events.length.toString(),
          sold: ticketsRes.data?.length?.toString() || '4,200' // mock fallback
        });
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] bg-[#0a0a0a]">
        <div className="border-4 border-t-[#C8102E] rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Hero Section */}
      <section className="h-[320px] relative overflow-hidden flex items-center px-12" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%)' }}>
        {/* SVG pitch background overlay */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.08] pointer-events-none">
          <svg viewBox="0 0 400 300" className="h-full w-full">
            <rect x="10" y="10" width="380" height="280" fill="none" stroke="#fff" strokeWidth="2" />
            <line x1="200" y1="10" x2="200" y2="290" stroke="#fff" strokeWidth="2" />
            <circle cx="200" cy="150" r="40" fill="none" stroke="#fff" strokeWidth="2" />
            <rect x="10" y="80" width="60" height="140" fill="none" stroke="#fff" strokeWidth="2" />
            <rect x="330" y="80" width="60" height="140" fill="none" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[600px]">
          <div className="inline-flex items-center gap-2 bg-[rgba(200,16,46,0.15)] border border-[rgba(200,16,46,0.4)] px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-[2px] text-white">Official Ticketing Platform</span>
          </div>

          <h1 className="font-['Bebas_Neue'] text-white text-[52px] leading-tight tracking-[2px]">
            YOUR SEAT AT <br />
            <span className="text-[#D4AF37]">AMAHORO</span>
          </h1>
          
          <p className="text-[#888] text-sm mt-4 max-w-[400px]">
            Book tickets for every match & event in Kigali. The heart of Rwandan sports and culture.
          </p>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => navigate('/events')}
              className="bg-[#C8102E] text-white px-8 py-3 font-['Bebas_Neue'] text-lg tracking-[3px] hover:bg-[#a00d25] transition-colors"
            >
              BROWSE EVENTS
            </button>
            <button 
              onClick={() => navigate('/my-tickets')}
              className="border border-[#D4AF37] text-[#D4AF37] px-8 py-3 font-['Bebas_Neue'] text-lg tracking-[3px] hover:bg-[rgba(212,175,55,0.05)] transition-colors"
            >
              MY BOOKINGS
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#111] border-y border-[#1e1e1e]">
        <div className="grid grid-cols-4 divide-x divide-[#1e1e1e] py-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center">
            <span className="font-['Bebas_Neue'] text-[30px] text-[#D4AF37] tracking-[1px]">{stats.capacity}</span>
            <span className="text-[10px] uppercase tracking-[2px] text-[#666]">CAPACITY</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-['Bebas_Neue'] text-[30px] text-[#D4AF37] tracking-[1px]">{stats.events}</span>
            <span className="text-[10px] uppercase tracking-[2px] text-[#666]">UPCOMING EVENTS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-['Bebas_Neue'] text-[30px] text-[#D4AF37] tracking-[1px]">{stats.sold}</span>
            <span className="text-[10px] uppercase tracking-[2px] text-[#666]">TICKETS SOLD</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-['Bebas_Neue'] text-[30px] text-[#D4AF37] tracking-[1px]">98%</span>
            <span className="text-[10px] uppercase tracking-[2px] text-[#666]">SATISFACTION</span>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-12 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-[3px] text-white flex items-center">
            <span className="text-[#C8102E] mr-2">//</span> UPCOMING EVENTS
          </h2>
          <Link to="/events" className="text-[11px] uppercase tracking-[2px] text-[#D4AF37] hover:underline">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-3 py-20 text-center border border-dashed border-[#222]">
              <p className="text-[#555] text-sm uppercase tracking-[3px]">No upcoming events found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
