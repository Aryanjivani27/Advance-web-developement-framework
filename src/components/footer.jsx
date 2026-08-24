import React from 'react';

export default function Footer({ socials, copyright }) {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-info">
            <h3 className="footer-brand">Antigravity Dev</h3>
            <p className="footer-tagline">Crafting digital experiences that defy expectation.</p>
          </div>

          <div className="footer-socials">
            <span className="socials-label">Connect</span>
            <div className="socials-list">
              {socials && socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">{copyright || `© ${new Date().getFullYear()} All rights reserved.`}</p>
          <a href="#" className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
