import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `text-[11px] tracking-[2px] uppercase transition-colors ${
      isActive ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-[#aaa] hover:text-[#f0f0f0]'
    }`;

  return (
    <nav className="h-[52px] bg-[#111] border-b border-[#222] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex flex-col">
        <Link to="/" className="font-['Bebas_Neue'] text-[#D4AF37] text-xl tracking-[3px] leading-none">
          AMAHORO
        </Link>
        <span className="text-[9px] text-[#888] tracking-[4px] uppercase leading-tight">
          Stadium — Kigali, Rwanda
        </span>
      </div>

      {/* Center: Nav Links */}
      <div className="flex items-center gap-8">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/events" className={navLinkClass}>
          Events
        </NavLink>
        <NavLink to="/my-tickets" className={navLinkClass}>
          My Tickets
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        )}
      </div>

      {/* Right: Auth Info */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#666] uppercase tracking-wider">Logged in as</span>
              <span className="text-[11px] text-[#D4AF37] font-medium uppercase tracking-wider">{user?.name}</span>
              {isAdmin && (
                <span className="text-[9px] px-2 py-0.5 bg-[rgba(200,16,46,0.2)] text-[#C8102E] border border-[rgba(200,16,46,0.3)] tracking-[1px] font-bold">
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="text-[10px] text-[#888] uppercase tracking-[2px] hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-[#C8102E] text-white text-[11px] px-4 py-2 uppercase tracking-[2px] font-['Bebas_Neue'] hover:bg-[#a00d25] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
