import { startTransition, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingsGrid from './components/ListingsGrid';
import About from './components/About';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { properties } from './data/properties';
import { priceOptions, propertyTypes } from './data/filterOptions';

const defaultFilters = {
  type: 'All Types',
  price: 'Any Price',
  location: ''
};

const priceRanges = {
  'Up to $500k': [0, 500000],
  '$500k - $1M': [500000, 1000000],
  '$1M - $2M': [1000000, 2000000],
  '$2M+': [2000000, Number.POSITIVE_INFINITY]
};

function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [displayedProperties, setDisplayedProperties] = useState(properties);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  const stats = useMemo(
    () => [
      { value: '2,400+', label: 'Properties sold' },
      { value: '1,800+', label: 'Happy clients' },
      { value: '38', label: 'Global markets' }
    ],
    []
  );

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    setIsLoading(true);

    startTransition(() => {
      const nextResults = properties.filter((property) => {
        const typeMatch =
          nextFilters.type === 'All Types' || property.category === nextFilters.type;

        const priceMatch =
          nextFilters.price === 'Any Price' ||
          (() => {
            const [min, max] = priceRanges[nextFilters.price];
            return property.numericPrice >= min && property.numericPrice <= max;
          })();

        const locationMatch =
          nextFilters.location.trim() === '' ||
          property.location.toLowerCase().includes(nextFilters.location.trim().toLowerCase()) ||
          property.title.toLowerCase().includes(nextFilters.location.trim().toLowerCase());

        return typeMatch && priceMatch && locationMatch;
      });

      window.setTimeout(() => {
        setDisplayedProperties(nextResults);
        setIsLoading(false);
        document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    });
  };

  return (
    <div className="app-shell">
      <Navbar />
      <Hero
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        propertyTypes={propertyTypes}
        priceOptions={priceOptions}
      />
      <main>
        <ListingsGrid
          filters={filters}
          isLoading={isLoading}
          onFilterChange={setFilters}
          onSearch={handleSearch}
          priceOptions={priceOptions}
          properties={displayedProperties}
          propertyTypes={propertyTypes}
        />
        <About stats={stats} />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
