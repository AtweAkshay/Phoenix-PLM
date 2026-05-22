import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, CheckCircle2, Loader2, Sparkles, AlertTriangle, Save, Paperclip, FileText } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const SIMULATED_STEPS = [
  { id: 1, text: "Analyzing reference architectures and BRD constraints...", delay: 1500 },
  { id: 2, text: "Determining critical sub-assemblies based on requirements...", delay: 2000 },
  { id: 3, text: "Sourcing lowest-cost reliable components (MPNs)...", delay: 2500 },
  { id: 4, text: "Formulating multi-sourcing fallback strategies...", delay: 2000 },
  { id: 5, text: "Compiling draft Bill of Materials...", delay: 1000 }
];

export default function CreateProgram() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  
  const [chatStep, setChatStep] = useState(0); 
  const [programName, setProgramName] = useState('Draft Program');
  
  const [messages, setMessages] = useState([
    { role: 'agent', content: "Hello! I am your Phoenix PLM Assistant. Let's create your new hardware product. First, do you have a reference program or architecture you are basing this on?" }
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentSteps, setAgentSteps] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentSteps]);

  const processInput = async (content, isFile = false) => {
    setMessages(prev => [...prev, { role: 'user', content, isFile }]);
    
    if (chatStep === 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'agent', content: "Got it. Next, do you have a Business Requirements Document (BRD) or can you briefly describe the core requirements/features?" }]);
        setChatStep(1);
      }, 600);
    } else if (chatStep === 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'agent', content: "Understood. Finally, what is the name for this new program?" }]);
        setChatStep(2);
      }, 600);
    } else if (chatStep === 2) {
      // If a file is uploaded at the naming step, use its name without extension, otherwise use the text
      const finalName = isFile ? content.replace('Attached: ', '').split('.')[0] : content;
      setProgramName(finalName || 'New Program');
      setIsProcessing(true);
      
      // Simulate thinking process
      setAgentSteps([]);
      for (const step of SIMULATED_STEPS) {
        await new Promise(r => setTimeout(r, 500));
        setAgentSteps(prev => [...prev, { ...step, status: 'loading' }]);
        await new Promise(r => setTimeout(r, step.delay));
        setAgentSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: 'done' } : s));
      }

      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: `Draft BOM for "${finalName}" generated successfully! Would you like to Save this program to your portfolio?`,
        needsSave: true
      }]);
      setIsProcessing(false);
      setChatStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const userMessage = input.trim();
    setInput('');
    await processInput(userMessage);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isProcessing) return;
    
    // Clear input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    await processInput(`Attached: ${file.name}`, true);
  };

  const handleSave = () => {
    const newId = Date.now().toString();
    
    // Create new product record
    const newProduct = {
      id: newId,
      name: programName,
      category: 'New Hardware',
      iconName: 'Cpu',
      color: '#4cc9f0'
    };

    // Create detailed dummy BOM based on generation
    const newBomDetails = {
      name: programName,
      category: 'New Hardware',
      bom: [
        { part: 'Next-Gen Custom Silicon SoC', mpn: 'MPN-CUS-NX-001', qty: 1, manufacturer: 'TSMC', status: 'Design', unitCost: 110.00 },
        { part: 'High-Density Battery Pack', mpn: 'MPN-BAT-HD-800', qty: 2, manufacturer: 'LG Chem', status: 'Sourcing', unitCost: 18.50 },
        { part: 'SMD MLCC 10uF 0402', mpn: 'MPN-CAP-MLCC-10U', qty: 245, manufacturer: 'Taiyo Yuden', status: 'Approved', unitCost: 0.04 },
        { part: 'SMD Thin Film Resistor', mpn: 'MPN-RES-TF-01', qty: 110, manufacturer: 'Panasonic', status: 'Approved', unitCost: 0.02 },
        { part: 'Titanium Enclosure Frame', mpn: 'MPN-ENC-TI-01', qty: 1, manufacturer: 'Foxconn', status: 'Prototyping', unitCost: 45.00 }
      ],
      suppliers: [
        { name: 'TSMC', rating: '99%', risk: 'Low', location: 'Taiwan' },
        { name: 'LG Chem', rating: '95%', risk: 'Medium', location: 'South Korea' }
      ],
      cost: { targetBOM: '$220.00', currentEstimates: '$235.50', variance: '+$15.50 (+7.0%)' },
      variants: [
        { sku: 'PNX-AR-US-GLO-128', region: 'US', color: 'Gloss Black', memory: '128GB', channel: 'Online/Retail' },
        { sku: 'PNX-AR-US-MAT-256', region: 'US', color: 'Matte Grey', memory: '256GB', channel: 'Online' },
        { sku: 'PNX-AR-UK-GLO-128', region: 'UK', color: 'Gloss Black', memory: '128GB', channel: 'Online' },
        { sku: 'PNX-AR-JP-WHI-256', region: 'JP', color: 'Aero White', memory: '256GB', channel: 'Retail' }
      ]
    };

    addProduct(newProduct, newBomDetails);
    navigate(`/product/${newId}`);
  };

  return (
    <div className="container" style={{ maxWidth: '900px', animation: 'fadeIn 0.5s ease-out forwards', padding: '0 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles style={{ color: 'var(--accent-orange)' }} /> New Program
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Guided workflow to collect requirements and generate a draft BOM.</p>
      </div>

      <div className="glass-panel" style={{ 
        display: 'flex', flexDirection: 'column', height: '600px', 
        overflow: 'hidden', border: '1px solid rgba(255,107,53,0.3)',
        boxShadow: 'var(--shadow-glow)'
      }}>
        
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', gap: '16px', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'agent' ? 'var(--phoenix-gradient)' : 'var(--bg-card)',
                color: msg.role === 'agent' ? '#fff' : 'var(--text-primary)',
                border: msg.role === 'user' ? '1px solid var(--border-light)' : 'none'
              }}>
                {msg.role === 'agent' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div style={{ 
                maxWidth: '75%', padding: '16px', borderRadius: '16px',
                background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'var(--bg-panel-solid)',
                border: msg.role === 'user' ? '1px solid var(--border-light)' : '1px solid transparent',
                borderTopLeftRadius: msg.role === 'agent' ? '4px' : '16px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                lineHeight: '1.6'
              }}>
                {msg.isFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4cc9f0' }}>
                    <FileText size={18} />
                    <span style={{ fontWeight: 500 }}>{msg.content}</span>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
                {msg.needsSave && (
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-orange)' }}
                    onClick={handleSave}
                  >
                     <Save size={18} /> Save & Open Program
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Processing Steps */}
          {agentSteps.length > 0 && !messages[messages.length - 1].needsSave && (
            <div style={{ display: 'flex', gap: '16px' }}>
               <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--phoenix-gradient)', color: '#fff'
                }}>
                  <Bot size={20} />
                </div>
                <div style={{ 
                  flex: 1, padding: '20px', borderRadius: '16px', background: 'var(--bg-panel-solid)',
                  borderTopLeftRadius: '4px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {agentSteps.map((step) => (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {step.status === 'loading' ? (
                          <Loader2 size={18} style={{ color: 'var(--accent-orange)', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <CheckCircle2 size={18} style={{ color: '#4cc9f0' }} />
                        )}
                        <span style={{ 
                          color: step.status === 'done' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          transition: 'color var(--transition-fast)'
                        }}>{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {chatStep < 3 && (
          <div style={{ 
            padding: '24px', borderTop: '1px solid var(--border-light)', 
            background: 'rgba(0,0,0,0.2)' 
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                title="Attach BRD or Requirements Document"
                style={{
                  padding: '0 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-light)', color: 'var(--text-secondary)',
                  cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => !isProcessing && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => !isProcessing && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,.csv"
              />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                placeholder="Type your response..."
                style={{
                  flex: 1, padding: '16px', borderRadius: '12px',
                  background: 'var(--bg-panel-solid)', border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)', fontSize: '1rem', outline: 'none',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
              />
              <button 
                type="submit" 
                disabled={isProcessing || !input.trim()}
                style={{
                  padding: '0 24px', borderRadius: '12px', background: 'var(--phoenix-gradient)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isProcessing || !input.trim() ? 0.5 : 1,
                  cursor: isProcessing || !input.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
