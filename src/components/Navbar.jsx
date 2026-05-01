import { useState } from 'react';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Listings', href: '#listings' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' }
];

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <header className="navbar">
      <div className="section-shell navbar__inner glass-panel">
        <a className="navbar__brand" href="#home">
          <span className="navbar__brand-mark">DP</span>
          <span className="navbar__brand-text">Direct Property</span>
        </a>

        <button
          className="navbar__toggle"
          type="button"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setIsDrawerOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`navbar__nav${isDrawerOpen ? ' navbar__nav--open' : ''}`}
          id="mobile-nav"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeDrawer}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* <a className="navbar__cta" href="#contact">
          Book a Call
        </a> */}
      </div>
    </header>
  );
}

export default Navbar;
