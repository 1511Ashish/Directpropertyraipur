import './Footer.css';

function Footer({ onNavigateHomeSection, onNavigateProperty, isPropertyPage }) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (event, action) => {
    event.preventDefault();
    action();
  };

  return (
    <footer className="footer">
      <div className="section-shell footer__grid">
        <div className="footer__header">
          <a
            className="footer__brand"
            href={isPropertyPage ? '/' : '#home'}
            onClick={(event) => handleNavigate(event, () => onNavigateHomeSection('home'))}
          >
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
          <a href={isPropertyPage ? '/' : '#home'} onClick={(event) => handleNavigate(event, () => onNavigateHomeSection('home'))}>Home</a>
          <a href="/property" onClick={(event) => handleNavigate(event, onNavigateProperty)}>Property</a>
          <a href="#about" onClick={(event) => handleNavigate(event, () => onNavigateHomeSection('about'))}>About</a>
          <a href="#testimonials" onClick={(event) => handleNavigate(event, () => onNavigateHomeSection('testimonials'))}>Testimonials</a>
        </div>        

        <div>
          <h3>Contact</h3>
          <div className="footer__contacts">
          <a href="tel:+918224049845">+91 8224049845</a>
          <a href="tel:+918602112059">+91 8602112059</a>
          </div>
          <a href="mailto:Directpropertyraipur@gmail.com">Directpropertyraipur@gmail.com</a>
          <a href="https://maps.app.goo.gl/s59FYdMji45q2DKLA?g_st=ac"><span>LG 25, Rajat Centrum, Bhatagaon, Raipur (C.G)</span></a>
        </div>

        <div>
           <h3>Social Links</h3>
          <div className="footer__socials">
            <a href="https://www.instagram.com/directpropertyraipur.house/" aria-label="Instagram">
              <img
              src={"/instagram.png"}/>
            </a>
            <a href="https://wa.me/+918224049845" aria-label="LinkedIn">
              <img
              src={"/whatsapp.png"}/>
            </a>
            <a href="https://www.facebook.com/directpropertyraipur.house" aria-label="Facebook">
              <img
              src={"/facebook.png"}/>
            </a>
            <a href="https://youtube.com/@directpropertyraipur?si=sPoGWnl_sFM0--3b" aria-label="Facebook">
              <img
              src={"/youtube.png"}/>
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="section-shell">
          <p>&copy; {currentYear} Direct Property. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
