import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import { LayoutDashboard, TrendingDown } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{
          width: isSidebarOpen ? '260px' : '0px',
          opacity: isSidebarOpen ? 1 : 0,
          background: 'var(--bg-panel-solid)',
          borderRight: isSidebarOpen ? '1px solid var(--border-light)' : 'none',
          padding: isSidebarOpen ? '24px 16px' : '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' }}>
            Navigation
          </div>
          <Link to="/" style={{
             display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
             borderRadius: '8px', textDecoration: 'none',
             color: location.pathname === '/' ? 'white' : 'var(--text-secondary)',
             background: location.pathname === '/' ? 'rgba(255,255,255,0.08)' : 'transparent',
             transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={e => { if(location.pathname !== '/') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { if(location.pathname !== '/') e.currentTarget.style.background = 'transparent'; }}
          >
            <LayoutDashboard size={20} style={{ color: location.pathname === '/' ? 'var(--accent-orange)' : 'inherit' }} />
            Portfolios
          </Link>

          <Link to="/cost-optimization" style={{
             display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
             borderRadius: '8px', textDecoration: 'none',
             color: location.pathname === '/cost-optimization' ? 'white' : 'var(--text-secondary)',
             background: location.pathname === '/cost-optimization' ? 'rgba(255,255,255,0.08)' : 'transparent',
             transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={e => { if(location.pathname !== '/cost-optimization') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { if(location.pathname !== '/cost-optimization') e.currentTarget.style.background = 'transparent'; }}
          >
            <TrendingDown size={20} style={{ color: location.pathname === '/cost-optimization' ? 'var(--accent-orange)' : 'inherit' }} />
            Cost Optimization
          </Link>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
