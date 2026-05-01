import { useEffect, useState, useRef } from 'react';
import { testimonials } from '../data/testimonials';
import './Testimonials.css';

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const trackRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  // Handle swipe touch events
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setSwipeDirection(null);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Determine swipe direction for visual feedback
    const distance = touchStart - currentTouch;
    if (Math.abs(distance) > 20) {
      setSwipeDirection(distance > 0 ? 'left' : 'right');
    }
    
    // Add swipe class to track for transition effect
    if (trackRef.current) {
      const translateX = (currentTouch - touchStart) / 3; // Reduced movement for better feel
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const onTouchEnd = () => {
    setIsSwiping(false);
    
    // Reset transform
    if (trackRef.current) {
      trackRef.current.style.transform = '';
    }
    
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      setTouchEnd(null);
      setSwipeDirection(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left - next testimonial
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }
    
    if (isRightSwipe) {
      // Swipe right - previous testimonial
      setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    setSwipeDirection(null);
  };

  // Helper function to determine visible cards based on screen size
  const getVisibleCards = () => {
    const isDesktop = window.innerWidth >= 900;
    
    if (isDesktop) {
      // Desktop: show 3 cards at a time
      const cards = [];
      for (let i = 0; i < 3; i++) {
        const index = (activeIndex + i) % testimonials.length;
        cards.push({ ...testimonials[index], displayIndex: index, originalIndex: index });
      }
      return cards;
    } else {
      // Mobile: show only 1 card
      return [{ ...testimonials[activeIndex], displayIndex: activeIndex, originalIndex: activeIndex }];
    }
  };

  // State to store window width for responsive updates
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleCards = getVisibleCards();
  const isDesktop = windowWidth >= 900;

  // Get previous and next cards for transition context
  const getPrevCard = () => {
    const prevIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    return testimonials[prevIndex];
  };

  const getNextCard = () => {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    return testimonials[nextIndex];
  };

  return (
    <section className="testimonials section-shell" id="testimonials">
      <div className="section-header">
        <span className="eyebrow">Client perspective</span>
        <h2 className="section-title">Results that feel personal, strategic, and measurable.</h2>
      </div>

      <div className="testimonials-container">
        <div 
          className={`testimonials__track ${isSwiping ? 'swiping' : ''} ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}
          ref={trackRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!isDesktop && (
            <>
              <div className="swipe-preview swipe-preview-left">
                <article className="testimonials__card glass-panel preview-card">
                  <img src={getPrevCard().image} alt={getPrevCard().name} loading="lazy" />
                  <div>
                    <p>&ldquo;{getPrevCard().quote.substring(0, 60)}...&rdquo;</p>
                    <strong>{getPrevCard().name}</strong>
                    <span>{getPrevCard().role}</span>
                  </div>
                </article>
              </div>
              
              <div className="swipe-preview swipe-preview-right">
                <article className="testimonials__card glass-panel preview-card">
                  <img src={getNextCard().image} alt={getNextCard().name} loading="lazy" />
                  <div>
                    <p>&ldquo;{getNextCard().quote.substring(0, 60)}...&rdquo;</p>
                    <strong>{getNextCard().name}</strong>
                    <span>{getNextCard().role}</span>
                  </div>
                </article>
              </div>
            </>
          )}
          
          {visibleCards.map((testimonial, idx) => (
            <article
              key={`${testimonial.id}-${activeIndex}`}
              style={{border: '1px solid #f5f5f5'}}
              className={`testimonials__card glass-panel ${
                !isDesktop && idx === 0 ? 'testimonials__card--active' : 
                isDesktop && testimonial.originalIndex === activeIndex ? 'testimonials__card--active' : ''
              } ${isSwiping ? 'card-swiping' : ''}`}
            >
              <img src={testimonial.image} alt={testimonial.name} loading="lazy" />
              <div>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="testimonials__dots" aria-label="Testimonial navigation">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show testimonial from ${testimonial.name}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;