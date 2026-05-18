import { useEffect, useMemo, useRef, useState } from "react";
import ApiPropertyCard from "./ApiPropertyCard";
import "./ListingsGrid.css";
import {
  Bath,
  BedDouble,
  Building2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Compass,
  DoorOpen,
  Layers,
  Ruler,
  LandPlot,
  Sofa,
  Sparkles,
} from "lucide-react";

const EMPTY_TEXT_VALUES = new Set([
  "",
  "null",
  "undefined",
  "n/a",
  "na",
  "none",
  "-",
]);

const isUsableText = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return !EMPTY_TEXT_VALUES.has(value.trim().toLowerCase());
};

const formatFieldValue = (value) => {
  if (value == null || value === false) {
    return "";
  }

  if (typeof value === "boolean") {
    return "Yes";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString("en-IN") : "";
  }

  if (typeof value === "string") {
    return isUsableText(value) ? value.trim() : "";
  }

  if (Array.isArray(value)) {
    return value
      .map(formatFieldValue)
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return formatFieldValue(
      value.name ||
        value.title ||
        value.label ||
        value.value ||
        value.type ||
        value.room,
    );
  }

  return "";
};

const getFieldValue = (...values) => {
  for (const value of values) {
    const formatted = formatFieldValue(value);

    if (formatted) {
      return formatted;
    }
  }

  return "";
};

