import React, { useState } from 'react';

export default function Footer() {
  const [serviceCode, setServiceCode] = useState(false);

  const footerLinks = [
    ['Audio Description', 'Investor Relations', 'Legal Notices'],
    ['Help Centre', 'Jobs', 'Cookie Preferences'],
    ['Gift Cards', 'Terms of Use', 'Corporate Information'],
    ['Media Centre', 'Privacy', 'Contact Us']
  ];

  return (
    <footer style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '70px 4% 30px',
      color: '#808080',
      fontSize: '0.82rem',
      lineHeight: '1.6'
    }}>
      {/* Social SVGs */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '18px', color: '#fff' }}>
        {/* Facebook */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ cursor: 'pointer' }}>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
        {/* Instagram */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        {/* Twitter / X */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ cursor: 'pointer' }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        {/* Youtube */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ cursor: 'pointer' }}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>

      {/* Links Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '26px'
      }}>
        {footerLinks.map((col, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {col.map((link) => (
              <span 
                key={link} 
                style={{ cursor: 'pointer', transition: 'text-decoration 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {link}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Service Code Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setServiceCode(!serviceCode)}
          style={{
            background: 'transparent',
            border: '1px solid #808080',
            color: '#808080',
            padding: '6px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          {serviceCode ? '091-724' : 'Service Code'}
        </button>
      </div>

      {/* Copyright */}
      <div>
        <p>© 1997-2026 Netflix, Inc. · Built from Figma Design</p>
      </div>
    </footer>
  );
}
