import React from 'react';
import { useProducts } from '../context/ProductContext';
import { TrendingDown, AlertTriangle } from 'lucide-react';

const SUBASSEMBLIES_TO_COMPARE = [
  { key: 'soc', label: 'System on Chip (SoC)' },
  { key: 'display', label: 'Display Panel' },
  { key: 'battery', label: 'Battery Cell' },
  { key: 'camera', label: 'Camera Sensor' }
];

export default function GlobalCost() {
  const { products, bomData } = useProducts();

  // Helper to find a component in the BOM by keywords
  const findComponentPrice = (bom, type) => {
    // We don't have explicit prices in the mock data, so we'll dynamically generate "mock" costs based on the MPN string hash just for visual representation in the matrix
    let foundPart = null;
    bom.forEach(item => {
      const lowerPart = item.part.toLowerCase();
      if (type === 'soc' && lowerPart.includes('soc')) foundPart = item;
      if (type === 'display' && (lowerPart.includes('display') || lowerPart.includes('amoled'))) foundPart = item;
      if (type === 'battery' && lowerPart.includes('battery')) foundPart = item;
      if (type === 'camera' && lowerPart.includes('camera')) foundPart = item;
    });

    if (!foundPart) return null;

    // Generate a consistent dummy price based on part name length so it stays constant and looks somewhat realistic
    let basePrice = 10;
    if (type === 'soc') basePrice = 45 + foundPart.part.length;
    if (type === 'display') basePrice = 30 + foundPart.part.length * 2;
    if (type === 'battery') basePrice = 5 + foundPart.part.length / 2;
    if (type === 'camera') basePrice = 15 + foundPart.part.length;

    return `$${basePrice.toFixed(2)}`;
  };

  return (
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out forwards', padding: '0 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TrendingDown style={{ color: 'var(--accent-orange)' }} size={32} /> Global Cost Optimization
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Compare subassembly costs across the entire hardware portfolio to identify supply chain synergies.
        </p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--border-light)' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '20px', fontWeight: 600, width: '250px' }}>Subassembly</th>
              {products.map(p => (
                <th key={p.id} style={{ padding: '20px', fontWeight: 600, color: 'var(--accent-orange)' }}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SUBASSEMBLIES_TO_COMPARE.map((sub, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px', fontWeight: 500, background: 'rgba(0,0,0,0.1)' }}>{sub.label}</td>
                {products.map(p => {
                  const productBom = bomData[p.id]?.bom || [];
                  const price = findComponentPrice(productBom, sub.key);
                  return (
                    <td key={p.id} style={{ padding: '20px', color: price ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {price || 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(255, 159, 28, 0.1)', border: '1px solid rgba(255, 159, 28, 0.2)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <AlertTriangle style={{ color: 'var(--accent-yellow)', flexShrink: 0 }} />
        <div>
          <h4 style={{ color: 'var(--accent-yellow)', marginBottom: '8px' }}>Insight Engine</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <strong>Opportunity:</strong> Standardizing the <em>Display Panel</em> across Pixel 8 Pro and the next-generation premium device could yield a 12% volume discount from Samsung Display. 
          </p>
        </div>
      </div>
    </div>
  );
}
