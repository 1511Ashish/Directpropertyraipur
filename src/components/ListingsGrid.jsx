import PropertyCard from './PropertyCard';
import './ListingsGrid.css';

function ListingsGrid({
  filters,
  isLoading,
  onFilterChange,
  onSearch,
  priceOptions,
  properties,
  propertyTypes
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  return (
    <section className="listings section-shell" id="listings">
      <div className="section-header">
        <span className="eyebrow">Featured portfolio</span>
        <h2 className="section-title">Homes selected for modern living and long-term value.</h2>
        <p className="section-copy">
          Explore standout residences across key global destinations, with transparent
          pricing and the details buyers care about most.
        </p>
      </div>

      <form className="listings__filters glass-panel" onSubmit={handleSubmit}>
        <label className="listings__filter">
          <span>Type</span>
          <select name="type" value={filters.type} onChange={handleChange}>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="listings__filter">
          <span>Price</span>
          <select name="price" value={filters.price} onChange={handleChange}>
            {priceOptions.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </label>

        <label className="listings__filter">
          <span>Location</span>
          <input
            type="text"
            name="location"
            placeholder="City or landmark"
            value={filters.location}
            onChange={handleChange}
          />
        </label>

        <button className="accent-button listings__submit" type="submit">
          Apply Filters
        </button>
      </form>

      {isLoading ? (
        <div className="listings__grid" aria-live="polite" aria-busy="true">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="listing-skeleton glass-panel" key={index}>
              <div className="listing-skeleton__image" />
              <div className="listing-skeleton__line listing-skeleton__line--sm" />
              <div className="listing-skeleton__line" />
              <div className="listing-skeleton__line listing-skeleton__line--lg" />
              <div className="listing-skeleton__meta" />
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="listings__grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="listings__empty glass-panel" role="status">
          <h3>No properties matched your search.</h3>
          <p>Try a broader location or a wider budget range to explore more listings.</p>
          <a className="accent-button" href="#home">
            Refine Search
          </a>
        </div>
      )}
    </section>
  );
}

export default ListingsGrid;
