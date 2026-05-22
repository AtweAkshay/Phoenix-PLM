import React from 'react';
import { Flame, Box, Zap, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header style={{
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-light)',
      background: 'var(--bg-panel)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-primary)',
            cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu size={24} />
        </button>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'var(--phoenix-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          overflow: 'hidden'
        }}>
          <img src="/logo.png" alt="Phoenix PLM Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Phoenix PLM</h1>
        </div>
      </Link>
      </div>
      
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ 
          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Box size={16} /> Dashboard
        </Link>
        <Link to="#" style={{ 
          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Settings size={16} /> Reports
        </Link>
      </nav>
    </header>
  );
}
