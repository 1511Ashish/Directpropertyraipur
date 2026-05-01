import './About.css';

function About({ stats }) {
  return (
    <section className="about section-shell" id="about">
      <div className="about__panel glass-panel">
        <div className="about__image-wrap">
          <img
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80"
            alt="Modern real estate office"
            loading="lazy"
          />
        </div>

        <div className="about__content">
          <span className="eyebrow">About the company</span>
          <h2 className="section-title">Trusted guidance with a sharper eye for quality property.</h2>
          <p className="section-copy">
            We combine local market intelligence, global reach, and white-glove service to
            help buyers, sellers, and investors move with confidence.
          </p>

          <div className="about__columns">
            <div>
              <h3>Mission</h3>
              <p>
                Deliver transparent advice and exceptional opportunities that match each
                client&apos;s lifestyle goals and investment strategy.
              </p>
            </div>
            <div>
              <h3>Vision</h3>
              <p>
                Build the most dependable cross-market real estate experience for modern
                buyers seeking simplicity, clarity, and long-term value.
              </p>
            </div>
          </div>

          <div className="about__stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
