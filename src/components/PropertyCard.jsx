import './PropertyCard.css';

function PropertyCard({ property }) {
  // const shortTitle =
  //   property.title.length > 20 ? `${property.title.slice(0, 20).trim()}...` : property.title;

  return (
    <article className="property-card glass-panel">
      <div className="property-card__media">
        <img src={property.image} alt={property.title} loading="lazy" />
        <span className="property-card__tag">{property.tag}</span>
      </div>

      <div className="property-card__body">
        <div className="property-card__topline">
          <span className="">{property.tag}</span>
          <strong>₹{property.numericPrice}</strong>
        </div>
        <div title={property.title} className="property-card__title">{property.title}</div>
        <div className="property-card__location">{property.location}</div>

        <div className="property-card__meta" aria-label="Property details">
          <span>{property.beds} Beds</span>
          <span>{property.baths} Baths</span>
          <span>{property.area}</span>
        </div>

        <button className="accent-button property-card__button" type="button">
          View Details
        </button>
      </div>
    </article>
  );
}

export default PropertyCard;
