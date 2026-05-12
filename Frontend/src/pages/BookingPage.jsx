import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const tiers = [
    { id: 'vip', name: 'VIP NORTH', price: 120, color: '#D4AF37', available: 45 },
    { id: 'west', name: 'WEST STAND', price: 80, color: '#C8102E', available: 120 },
    { id: 'south', name: 'SOUTH GENERAL', price: 40, color: '#009A44', available: 300 },
    { id: 'east', name: 'EAST STAND', price: 60, color: '#003DA5', available: 0 }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleBooking = async () => {
    if (!selectedTier) {
      alert('Please select a section first');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Booking
      const bookingRes = await api.post('/api/bookings/save', {
        user: { id: user.id },
        event: { id: eventId }
      });
      
      const bookingId = bookingRes.data.id;

      // 2. Create Tickets (simulating multiple tickets for the count)
      const ticketPromises = Array.from({ length: ticketCount }).map(() => 
        api.post('/api/tickets/save', {
          booking: { id: bookingId },
          event: { id: eventId },
          section: selectedTier.name,
          price: selectedTier.price,
          status: 'VALID'
        })
      );

      await Promise.all(ticketPromises);
      navigate('/my-tickets');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] bg-[#0a0a0a]">
        <div className="border-4 border-t-[#C8102E] rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  const bookingFee = 5;
  const subtotal = selectedTier ? selectedTier.price * ticketCount : 0;
  const total = subtotal > 0 ? subtotal + bookingFee : 0;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Event Banner */}
      <div className="h-[120px] bg-[#003DA5] border-b-2 border-[#D4AF37] flex items-center justify-between px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10">
          <h1 className="font-['Bebas_Neue'] text-[#D4AF37] text-4xl tracking-[2px]">{event?.name}</h1>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[2px] text-white/70 mt-1">
            <span>{event?.stadium?.name || 'AMAHORO STADIUM'}</span>
            <span>•</span>
            <span>{event?.date} {event?.time ? event.time.substring(0, 5) : ''}</span>
          </div>
        </div>
        <div className="relative z-10 text-[9px] uppercase tracking-[2px] text-white/50">
          <Link to="/events" className="hover:text-white transition-colors">Events</Link>
          <span className="mx-2">→</span>
          <span className="text-[#D4AF37]">Book Tickets</span>
        </div>
      </div>

      <div className="flex max-w-[1400px] mx-auto p-8 gap-8">
        {/* Left - Seat Map Area */}
        <div className="flex-1">
          <h2 className="font-['Bebas_Neue'] text-2xl tracking-[2px] text-white mb-8">SELECT YOUR SECTION</h2>
          
          {/* Stadium SVG Diagram */}
          <div className="bg-[#111] border border-[#1a1a1a] p-12 flex items-center justify-center mb-8 relative">
            <svg viewBox="0 0 500 350" className="w-full max-w-[600px] drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Outer Ring */}
              <ellipse cx="250" cy="175" rx="240" ry="165" fill="none" stroke="#222" strokeWidth="2" />
              
              {/* Pitch */}
              <rect x="150" y="105" width="200" height="140" fill="#009A44" fillOpacity="0.1" stroke="#009A44" strokeWidth="1" />
              <circle cx="250" cy="175" r="30" fill="none" stroke="#009A44" strokeWidth="1" strokeOpacity="0.5" />

              {/* VIP North */}
              <path 
                d="M100,50 Q250,10 400,50 L380,80 Q250,50 120,80 Z" 
                fill={selectedTier?.id === 'vip' ? '#D4AF37' : '#1a1a1a'} 
                className="cursor-pointer transition-colors hover:fill-[#D4AF37]/50"
                onClick={() => setSelectedTier(tiers[0])}
              />
              {/* West Stand */}
              <path 
                d="M50,100 Q10,175 50,250 L80,230 Q50,175 80,120 Z" 
                fill={selectedTier?.id === 'west' ? '#C8102E' : '#1a1a1a'} 
                className="cursor-pointer transition-colors hover:fill-[#C8102E]/50"
                onClick={() => setSelectedTier(tiers[1])}
              />
              {/* South General */}
              <path 
                d="M100,300 Q250,340 400,300 L380,270 Q250,300 120,270 Z" 
                fill={selectedTier?.id === 'south' ? '#009A44' : '#1a1a1a'} 
                className="cursor-pointer transition-colors hover:fill-[#009A44]/50"
                onClick={() => setSelectedTier(tiers[2])}
              />
              {/* East Stand */}
              <path 
                d="M450,100 Q490,175 450,250 L420,230 Q450,175 420,120 Z" 
                fill={selectedTier?.id === 'east' ? '#003DA5' : '#1a1a1a'} 
                className="opacity-40" // Sold out
              />

              <text x="250" y="40" textAnchor="middle" fill="#555" className="text-[10px] uppercase font-bold tracking-widest pointer-events-none">North Stand</text>
              <text x="250" y="325" textAnchor="middle" fill="#555" className="text-[10px] uppercase font-bold tracking-widest pointer-events-none">South Stand</text>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#D4AF37]"></div><span className="text-[9px] text-[#666]">VIP $120</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#C8102E]"></div><span className="text-[9px] text-[#666]">STANDARD $80</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#009A44]"></div><span className="text-[9px] text-[#666]">GENERAL $40</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1a1a1a]"></div><span className="text-[9px] text-[#666]">SOLD OUT</span></div>
            </div>
          </div>

          {/* Tier Selection Grid */}
          <div className="grid grid-cols-3 gap-4">
            {tiers.slice(0, 3).map(tier => (
              <div 
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={`p-4 bg-[#111] border transition-all cursor-pointer relative ${
                  selectedTier?.id === tier.id ? 'border-[#D4AF37] bg-[#141200]' : 'border-[#1a1a1a] hover:border-[#333]'
                }`}
                style={{ borderLeft: `3px solid ${tier.color}` }}
              >
                {selectedTier?.id === tier.id && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                )}
                <div className="font-['Bebas_Neue'] text-lg text-white tracking-[1px]">{tier.name}</div>
                <div className="text-[9px] text-[#666] uppercase tracking-[1px] mt-1">{tier.available} SEATS AVAILABLE</div>
                <div className="text-[#D4AF37] font-['Bebas_Neue'] text-xl mt-2">${tier.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-[320px] shrink-0 space-y-6">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 space-y-8">
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-[2px] text-white">YOUR BOOKING</h2>
            
            <div className="flex items-center gap-2 bg-[rgba(0,154,68,0.1)] border border-[rgba(0,154,68,0.2)] px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-[#009A44]"></div>
              <span className="text-[10px] uppercase tracking-[1px] text-[#009A44]">Kigali City, Gasabo District</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[2px] text-[#444] font-bold">FULL NAME</label>
                <input 
                  type="text" 
                  readOnly 
                  value={user?.name}
                  className="w-full bg-[#111] border border-[#1a1a1a] px-4 py-3 text-[#eee] text-xs outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[2px] text-[#444] font-bold">SECTION</label>
                <select 
                  value={selectedTier?.id || ''}
                  onChange={(e) => setSelectedTier(tiers.find(t => t.id === e.target.value))}
                  className="w-full bg-[#111] border border-[#1a1a1a] px-4 py-3 text-[#eee] text-xs outline-none focus:border-[#D4AF37] appearance-none"
                >
                  <option value="" disabled>Select a section</option>
                  {tiers.map(t => (
                    <option key={t.id} value={t.id} disabled={t.available === 0}>
                      {t.name} - ${t.price} {t.available === 0 ? '(SOLD OUT)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[2px] text-[#444] font-bold">NUMBER OF TICKETS</label>
                <div className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] p-1">
                  <button 
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="font-['Bebas_Neue'] text-2xl text-[#D4AF37] tracking-[2px]">{ticketCount}</span>
                  <button 
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#1a1a1a] p-4 space-y-3">
              <div className="flex justify-between text-[10px] text-[#666] tracking-[1px] uppercase">
                <span>{selectedTier?.name || 'Section'} × {ticketCount}</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#666] tracking-[1px] uppercase">
                <span>Booking Fee</span>
                <span>${subtotal > 0 ? bookingFee : 0}</span>
              </div>
              <div className="pt-3 border-t border-[#1a1a1a] flex justify-between items-baseline">
                <span className="text-[10px] text-[#eee] tracking-[1px] uppercase">Total</span>
                <span className="font-['Bebas_Neue'] text-3xl text-[#D4AF37] tracking-[2px]">${total}</span>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={submitting || !selectedTier}
              className="w-full bg-[#C8102E] text-white py-4 font-['Bebas_Neue'] text-xl tracking-[3px] hover:bg-[#a00d25] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {submitting ? (
                <div className="border-2 border-t-transparent border-white rounded-full w-5 h-5 animate-spin"></div>
              ) : (
                'CONFIRM BOOKING'
              )}
            </button>
            
            <p className="text-[8px] uppercase tracking-[2px] text-[#444] text-center leading-relaxed">
              Tickets will be emailed to your account <br /> 
              once the payment is verified by our system.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
