import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [eventsRes, provincesRes] = await Promise.all([
          api.get('/api/events/all'),
          api.get('/api/locations/provinces')
        ]);
        setEvents(eventsRes.data || []);
        setFilteredEvents(eventsRes.data || []);
        setProvinces(provincesRes.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;
    
    // Search filter
    if (search) {
      result = result.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Category/Status filters
    if (activeFilter === 'Football') {
      result = result.filter(e => e.name.toLowerCase().includes('vs') || e.name.toLowerCase().includes('united'));
    } else if (activeFilter === 'Upcoming') {
      result = result.filter(e => new Date(e.date) > new Date());
    }

    setFilteredEvents(result);
  }, [search, activeFilter, events]);

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
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Header Bar */}
      <div className="h-[60px] border-b border-[#1a1a1a] flex items-center justify-between px-12">
        <h2 className="font-['Bebas_Neue'] text-2xl tracking-[2px] text-white">
          <span className="text-[#C8102E] mr-2">//</span> ALL EVENTS
        </h2>
        
        <div className="flex items-center gap-4">
          {['All', 'Football', 'Concerts', 'Upcoming', 'Available'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[10px] uppercase tracking-[1px] px-4 py-1.5 border transition-all ${
                activeFilter === filter 
                  ? 'border-[#C8102E] text-[#C8102E]' 
                  : 'border-[#333] text-[#888] hover:border-[#555]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-112px)]">
        {/* Left Sidebar */}
        <aside className="w-[220px] bg-[#0d0d0d] border-right border-[#1a1a1a] p-6 space-y-8 shrink-0">
          <div className="space-y-4">
            <h3 className="text-[8px] uppercase tracking-[3px] text-[#444] font-bold">Categories</h3>
            <div className="space-y-3">
              {[
                { label: 'Premier League', color: '#C8102E', count: 12 },
                { label: 'National Team', color: '#009A44', count: 4 },
                { label: 'Music/Arts', color: '#D4AF37', count: 8 },
                { label: 'Other Sports', color: '#003DA5', count: 6 }
              ].map(cat => (
                <div key={cat.label} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-[11px] text-[#888] group-hover:text-[#eee] transition-colors">{cat.label}</span>
                  </div>
                  <span className="text-[9px] text-[#444]">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[8px] uppercase tracking-[3px] text-[#444] font-bold">Provinces</h3>
            <div className="space-y-2">
              {provinces.map(p => (
                <div key={p.id} className="text-[11px] text-[#666] hover:text-[#D4AF37] cursor-pointer transition-colors">
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
             <h3 className="text-[8px] uppercase tracking-[3px] text-[#444] font-bold">Price Range</h3>
             <div className="h-1 bg-[#1a1a1a] relative rounded-full">
               <div className="absolute left-1/4 right-1/4 h-full bg-[#D4AF37]"></div>
             </div>
             <div className="flex justify-between text-[9px] text-[#444] tracking-wider">
               <span>$15</span>
               <span>$120</span>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Search Bar */}
          <div className="mb-8">
            <input 
              type="text"
              placeholder="SEARCH EVENTS BY NAME..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-[#1a1a1a] px-6 py-4 text-[#eee] text-xs tracking-[2px] outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map(event => {
              const eventDate = new Date(event.date);
              const color = getEventColor(event.name);
              
              return (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="grid grid-cols-[80px_1fr_auto] bg-[#111] border border-[#1a1a1a] hover:border-[#333] transition-all cursor-pointer relative overflow-hidden group"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center border-r border-[#1a1a1a] p-4">
                    <span className="font-['Bebas_Neue'] text-2xl text-white leading-none">
                      {eventDate.getDate()}
                    </span>
                    <span className="text-[9px] uppercase tracking-[1px] text-[#666] mt-1">
                      {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>

                  {/* Middle Info */}
                  <div className="p-4 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-[#eee] group-hover:text-[#D4AF37] transition-colors">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-[#666] tracking-[1px] uppercase">
                      <span>{event.time ? event.time.substring(0, 5) : '12:00'}</span>
                      <span>•</span>
                      <span>{event.stadium?.name || 'Amahoro Stadium'}</span>
                      <span>•</span>
                      <span className="text-[#444]">East Stand, VIP, General</span>
                    </div>
                  </div>

                  {/* Right Pricing */}
                  <div className="p-4 flex flex-col items-end justify-center pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] uppercase tracking-[1px] px-2 py-0.5 bg-[rgba(0,154,68,0.1)] text-[#009A44] border border-[rgba(0,154,68,0.2)]">
                        Available
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-['Bebas_Neue'] text-2xl text-[#D4AF37] tracking-[1px]">
                        $40
                      </span>
                      <span className="text-[8px] uppercase tracking-[1px] text-[#444]">Starting at</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="py-20 text-center border border-dashed border-[#1a1a1a]">
                <p className="text-[#444] text-[10px] uppercase tracking-[3px]">No events match your search or filter</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
