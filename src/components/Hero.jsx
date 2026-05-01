import './Hero.css';

function Hero({ filters, onFilterChange, onSearch, propertyTypes, priceOptions }) {
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
          <span className="eyebrow hero__eyebrow">Global property specialists</span>
          <h1>Your Reliable Ally in Worldwide Real Estate</h1>
          <p>
            Discover curated homes, investment-grade properties, and tailored guidance in
            the world&apos;s most desirable neighborhoods.
          </p>
        </div>

        <form className="hero__search glass-panel" onSubmit={handleSubmit}>
          <label className="hero__field">
            <span>Type</span>
            <select name="type" value={filters.type} onChange={handleChange}>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="hero__field">
            <span>Price</span>
            <select name="price" value={filters.price} onChange={handleChange}>
              {priceOptions.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </label>

          <label className="hero__field">
            <span>Location</span>
            <input
              type="text"
              name="location"
              placeholder="City, address, or landmark"
              value={filters.location}
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
