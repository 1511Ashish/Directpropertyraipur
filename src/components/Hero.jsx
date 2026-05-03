import './Hero.css';

function Hero({ filters, onFilterChange, onSearch }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  return (
    <section className="hero" id="home">
      <div className="hero__backdrop" />
      <div className="section-shell hero__content">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow">Trusted Property Dealer</span>
          <h1>Your Reliable Ally in Property</h1>
          <p>
            Discover curated homes, investment-grade properties, and tailored guidance in
            the Raipur&apos;s most desirable neighborhoods.
          </p>
        </div>

        <form className="hero__search glass-panel" onSubmit={handleSubmit}>
          <label className="hero__field">
            <span>Search Properties</span>
            <input
              type="text"
              name="query"
              placeholder="City, address, landmark, or property type"
              value={filters.query}
              onChange={handleChange}
            />
          </label>

          <button className="accent-button hero__submit" type="submit">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
