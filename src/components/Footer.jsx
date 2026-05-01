import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="section-shell footer__grid">
        <div>
          <a className="footer__brand" href="#home">
            Direct Property
          </a>
          <p>
            Premium real estate advisory for buyers, sellers, and investors across
            high-growth global markets.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#listings">Listings</a>
          <a href="#about">About</a>
          <a href="#testimonials">Testimonials</a>
        </div>

        <div>
          <h3>Categories</h3>
          <a href="#listings">Apartments</a>
          <a href="#listings">Villas</a>
          <a href="#listings">Townhouses</a>
          <a href="#listings">Investment Homes</a>
        </div>

        <div>
          <h3>Contact</h3>
          <a href="tel:+918224049845">8224049845</a>
          <a href="mailto:Directpropertyraipur@gmail.com">Directpropertyraipur@gmail.com</a>
          <span>Bhatagaon, Raipur (C.G)</span>
          <div className="footer__socials">
            <a href="#contact" aria-label="Instagram">
              IG
            </a>
            <a href="#contact" aria-label="LinkedIn">
              IN
            </a>
            <a href="#contact" aria-label="Facebook">
              FB
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="section-shell">
          <p>&copy; 2026 Direct Property. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
