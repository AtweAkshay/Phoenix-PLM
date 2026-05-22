import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, ShieldAlert, BadgeDollarSign, Tags, Search, ExternalLink } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('bom');
  const [expandedRow, setExpandedRow] = useState(null);
  const { bomData, reviewBOM, isReviewing } = useProducts();
  
  const product = bomData[id] || bomData['1'];

  const tabs = [
    { id: 'bom', label: 'Bill of Materials', icon: Cpu },
    { id: 'suppliers', label: 'Suppliers', icon: ShieldAlert },
    { id: 'cost', label: 'Cost Analysis', icon: BadgeDollarSign },
    { id: 'variants', label: 'Product Variants', icon: Tags }
  ];

  return (
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
      <Link to="/" style={{ 
          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={16} /> Back to Portfolios
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {product.name}
            <span style={{ 
              fontSize: '0.9rem', padding: '4px 12px', borderRadius: '20px', 
              background: 'rgba(255,107,53,0.1)', color: 'var(--accent-orange)',
              border: '1px solid rgba(255,107,53,0.2)'
            }}>
              {product.category}
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Program execution and lifecycle management view.</p>
        </div>
      </div>

      {/* Tabs UI */}
      <div style={{ 
        display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-light)', 
        marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-orange)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) e.target.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) e.target.style.color = 'var(--text-secondary)'
            }}
          >
            <tab.icon size={18} style={{ color: activeTab === tab.id ? 'var(--accent-orange)' : 'inherit' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel" style={{ padding: '32px', minHeight: '400px' }}>
        {activeTab === 'bom' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                 <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Top Level Assemblies</h3>
                 <p style={{ color: 'var(--text-secondary)' }}>Detailed list of required hardware components.</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => reviewBOM(id)}
                disabled={isReviewing[id]}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  opacity: isReviewing[id] ? 0.7 : 1,
                  background: 'var(--bg-panel-solid)', border: '1px solid var(--accent-orange)'
                }}
              >
                <Search size={18} style={{ animation: isReviewing[id] ? 'pulse 1.5s ease-in-out infinite' : 'none', color: 'var(--accent-orange)' }} />
                {isReviewing[id] ? 'Analyzing parts...' : 'BOM Review with Nexar API'}
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Part Number (MPN)</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Description</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Manufacturer</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Qty</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {product.bom.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <tr 
                      onClick={() => item.recommendations?.length > 0 && setExpandedRow(expandedRow === idx ? null : idx)}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: item.recommendations?.length > 0 ? 'pointer' : 'default',
                        background: expandedRow === idx ? 'rgba(255,255,255,0.02)' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <td style={{ padding: '16px 8px', fontWeight: 600, color: 'var(--accent-orange)' }}>
                        {item.mpn || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 8px', fontWeight: 500 }}>
                         {item.part}
                         {item.recommendations?.length > 0 && (
                            <span style={{ 
                              marginLeft: '8px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px',
                              background: 'rgba(76, 201, 240, 0.15)', color: '#4cc9f0'
                            }}>
                              {item.recommendations.length} alternatives found
                            </span>
                         )}
                      </td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                         {item.manufacturer}
                      </td>
                      <td style={{ padding: '16px 8px' }}>{item.qty}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                          background: item.status === 'Approved' ? 'rgba(76, 201, 240, 0.1)' : 'rgba(255, 159, 28, 0.1)',
                          color: item.status === 'Approved' ? '#4cc9f0' : '#ff9f1c'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Expanded Recommendations Row */}
                    {expandedRow === idx && item.recommendations?.length > 0 && (
                      <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td colSpan="5" style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#4cc9f0' }}>
                            <Search size={16} />
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Nexar Recommended Substitutes</h4>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                            {item.recommendations.map((rec, rIdx) => (
                              <div key={rIdx} style={{ 
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(76, 201, 240, 0.2)',
                                padding: '16px', borderRadius: '8px', position: 'relative'
                              }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{rec.mpn}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{rec.manufacturer}</div>
                                <div style={{ fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.4 }}>{rec.description}</div>
                                <div style={{ 
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)'
                                }}>
                                  <span style={{ fontWeight: 600, color: '#4cc9f0', fontFamily: 'monospace' }}>
                                    ${rec.price.toFixed(4)} <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>ea</span>
                                  </span>
                                  <button style={{ 
                                    background: 'transparent', border: 'none', color: 'var(--text-secondary)', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem'
                                  }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                    View Details <ExternalLink size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {product.suppliers.map((sup, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{sup.name}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Quality Rating</span>
                    <span style={{ color: 'var(--text-primary)' }}>{sup.rating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Supply Risk</span>
                    <span style={{ color: sup.risk === 'Low' ? '#4cc9f0' : '#ff9f1c' }}>{sup.risk}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Location</span>
                    <span>{sup.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cost' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Itemized Cost Breakdown</h3>
              <div style={{ background: 'var(--bg-card)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--accent-orange)' }}>
                <span style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>Total Calculated BOM:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                  ${product.bom.reduce((acc, item) => acc + (item.unitCost * item.qty), 0).toFixed(2)}
                </span>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Part Number (MPN)</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Description</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, textAlign: 'right' }}>Unit Cost</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500, textAlign: 'right' }}>Extended Cost</th>
                </tr>
              </thead>
              <tbody>
                {product.bom.map((item, idx) => {
                  const extended = item.unitCost * item.qty;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600, color: 'var(--accent-orange)' }}>{item.mpn || 'N/A'}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 500 }}>{item.part}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 600, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        ${extended.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'variants' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Store Keeping Units (SKUs)</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Logistics configuration across regions, colors, and channels.</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>SKU</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Region</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Color</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Memory / Config</th>
                  <th style={{ padding: '16px 8px', fontWeight: 500 }}>Channel</th>
                </tr>
              </thead>
              <tbody>
                {product.variants?.map((variant, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--accent-orange)' }}>{variant.sku}</td>
                    <td style={{ padding: '16px 8px' }}>
                       <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-light)'
                      }}>
                        {variant.region}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>{variant.color}</td>
                    <td style={{ padding: '16px 8px' }}>{variant.memory}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{variant.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
