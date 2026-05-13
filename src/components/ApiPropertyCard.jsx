import './PropertyCard.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

function MetaIcon({ children }) {
  return (
    <svg
      aria-hidden="true"
      className="property-card__meta-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const truncateCardText = (value, maxLength = 30) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
};

function ApiPropertyCard({ property, onSelect }) {
  const handleImageError = (event) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };
  const showBeds = Number(property.beds) > 1;
  const showBaths = Number(property.baths) > 1;

  return (
    <article
      className="property-card glass-panel"
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="property-card__media">
        <img
          src={property.image}
          alt={property.imageAlt || property.title}
          loading="lazy"
          onError={handleImageError}
        />
        <span className="property-card__tag">{property.tag}</span>
      </div>

      <div className="property-card__body_main">
        <div className="property-card__body">
        <div className="property-card__topline">
          <div className="property-card__metatop">
            <span>
              {truncateCardText(property.category)}
            </span>
          </div>
          <strong>{property.price}</strong>
        </div>
        <div title={property.title} className="property-card__title">
          {truncateCardText(property.title)}
        </div>
        <div title={property.location} className="property-card__location">
          {truncateCardText(property.location)}
        </div>
        </div>

        <div className="property-card__body">
        <div className="property-card__meta" aria-label="Property details">
          {showBeds ? (
            <span>
              <MetaIcon>
                <path d="M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5" />
                <path d="M4 18v-7h16v7" />
                <path d="M4 15h16" />
                <path d="M7 18v2" />
                <path d="M17 18v2" />
              </MetaIcon>
              {`${property.beds}`}
            </span>
          ) : null}
          {showBaths ? (
            <span>
              <MetaIcon>
                <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                <path d="M5 10h14v3a7 7 0 0 1-14 0Z" />
                <path d="M19 10h1" />
              </MetaIcon>
              {`${property.baths}`}
            </span>
          ) : null}
          <span>
            <MetaIcon>
              <path d="M4 9V5h4" />
              <path d="M20 9V5h-4" />
              <path d="M4 15v4h4" />
              <path d="M20 15v4h-4" />
              <path d="M9 5h6" />
              <path d="M9 19h6" />
              <path d="M5 9v6" />
              <path d="M19 9v6" />
            </MetaIcon>
            {truncateCardText(property.area)}
          </span>
        </div>

        <button
          className="accent-button property-card__button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          View Details
        </button>
        </div>
      </div>
    </article>
  );
}

export default ApiPropertyCard;
