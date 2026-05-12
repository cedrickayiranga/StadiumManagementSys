import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [activePanel, setActivePanel] = useState('Overview');
  const [stats, setStats] = useState({ events: 0, bookings: 0, tickets: 0, users: 0 });
  const [data, setData] = useState({ events: [], bookings: [], tickets: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states
  const [eventForm, setEventName] = useState({ name: '', date: '', description: '', stadiumId: '' });
  const [stadiumForm, setStadiumForm] = useState({ name: '', capacity: '', location: '' });
  const [locationForm, setLocationForm] = useState({ name: '', code: '', type: 'PROVINCE', parentCode: '' });
  const [stadiums, setStadiums] = useState([]);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [eventsRes, bookingsRes, ticketsRes, usersRes, stadiumRes, provinceRes] = await Promise.all([
          api.get('/api/events/all'),
          api.get('/api/bookings/all'),
          api.get('/api/tickets/all'),
          api.get('/api/users/all'),
          api.get('/api/stadiums/all'),
          api.get('/api/locations/provinces')
        ]);

        setData({
          events: eventsRes.data || [],
          bookings: bookingsRes.data || [],
          tickets: ticketsRes.data || [],
          users: usersRes.data || []
        });

        setStadiums(stadiumRes.data || []);
        setProvinces(provinceRes.data || []);

        setStats({
          events: eventsRes.data?.length || 0,
          bookings: bookingsRes.data?.length || 0,
          tickets: ticketsRes.data?.length || 0,
          users: usersRes.data?.length || 0
        });
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [refreshTrigger]);

  const handleAddLocation = async () => {
    if (!locationForm.name || !locationForm.code) {
      alert('Please fill name and code');
      return;
    }
    try {
      if (locationForm.type === 'PROVINCE') {
        await api.post('/api/locations/parent', {
          name: locationForm.name,
          code: locationForm.code,
          type: 'PROVINCE'
        });
      } else {
        await api.post(`/api/locations/child?parentCode=${locationForm.parentCode}`, {
          name: locationForm.name,
          code: locationForm.code,
          type: 'DISTRICT'
        });
      }
      alert('Location added successfully');
      setLocationForm({ name: '', code: '', type: 'PROVINCE', parentCode: '' });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Add location failed:', err);
      alert('Failed to add location');
    }
  };

  const handlePromote = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to ADMIN?')) return;
    try {
      await api.put(`/api/users/promote/${userId}`);
      alert('User promoted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Promotion failed:', err);
      alert('Failed to promote user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/users/delete/${userId}`);
      alert('User deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete user');
    }
  };

  const handleAddEvent = async () => {
    if (!eventForm.name || !eventForm.date || !eventForm.stadiumId) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const payload = {
        name: eventForm.name,
        date: eventForm.date.split('T')[0],
        time: eventForm.date.split('T')[1],
        description: eventForm.description,
        stadium: { id: eventForm.stadiumId }
      };
      await api.post('/api/events/save', payload);
      alert('Event added successfully');
      setEventName({ name: '', date: '', description: '', stadiumId: '' });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Add event failed:', err);
      alert('Failed to add event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/api/events/delete/${eventId}`);
      alert('Event deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Delete event failed:', err);
      alert('Failed to delete event');
    }
  };

  const handleAddStadium = async () => {
    if (!stadiumForm.name || !stadiumForm.capacity) {
      alert('Please fill all required fields');
      return;
    }
    try {
      await api.post('/api/stadiums/save', stadiumForm);
      alert('Stadium added successfully');
      setStadiumForm({ name: '', capacity: '', location: '' });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Add stadium failed:', err);
      alert('Failed to add stadium');
    }
  };

  const handleDeleteStadium = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stadium?')) return;
    try {
      await api.delete(`/api/stadiums/delete/${id}`);
      alert('Stadium deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Delete stadium failed:', err);
      alert('Failed to delete stadium');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel/delete this booking?')) return;
    try {
      await api.delete(`/api/bookings/delete/${id}`);
      alert('Booking deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Delete booking failed:', err);
      alert('Failed to delete booking');
    }
  };

  const sidebarItems = [
    { section: 'Dashboard', items: ['Overview'] },
    { section: 'Management', items: ['Events', 'Bookings', 'Tickets', 'Users'] },
    { section: 'System', items: ['Stadium Info', 'Locations'] }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] bg-[#0a0a0a]">
        <div className="border-4 border-t-[#C8102E] rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-[180px] bg-[#0d0d0d] border-r border-[#1a1a1a] py-8 shrink-0">
        <div className="px-6 mb-8">
          <div className="text-[10px] uppercase tracking-[2px] text-[#444] font-bold mb-2">Admin Panel</div>
          <div className="bg-[rgba(200,16,46,0.1)] border border-[rgba(200,16,46,0.2)] text-[#C8102E] text-[9px] px-2 py-0.5 inline-block font-bold">
            {user?.role}
          </div>
        </div>

        <nav className="space-y-6">
          {sidebarItems.map(section => (
            <div key={section.section}>
              <div className="px-6 text-[8px] uppercase tracking-[3px] text-[#333] mb-3">{section.section}</div>
              <div className="space-y-1">
                {section.items.map(item => (
                  <button
                    key={item}
                    onClick={() => setActivePanel(item)}
                    className={`w-full text-left px-6 py-2 text-[11px] uppercase tracking-[1px] transition-all border-l-2 ${
                      activePanel === item 
                        ? 'text-[#D4AF37] border-[#D4AF37] bg-[rgba(212,175,55,0.05)]' 
                        : 'text-[#666] border-transparent hover:text-[#aaa]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-['Bebas_Neue'] text-3xl tracking-[3px] text-white uppercase">
            {activePanel}
          </h1>
          <div className="text-[10px] text-[#444] tracking-[2px] uppercase">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {activePanel === 'Overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Active Events', val: stats.events, color: '#C8102E' },
                { label: 'Tickets Sold', val: stats.tickets, color: '#D4AF37' },
                { label: 'Total Bookings', val: stats.bookings, color: '#009A44' },
                { label: 'Total Users', val: stats.users, color: '#003DA5' }
              ].map(kpi => (
                <div key={kpi.label} className="bg-[#111] border border-[#1a1a1a] p-6" style={{ borderBottom: `2px solid ${kpi.color}` }}>
                  <div className="text-[8px] uppercase tracking-[2px] text-[#666] mb-2">{kpi.label}</div>
                  <div className="font-['Bebas_Neue'] text-4xl text-white tracking-[1px]">{kpi.val}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Recent Bookings Panel */}
              <div className="bg-[#111] border border-[#1a1a1a]">
                <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[2px] text-[#eee] font-bold">Recent Bookings</span>
                  <button className="text-[8px] uppercase tracking-[1px] text-[#D4AF37]">View All</button>
                </div>
                <div className="p-2">
                  {data.bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="p-3 flex items-center justify-between hover:bg-[#161616] transition-colors border-b border-[#1a1a1a] last:border-0">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#eee] font-medium">{b.user?.name || 'Unknown User'}</span>
                        <span className="text-[9px] text-[#555] uppercase tracking-[1px]">{b.event?.name || 'Unknown Event'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-['Bebas_Neue'] text-lg text-[#D4AF37]">$45</span>
                        <span className="text-[8px] px-2 py-0.5 bg-[rgba(0,154,68,0.1)] text-[#009A44] border border-[rgba(0,154,68,0.2)] font-bold uppercase tracking-[1px]">Confirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tickets by Event Chart (Simplified) */}
              <div className="bg-[#111] border border-[#1a1a1a]">
                <div className="p-4 border-b border-[#1a1a1a]">
                  <span className="text-[10px] uppercase tracking-[2px] text-[#eee] font-bold">Tickets by Event</span>
                </div>
                <div className="p-6 space-y-4">
                  {data.events.slice(0, 5).map((e, idx) => {
                    const colors = ['#C8102E', '#D4AF37', '#009A44', '#003DA5', '#444'];
                    return (
                      <div key={e.id} className="space-y-1">
                        <div className="flex justify-between text-[9px] text-[#666] uppercase tracking-[1px]">
                          <span>{e.name}</span>
                          <span>{100 - (idx * 15)}</span>
                        </div>
                        <div className="h-1.5 bg-[#1a1a1a] w-full">
                          <div 
                            className="h-full" 
                            style={{ backgroundColor: colors[idx % colors.length], width: `${100 - (idx * 15)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'Events' && (
          <div className="space-y-8">
            <div className="bg-[#111] border border-[#1a1a1a] p-6">
              <h3 className="text-[10px] uppercase tracking-[2px] text-[#eee] font-bold mb-6">Create New Event</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input 
                  placeholder="Event Name" 
                  value={eventForm.name}
                  onChange={(e) => setEventName({...eventForm, name: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <input 
                  type="datetime-local" 
                  value={eventForm.date}
                  onChange={(e) => setEventName({...eventForm, date: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <select
                  value={eventForm.stadiumId}
                  onChange={(e) => setEventName({...eventForm, stadiumId: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Select Stadium</option>
                  {stadiums.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button 
                  onClick={handleAddEvent}
                  className="bg-[#C8102E] text-white font-['Bebas_Neue'] text-lg tracking-[2px] hover:bg-[#a00d25] transition-colors"
                >
                  ADD EVENT
                </button>
              </div>
              <textarea
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) => setEventName({...eventForm, description: e.target.value})}
                className="w-full mt-4 bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37] h-20"
              />
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[9px] uppercase tracking-[2px] text-[#444]">
                  <th className="pb-4 font-bold">Date</th>
                  <th className="pb-4 font-bold">Event Name</th>
                  <th className="pb-4 font-bold">Stadium</th>
                  <th className="pb-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {data.events.map(e => (
                  <tr key={e.id} className="text-xs group hover:bg-[#111] transition-colors">
                    <td className="py-4 text-[#666]">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="py-4 text-[#eee] font-medium">{e.name}</td>
                    <td className="py-4 text-[#666]">{e.stadium?.name || 'N/A'}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDeleteEvent(e.id)}
                        className="text-[#C8102E] text-[10px] uppercase tracking-[1px] hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePanel === 'Users' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[9px] uppercase tracking-[2px] text-[#444]">
                <th className="pb-4 font-bold">Name</th>
                <th className="pb-4 font-bold">Email</th>
                <th className="pb-4 font-bold">Role</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {data.users.map(u => (
                <tr key={u.id} className="text-xs hover:bg-[#111] transition-colors">
                  <td className="py-4 text-[#eee] font-medium">{u.name}</td>
                  <td className="py-4 text-[#666]">{u.email}</td>
                  <td className="py-4">
                    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-[1px] border ${
                      u.role === 'ADMIN' ? 'bg-[rgba(200,16,46,0.1)] text-[#C8102E] border-[rgba(200,16,46,0.2)]' : 'bg-[rgba(0,61,165,0.1)] text-[#003DA5] border-[rgba(0,61,165,0.2)]'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-4">
                    {u.role !== 'ADMIN' && (
                      <button 
                        onClick={() => handlePromote(u.id)}
                        className="text-[#D4AF37] text-[10px] uppercase tracking-[1px] hover:underline"
                      >
                        Promote
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-[#C8102E] text-[10px] uppercase tracking-[1px] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activePanel === 'Stadium Info' && (
          <div className="space-y-8">
            <div className="bg-[#111] border border-[#1a1a1a] p-6">
              <h3 className="text-[10px] uppercase tracking-[2px] text-[#eee] font-bold mb-6">Add New Stadium</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input 
                  placeholder="Stadium Name" 
                  value={stadiumForm.name}
                  onChange={(e) => setStadiumForm({...stadiumForm, name: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <input 
                  placeholder="Capacity" 
                  type="number"
                  value={stadiumForm.capacity}
                  onChange={(e) => setStadiumForm({...stadiumForm, capacity: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <input 
                  placeholder="Location (City)" 
                  value={stadiumForm.location}
                  onChange={(e) => setStadiumForm({...stadiumForm, location: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <button 
                  onClick={handleAddStadium}
                  className="bg-[#C8102E] text-white font-['Bebas_Neue'] text-lg tracking-[2px] hover:bg-[#a00d25] transition-colors"
                >
                  ADD STADIUM
                </button>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[9px] uppercase tracking-[2px] text-[#444]">
                  <th className="pb-4 font-bold">Stadium Name</th>
                  <th className="pb-4 font-bold">Capacity</th>
                  <th className="pb-4 font-bold">Location</th>
                  <th className="pb-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {stadiums.map(s => (
                  <tr key={s.id} className="text-xs group hover:bg-[#111] transition-colors">
                    <td className="py-4 text-[#eee] font-medium">{s.name}</td>
                    <td className="py-4 text-[#666]">{s.capacity?.toLocaleString()}</td>
                    <td className="py-4 text-[#666]">{s.location || 'N/A'}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDeleteStadium(s.id)}
                        className="text-[#C8102E] text-[10px] uppercase tracking-[1px] hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activePanel === 'Bookings' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[9px] uppercase tracking-[2px] text-[#444]">
                <th className="pb-4 font-bold">Booking ID</th>
                <th className="pb-4 font-bold">User</th>
                <th className="pb-4 font-bold">Event</th>
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {data.bookings.map(b => (
                <tr key={b.id} className="text-xs hover:bg-[#111] transition-colors">
                  <td className="py-4 text-[#eee] font-mono">{b.id.substring(0, 8)}...</td>
                  <td className="py-4 text-[#eee]">{b.user?.name}</td>
                  <td className="py-4 text-[#666]">{b.event?.name}</td>
                  <td className="py-4 text-[#666]">{b.bookingDate}</td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleDeleteBooking(b.id)}
                      className="text-[#C8102E] text-[10px] uppercase tracking-[1px] hover:underline"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activePanel === 'Tickets' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[9px] uppercase tracking-[2px] text-[#444]">
                <th className="pb-4 font-bold">Ticket ID</th>
                <th className="pb-4 font-bold">Event</th>
                <th className="pb-4 font-bold">Section</th>
                <th className="pb-4 font-bold">Price</th>
                <th className="pb-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {data.tickets.map(t => (
                <tr key={t.id} className="text-xs hover:bg-[#111] transition-colors">
                  <td className="py-4 text-[#eee] font-mono">{t.id.substring(0, 8)}...</td>
                  <td className="py-4 text-[#eee]">{t.event?.name}</td>
                  <td className="py-4 text-[#D4AF37] font-bold">{t.section}</td>
                  <td className="py-4 text-[#eee]">${t.price}</td>
                  <td className="py-4">
                    <span className="text-[9px] px-2 py-0.5 bg-[rgba(0,154,68,0.1)] text-[#009A44] border border-[rgba(0,154,68,0.2)] tracking-[1px] font-bold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activePanel === 'Locations' && (
          <div className="space-y-8">
            <div className="bg-[#111] border border-[#1a1a1a] p-6">
              <h3 className="text-[10px] uppercase tracking-[2px] text-[#eee] font-bold mb-6">Manage Provinces & Districts</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <input 
                  placeholder="Location Name" 
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <input 
                  placeholder="Code (e.g., KIGALI)" 
                  value={locationForm.code}
                  onChange={(e) => setLocationForm({...locationForm, code: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]" 
                />
                <select
                  value={locationForm.type}
                  onChange={(e) => setLocationForm({...locationForm, type: e.target.value})}
                  className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]"
                >
                  <option value="PROVINCE">Province</option>
                  <option value="DISTRICT">District</option>
                </select>
                {locationForm.type === 'DISTRICT' && (
                  <select
                    value={locationForm.parentCode}
                    onChange={(e) => setLocationForm({...locationForm, parentCode: e.target.value})}
                    className="bg-[#0d0d0d] border border-[#222] p-3 text-xs text-[#eee] outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => <option key={p.id} value={p.code}>{p.name}</option>)}
                  </select>
                )}
                <button 
                  onClick={handleAddLocation}
                  className="bg-[#D4AF37] text-black font-['Bebas_Neue'] text-lg tracking-[2px] hover:bg-[#b8962d] transition-colors"
                >
                  SAVE LOCATION
                </button>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[9px] uppercase tracking-[2px] text-[#444]">
                  <th className="pb-4 font-bold">Province</th>
                  <th className="pb-4 font-bold">Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {provinces.map(p => (
                  <tr key={p.id} className="text-xs hover:bg-[#111] transition-colors">
                    <td className="py-4 text-[#eee] font-medium">{p.name}</td>
                    <td className="py-4 text-[#666] font-mono">{p.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
