import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="section-shell footer__grid">
        <div>
          <a className="footer__brand" href="#home">
            <img
              src={"/directproperty.jpg"}
              width={80}
              style={{borderRadius: "50%"}}/>
          </a>
          <p>
            Premium real estate advisory for buyers, sellers, and investors across the markets.
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
          <h3>Contact</h3>
          <a href="tel:+918224049845">8224049845</a>
          <a href="mailto:Directpropertyraipur@gmail.com">Directpropertyraipur@gmail.com</a>
          <span>Bhatagaon, Raipur (C.G)</span>
        </div>

        <div>
           <h3>Social Links</h3>
          <div className="footer__socials">
            <a href="#contact" aria-label="Instagram">
              <img
              src={"/instagram.png"}/>
            </a>
            <a href="#contact" aria-label="LinkedIn">
              <img
              src={"/whatsapp.png"}/>
            </a>
            <a href="#contact" aria-label="Facebook">
              <img
              src={"/facebook.png"}/>
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
