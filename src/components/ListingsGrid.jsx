import { useEffect } from 'react';
import ApiPropertyCard from './ApiPropertyCard';
import './ListingsGrid.css';
import { Bath, BedDouble, Ruler } from 'lucide-react';

function ListingsGrid({
  allPropertiesCount,
  error,
  filters,
  isLoading,
  onFilterChange,
  onSearch,
  properties,
  propertyTypes,
  selectedProperty,
  onSelectProperty,
  onCloseProperty
}) {
  const showSelectedBeds = Number(selectedProperty?.beds) > 1;
  const showSelectedBaths = Number(selectedProperty?.baths) > 1;
  const hasFetchedProperties = allPropertiesCount > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  useEffect(() => {
    if (!selectedProperty) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCloseProperty();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onCloseProperty, selectedProperty]);

  return (
    <section className="listings section-shell" id="listings">
      <div className="section-header">
        <span className="eyebrow">Featured portfolio</span>
        <h2 className="section-title">Homes selected for modern living and long-term value.</h2>
        <p className="section-copy">
          Explore standout residences, with transparent
          pricing and details buyers care about most.
        </p>
      </div>

      <form className="inputSearch" onSubmit={handleSubmit}>
        <label className="listings__filter">
          {/* <span>Search</span> */}
          
          <input
            type="text"
            name="query"
            placeholder="Search property"
            value={filters.query}
            onChange={handleChange}
          />
        </label>

        {/* <button className="accent-button listings__submit" type="submit">
          Search
        </button> */}
      </form>

      <div className="listings__typebar" aria-label="Property type filters">
        {propertyTypes.map((type) => (
          <button
            key={type}
            className={`listings__typechip ${filters.type === type ? 'is-active' : ''}`}
            type="button"
            onClick={() => onFilterChange({ type })}
          >
            {type}
          </button>
        ))}
      </div>

      {error ? (
        <div className="listings__status listings__status--error glass-panel" role="alert">
          <h3>Property feed unavailable</h3>
          <p>{error}</p>
        </div>
      ) : null}

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
            <ApiPropertyCard
              key={property.id}
              property={property}
              onSelect={() => onSelectProperty(property)}
            />
          ))}
        </div>
      ) : hasFetchedProperties ? (
        <div className="listings__status glass-panel" role="status">
          <h3>No properties matched your search.</h3>
          <p>Try another keyword or switch the property type filter to see more listings.</p>
        </div>
      ) : (
        <div className="listings__empty glass-panel" role="status">
          <h3>No properties are available right now.</h3>
          <p>Refresh shortly or contact Direct Property for the latest available listings.</p>
          <a className="accent-button" href="#home">
            Back to Home
          </a>
        </div>
      )}

      {selectedProperty ? (
        <div className="property-modal" role="dialog" aria-modal="true" aria-labelledby="property-modal-title">
          <button
            className="property-modal__backdrop"
            type="button"
            aria-label="Close property details"
            onClick={onCloseProperty}
          />

          <article className="property-modal__card glass-panel">
            <button
              className="property-modal__close"
              type="button"
              aria-label="Close property details"
              onClick={onCloseProperty}
            >
              X
            </button>

            <div className="property-modal__media">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.imageAlt}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src =
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            <div className="property-modal__content">
              <span className="property-modal__tag">{selectedProperty.tag}</span>
              <h3 id="property-modal-title">{selectedProperty.title}</h3>
              <strong className="property-modal__price">{selectedProperty.price}</strong>
              <p className="property-modal__location">{selectedProperty.location}</p>

              <div className="property-modal__meta" aria-label="Property features">
                <span>{selectedProperty.category}</span>
                {showSelectedBeds ? (
                  <span>
                    <BedDouble size={16} strokeWidth={2} />
                    {`${selectedProperty.beds} Beds`}
                  </span>
                ) : null}
                {showSelectedBaths ? (
                  <span>
                    <Bath size={16} strokeWidth={2} />
                    {`${selectedProperty.baths} Baths`}
                  </span>
                ) : null}
                <span>
                  <Ruler size={16} strokeWidth={2} />
                  {selectedProperty.area}
                </span>
              </div>
              <p className="property-modal__description">{selectedProperty.description}</p>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default ListingsGrid;
