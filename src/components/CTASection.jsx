import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta section-shell">
      <div className="cta__panel">
        <div>
          <span className="eyebrow cta__eyebrow">Let&apos;s talk property</span>
          <h2>Looking to Buy or Sell a Property?</h2>
          <p>
            Connect with advisors who understand pricing, positioning, and how
            to move decisively in competitive markets.
          </p>
        </div>

        <div className="cta__actions" id="contact">
          <a className="accent-button" href="tel:+918224049845">
            Contact Us
          </a>
          <a
            className="ghost-button"
            href="https://wa.me/+918224049845"
          >
            <img src={"/whatsapp.png"} width="28" height="28" />
            Whatsapp
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