function ListingsGrid({
  allPropertiesCount,
  batchSize = 8,
  copy,
  eyebrow,
  error,
  filters,
  homeHref = "#home",
  isLoading,
  onFilterChange,
  onExploreMore,
  onCloseProperty,
  onSearch,
  onSelectProperty,
  properties,
  propertyTypes,
  sectionId = "listings",
  selectedProperty,
  showExploreMore = false,
  title,
  useInfiniteScroll = false,
}) {
  const hasFetchedProperties = allPropertiesCount > 0;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const loadMoreRef = useRef(null);
  const selectedImages = selectedProperty?.images?.length
    ? selectedProperty.images
    : selectedProperty?.image
      ? [selectedProperty.image]
      : [];
  const hasMultipleSelectedImages = selectedImages.length > 1;
  const selectedRaw = selectedProperty?.raw || {};
  const selectedFeatureItems = selectedProperty
    ? [
        {
          label: "Category",
          value: getFieldValue(selectedProperty.category),
        },
        {
          label: "Beds",
          value: getFieldValue(selectedProperty.beds),
          suffix: "Beds",
          icon: BedDouble,
        },
        {
          label: "Baths",
          value: getFieldValue(selectedProperty.baths),
          suffix: "Baths",
          icon: Bath,
        },
        {
          label: "Area",
          value: getFieldValue(
            selectedProperty.area === "Area on request" ? "" : selectedProperty.area,
          ),
          icon: Ruler,
        },
        {
          label: "Construction Area",
          value: getFieldValue(
            selectedProperty.constructionArea,
            selectedProperty.constructionSize,
            selectedRaw.constructionArea,
            selectedRaw.construction_area,
            selectedRaw.constructionSize,
            selectedRaw.constructedArea,
            selectedRaw.builtupArea,
            selectedRaw.builtUpArea,
          ),
          icon: LandPlot,
        },
        {
          label: "Facing",
          value: getFieldValue(
            selectedProperty.facing,
            selectedRaw.facing,
            selectedRaw.direction,
            selectedRaw.propertyFacing,
          ),
          icon: Compass,
        },
        {
          label: "Kitchen",
          value: getFieldValue(
            selectedProperty.kitchen,
            selectedRaw.kitchen,
            selectedRaw.kitchens,
            selectedRaw.noOfKitchens,
          ),
          icon: ChefHat,
        },
        {
          label: "Hall",
          value: getFieldValue(
            selectedProperty.hall,
            selectedRaw.hall,
            selectedRaw.halls,
            selectedRaw.livingRoom,
            selectedRaw.livingRooms,
          ),
          icon: Sofa,
        },
        {
          label: "Tower",
          value: getFieldValue(
            selectedProperty.tower,
            selectedRaw.tower,
            selectedRaw.towerName,
            selectedRaw.block,
          ),
          icon: Building2,
        },
      ].filter((item) => item.value)
    : [];
  const selectedDetailItems = selectedProperty
    ? [
        {
          label: "Amenities",
          value: getFieldValue(
            selectedProperty.amenities,
            selectedRaw.amenities,
            selectedRaw.facilities,
            selectedRaw.features,
          ),
          icon: Sparkles,
        },
        {
          label: "Other Rooms",
          value: getFieldValue(
            selectedProperty.otherRooms,
            selectedRaw.otherRooms,
            selectedRaw.other_rooms,
            selectedRaw.additionalRooms,
            selectedRaw.extraRooms,
            selectedRaw.rooms,
          ),
          icon: DoorOpen,
        },
        {
          label: "Floor",
          value: getFieldValue(
            selectedProperty.floor,
            selectedRaw.floor,
            selectedRaw.floorNo,
            selectedRaw.floorNumber,
          ),
          icon: Layers,
        },
      ].filter((item) => item.value)
    : [];

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
      if (event.key === "Escape") {
        onCloseProperty();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onCloseProperty, selectedProperty]);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [batchSize, filters.query, filters.type, useInfiniteScroll]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedProperty?.id]);

  useEffect(() => {
    if (!hasMultipleSelectedImages) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSelectedImageIndex((current) => (current + 1) % selectedImages.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [hasMultipleSelectedImages, selectedImages.length]);

  const visibleProperties = useMemo(() => {
    if (!useInfiniteScroll) {
      return properties;
    }

    return properties.slice(0, visibleCount);
  }, [properties, useInfiniteScroll, visibleCount]);

  const hasMoreProperties =
    useInfiniteScroll && visibleCount < properties.length;

  useEffect(() => {
    if (!hasMoreProperties || !loadMoreRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + batchSize, properties.length),
          );
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [batchSize, hasMoreProperties, properties.length]);

  return (
    <section className="listings section-shell" id={sectionId}>
      <div className="section-header">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
        {/* <p className="section-copy">{copy}</p> */}
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
            className={`listings__typechip ${filters.type === type ? "is-active" : ""}`}
            type="button"
            onClick={() => onFilterChange({ type })}
          >
            {type}
          </button>
        ))}
      </div>

      {error ? (
        <div
          className="listings__status listings__status--error glass-panel"
          role="alert"
        >
          <h3>Property feed unavailable</h3>
          <p>{error}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="listings__grid" aria-live="polite" aria-busy="true">
          {Array.from({ length: batchSize }).map((_, index) => (
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
        <>
          <div className="listings__grid">
            {visibleProperties.map((property) => (
              <ApiPropertyCard
                key={property.id}
                property={property}
                onSelect={() => onSelectProperty(property)}
              />
            ))}
          </div>

          {showExploreMore ? (
            <div className="listings__actions">
              <button
                className="accent-button listings__action-button"
                type="button"
                onClick={onExploreMore}
              >
                Explore More
              </button>
            </div>
          ) : null}

          {hasMoreProperties ? (
            <div
              className="listings__sentinel"
              ref={loadMoreRef}
              aria-hidden="true"
            />
          ) : null}
        </>
      ) : hasFetchedProperties ? (
        <div className="listings__status glass-panel" role="status">
          <h3>No properties matched your search.</h3>
          <p>
            Try another keyword or switch the property type filter to see more
            listings.
          </p>
        </div>
      ) : (
        <div className="listings__empty glass-panel" role="status">
          <h3>No properties are available right now.</h3>
          <p>
            Refresh shortly or contact Direct Property for the latest available
            listings.
          </p>
          <a className="accent-button" href={homeHref}>
            Back to Home
          </a>
        </div>
      )}

      {selectedProperty ? (
        <div
          className="property-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="property-modal-title"
        >
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
              <div
                className="property-modal__slider"
                style={{
                  transform: `translateX(-${selectedImageIndex * 100}%)`,
                }}
              >
                {selectedImages.map((image, index) => (
                  <img
                    src={image}
                    alt={`${selectedProperty.imageAlt} ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    key={`${image}-${index}`}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                ))}
              </div>

              {hasMultipleSelectedImages ? (
                <>
                  <button
                    className="property-modal__nav property-modal__nav--prev"
                    type="button"
                    aria-label="Previous property image"
                    onClick={() =>
                      setSelectedImageIndex((current) =>
                        current === 0 ? selectedImages.length - 1 : current - 1,
                      )
                    }
                  >
                    <ChevronLeft size={22} strokeWidth={2.4} />
                  </button>
                  <button
                    className="property-modal__nav property-modal__nav--next"
                    type="button"
                    aria-label="Next property image"
                    onClick={() =>
                      setSelectedImageIndex(
                        (current) => (current + 1) % selectedImages.length,
                      )
                    }
                  >
                    <ChevronRight size={22} strokeWidth={2.4} />
                  </button>
                  <div
                    className="property-modal__dots"
                    aria-label="Property images"
                  >
                    {selectedImages.map((image, index) => (
                      <button
                        className={`property-modal__dot ${
                          selectedImageIndex === index ? "is-active" : ""
                        }`}
                        key={`${image}-${index}`}
                        type="button"
                        aria-label={`Show property image ${index + 1}`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="property-modal__content">
              <span className="property-modal__tag">
                {selectedProperty.tag}
              </span>
              <h3 id="property-modal-title">{selectedProperty.title}</h3>
              <strong className="property-modal__price">
                {selectedProperty.price}
              </strong>
              <p className="property-modal__location">
                {selectedProperty.location}
              </p>

              {selectedFeatureItems.length > 0 ? (
                <div
                  className="property-modal__meta"
                  aria-label="Property features"
                >
                  {selectedFeatureItems.map(({ icon: Icon, label, suffix, value }) => (
                    <span key={label} title={label}>
                      {Icon ? <Icon size={16} strokeWidth={2} /> : null}
                      {suffix ? `${value} ${suffix}` : value}
                    </span>
                  ))}
                </div>
              ) : null}
              {/* updated cards */}
              {selectedDetailItems.length > 0 ? (
                <div className="property-modal__details">
                  {selectedDetailItems.map(({ icon: Icon, label, value }) => (
                    <div className="property-modal__detail" key={label}>
                      <span className="property-modal__detail-label">
                        {Icon ? <Icon size={16} strokeWidth={2} /> : null}
                        {label}
                      </span>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {getFieldValue(selectedProperty.description) ? (
                <p
                  className="property-modal__description"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {selectedProperty.description}
                </p>
              ) : null}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default ListingsGrid;
