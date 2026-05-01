import './CTASection.css';

function CTASection() {
  return (
    <section className="cta section-shell">
      <div className="cta__panel">
        <div>
          <span className="eyebrow cta__eyebrow">Let&apos;s talk property</span>
          <h2>Looking to Buy or Sell a Property?</h2>
          <p>
            Connect with advisors who understand pricing, positioning, and how to move
            decisively in competitive markets.
          </p>
        </div>

        <div className="cta__actions" id="contact">
          <a className="accent-button" href="mailto:hello@directproperty.com">
            Contact Us
          </a>
          <a className="ghost-button" href="#listings">
            List Your Property
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
