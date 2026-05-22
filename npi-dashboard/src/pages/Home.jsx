import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Cpu, Smartphone, MonitorPlay, Watch, Video, Camera, Trash2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const ICONS = {
  Smartphone,
  MonitorPlay,
  Watch,
  Cpu,
  Camera,
  Video
};

export default function Home() {
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();

  return (
    <div className="container" style={{
      animation: 'fadeIn 0.5s ease-out forwards'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Product Portfolios</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Agentic Product Lifecycle Management tool.</p>
        </div>
        
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => navigate('/create')}
        >
          <PlusCircle size={20} />
          Create New Product
        </button>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-muted)' }}>Past Products</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {products.map((product) => {
          const IconComponent = ICONS[product.iconName] || Cpu;
          
          return (
            <div 
              key={product.id}
              className="glass-panel"
              style={{ 
                padding: '24px', 
                cursor: 'pointer',
                transition: 'all var(--transition-smooth)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(`/product/${product.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent-orange)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'var(--shadow-elem)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  background: `linear-gradient(135deg, ${product.color}22, ${product.color}11)`,
                  border: `1px solid ${product.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px', color: product.color
                }}>
                  <IconComponent size={24} />
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                      deleteProduct(product.id);
                    }
                  }}
                  style={{
                    color: 'var(--text-muted)',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent-red)';
                    e.currentTarget.style.background = 'rgba(231,29,54,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h4 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{product.name}</h4>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.category}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
