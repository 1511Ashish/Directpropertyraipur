import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingsGrid from './components/ListingsGrid';
import About from './components/About';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const HOME_PATH = '/';
const PROPERTY_PATH = '/property';
const LISTINGS_BATCH_SIZE = 8;

const defaultFilters = {
  type: 'All',
  query: ''
};

const API_URL = 'https://directpropertybackend.onrender.com/api/v1/properties';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

const formatLabel = (value, fallback = 'Property') => {
  if (value == null) {
    return fallback;
  }

  const normalized = String(value).trim();

  if (!normalized) {
    return fallback;
  }

  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getNumber = (...values) => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.]/g, '');

      if (cleaned) {
        const parsed = Number(cleaned);

        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }
  }

  return null;
};

const buildLocation = (item) => {
  if (typeof item?.location === 'string' && item.location.trim()) {
    return item.location.trim();
  }

  if (item?.location && typeof item.location === 'object') {
    const nestedLocation = [
      item.location.address,
      item.location.locality,
      item.location.area,
      item.location.city,
      item.location.state,
      item.location.pincode,
      item.location.country
    ]
      .filter((value) => typeof value === 'string' && value.trim())
      .map((value) => value.trim());

    if (nestedLocation.length > 0) {
      return nestedLocation.join(', ');
    }
  }

  const parts = [
    item.address,
    item.locality,
    item.area,
    item.city,
    item.state,
    item.pincode,
    item.country
  ]
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim());

  return parts.join(', ');
};

const getImage = (item) => {
  const imageSets = [item.images, item.propertyImages, item.gallery, item.photos];

  for (const set of imageSets) {
    if (Array.isArray(set)) {
      for (const entry of set) {
        if (typeof entry === 'string' && entry.trim()) {
          return entry;
        }

        if (entry && typeof entry === 'object') {
          const candidate = entry.url || entry.src || entry.image;

          if (typeof candidate === 'string' && candidate.trim()) {
            return candidate;
          }
        }
      }
    }
  }

  const directImage =
    item.image || item.imageUrl || item.thumbnail || item.featuredImage || item.coverImage;

  return typeof directImage === 'string' && directImage.trim() ? directImage : FALLBACK_IMAGE;
};

const getText = (...values) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
};

const getTimestamp = (item) => {
  const dateFields = [
    item.createdAt,
    item.created_at,
    item.postedAt,
    item.publishedAt,
    item.addedAt,
    item.updatedAt,
    item.date
  ];

  for (const value of dateFields) {
    if (!value) {
      continue;
    }

    const timestamp = new Date(value).getTime();

    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return 0;
};

const isAvailableProperty = (item) => {
  const statusText = getText(
    item.status,
    item.saleStatus,
    item.propertyStatus,
    item.listingStatus,
    item.availability,
    item.listingType,
    item.adType
  ).toLowerCase();

  return !statusText.includes('sold');
};

const normalizeProperty = (item, index) => {
  const numericPrice = getNumber(
    item.price,
    item.expectedPrice,
    item.propertyPrice,
    item.amount,
    item.budget
  );
  const rawType = getText(item.propertyType, item.type, item.category, item.propertyCategory);
  const location = buildLocation(item) || 'Location available on request';
  const title = getText(item.title, item.name, item.propertyName, item.propertyTitle) || location;
  const description =
    getText(item.description, item.details, item.about, item.summary) ||
    'Contact Direct Property for the full specification and latest availability.';
  const bedrooms = getNumber(item.bedrooms, item.beds, item.bhk, item.bedroom);
  const bathrooms = getNumber(item.bathrooms, item.baths, item.bathroom, item.toilets);
  const areaValue = getNumber(
    item.area,
    item.size,
    item.superBuiltupArea,
    item.builtupArea,
    item.carpetArea
  );
  const areaUnit = getText(item.areaUnit, item.sizeUnit, item.unit) || 'sq ft';
  const listingKind = getText(item.listingType, item.purpose, item.adType, item.status);
  const timestamp = getTimestamp(item);

  return {
    id: item._id || item.id || item.propertyId || `${title}-${index}`,
    title,
    location,
    description,
    image: getImage(item),
    imageAlt: `${title} image`,
    tag: formatLabel(listingKind || 'Available', 'Available'),
    price:
      numericPrice != null
        ? new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          }).format(numericPrice)
        : getText(item.priceLabel, item.price, item.expectedPrice) || 'Price on request',
    numericPrice: numericPrice ?? 0,
    beds: bedrooms ?? null,
    baths: bathrooms ?? null,
    area: areaValue != null ? `${areaValue.toLocaleString('en-IN')} ${areaUnit}` : 'Area on request',
    category: formatLabel(rawType, 'Property'),
    timestamp,
    raw: item
  };
};

