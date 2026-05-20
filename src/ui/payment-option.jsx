import React from 'react';

const PaymentOption = ({ className = "" }) => {
  return (
    <div className={`d-flex align-items-center gap-2 flex-wrap ${className}`} style={{ gap: '10px' }}>
      {/* VietQR Badge */}
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          border: '1.5px solid #0F0F0F',
          padding: '6px 12px',
          height: '36px',
          borderRadius: '0px',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          userSelect: 'none'
        }}
      >
        {/* Flat Minimalist QR Code SVG */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top-Left Position Detection Pattern */}
          <rect x="2" y="2" width="7" height="7" rx="0" stroke="#00529C" strokeWidth="2"/>
          <rect x="4" y="4" width="3" height="3" rx="0" fill="#00529C"/>
          
          {/* Bottom-Left Position Detection Pattern */}
          <rect x="2" y="15" width="7" height="7" rx="0" stroke="#00529C" strokeWidth="2"/>
          <rect x="4" y="17" width="3" height="3" rx="0" fill="#00529C"/>
          
          {/* Top-Right Position Detection Pattern */}
          <rect x="15" y="2" width="7" height="7" rx="0" stroke="#ED1C24" strokeWidth="2"/>
          <rect x="17" y="4" width="3" height="3" rx="0" fill="#ED1C24"/>
          
          {/* Flat stylized QR bits */}
          <rect x="15" y="15" width="3" height="3" fill="#0F0F0F"/>
          <rect x="19" y="15" width="3" height="3" fill="#0F0F0F"/>
          <rect x="15" y="19" width="3" height="3" fill="#0F0F0F"/>
          <rect x="19" y="19" width="3" height="3" fill="#0F0F0F"/>
        </svg>
        <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#00529C' }}>Viet</span>
          <span style={{ color: '#ED1C24' }}>QR</span>
        </span>
      </div>

      {/* Ship COD Badge */}
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          border: '1.5px solid #0F0F0F',
          padding: '6px 12px',
          height: '36px',
          borderRadius: '0px',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          userSelect: 'none'
        }}
      >
        {/* Premium Delivery Truck SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" xmlns="http://www.w3.org/2000/svg">
          {/* Truck cab & body */}
          <path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8v16z" fill="#0F0F0F"/>
          <path d="M14 6h4l4 4v6h-8V6z" stroke="#0F0F0F" fill="none"/>
          {/* Wheels */}
          <circle cx="7.5" cy="18.5" r="2.5" fill="#FFFFFF" stroke="#0F0F0F" strokeWidth="2"/>
          <circle cx="16.5" cy="18.5" r="2.5" fill="#FFFFFF" stroke="#0F0F0F" strokeWidth="2"/>
        </svg>
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F0F0F', letterSpacing: '0.5px' }}>
          SHIP COD
        </span>
      </div>
    </div>
  );
};

export default PaymentOption;
