import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDrawerOpen]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <header className="navbar">
      <div className="section-shells navbar__inner glass-panel">
        <a className="navbar__brand" href="#home">
          <img
          src={"/directproperty.jpg"}
          width={50}
          style={{width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%"}}/>
        </a>

        <button
          className={`navbar__toggle${isDrawerOpen ? ' navbar__toggle--open' : ''}`}
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

        <div className={`navbar__drawer${isDrawerOpen ? ' navbar__drawer--open' : ''}`}>
          <button
            className="navbar__drawer-backdrop"
            type="button"
            aria-label="Close navigation menu"
            onClick={closeDrawer}
          />

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
        </div>

        {/* <a className="navbar__cta" href="#contact">
          Book a Call
        </a> */}
      </div>
    </header>
  );
}

export default Navbar;