const extractProperties = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.properties)) {
    return payload.data.properties;
  }

  if (Array.isArray(payload?.properties)) {
    return payload.properties;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  return [];
};

function App() {
  const getPathname = () => window.location.pathname.replace(/\/+$/, '') || HOME_PATH;
  const [filters, setFilters] = useState(defaultFilters);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [pathname, setPathname] = useState(getPathname);
  const [pendingSection, setPendingSection] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProperties = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const items = extractProperties(payload)
          .filter(isAvailableProperty)
          .map(normalizeProperty)
          .filter(Boolean)
          .sort((first, second) => second.timestamp - first.timestamp);

        setProperties(items);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return;
        }

        setProperties([]);
        setError('We could not load properties right now. Please try again in a moment.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getPathname());
      setSelectedProperty(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (pathname !== HOME_PATH) {
      return;
    }

    const targetSection = pendingSection || window.location.hash.replace('#', '');

    if (!targetSection) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingSection('');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, pendingSection]);

  const stats = useMemo(
    () => [
      { value: '200+', label: 'Properties sold' },
      { value: '600+', label: 'Happy clients' }
      // { value: '38', label: 'Global markets' }
    ],
    []
  );

  const propertyTypes = useMemo(() => {
    const types = properties
      .map((property) => property.category)
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

    return ['All', ...types];
  }, [properties]);

  const displayedProperties = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return properties.filter((property) => {
      const typeMatch = filters.type === 'All' || property.category === filters.type;
      const queryMatch =
        query === '' ||
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.category.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query);

      return typeMatch && queryMatch;
    });
  }, [filters, properties]);

  const handleFilterChange = (nextFilters) => {
    setFilters((current) =>
      typeof nextFilters === 'function' ? nextFilters(current) : { ...current, ...nextFilters }
    );
  };

  const handleSearch = (nextFilters = filters) => {
    handleFilterChange(nextFilters);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navigateToPath = (nextPath) => {
    if (getPathname() !== nextPath) {
      window.history.pushState({}, '', nextPath);
      setPathname(nextPath);
    }

    setSelectedProperty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHomeSection = (sectionId = 'home') => {
    if (pathname === HOME_PATH) {
      window.history.replaceState({}, '', `${HOME_PATH}#${sectionId}`);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setPendingSection(sectionId);
    window.history.pushState({}, '', `${HOME_PATH}#${sectionId}`);
    setPathname(HOME_PATH);
    setSelectedProperty(null);
  };

  const isPropertyPage = pathname === PROPERTY_PATH;
  const homePreviewProperties = displayedProperties.slice(0, LISTINGS_BATCH_SIZE);

  return (
    <div className="app-shell">
      <Navbar
        isPropertyPage={isPropertyPage}
        onNavigateHomeSection={navigateToHomeSection}
        onNavigateProperty={() => navigateToPath(PROPERTY_PATH)}
      />
      {!isPropertyPage ? (
        <Hero
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      ) : null}
      <main>
        <ListingsGrid
          allPropertiesCount={properties.length}
          batchSize={LISTINGS_BATCH_SIZE}
          error={error}
          filters={filters}
          homeHref={isPropertyPage ? HOME_PATH : '#home'}
          isLoading={isLoading}
          onCloseProperty={() => setSelectedProperty(null)}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onSelectProperty={setSelectedProperty}
          properties={isPropertyPage ? displayedProperties : homePreviewProperties}
          propertyTypes={propertyTypes}
          sectionId={isPropertyPage ? 'property' : 'listings'}
          selectedProperty={selectedProperty}
          showExploreMore={!isPropertyPage && displayedProperties.length > LISTINGS_BATCH_SIZE}
          onExploreMore={() => navigateToPath(PROPERTY_PATH)}
          title={
            isPropertyPage
              ? 'Explore all available properties curated for your next move.'
              : 'Homes selected for modern living and long-term value.'
          }
          copy={
            isPropertyPage
              ? 'Browse every available listing. The first 8 load immediately, and more appear as you scroll.'
              : 'Explore standout residences, with transparent pricing and details buyers care about most.'
          }
          eyebrow={isPropertyPage ? 'Available properties' : 'Featured portfolio'}
          useInfiniteScroll={isPropertyPage}
        />
        {!isPropertyPage ? (
          <>
            <About stats={stats} />
            <Testimonials />
            <CTASection />
          </>
        ) : null}
      </main>
      <Footer
        isPropertyPage={isPropertyPage}
        onNavigateHomeSection={navigateToHomeSection}
        onNavigateProperty={() => navigateToPath(PROPERTY_PATH)}
      />
    </div>
  );
}

export default App;
