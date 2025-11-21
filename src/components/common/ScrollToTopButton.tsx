import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300);
    };

    // Check for 3D viewer - look for elements with fixed positioning and high z-index
    const check3DViewer = () => {
      // Check for 3D viewer modal (has fixed inset-0 and z-50)
      const viewer = document.querySelector('.fixed.inset-0.z-50');
      const hasFullscreenModal = viewer && viewer.classList.contains('fixed') && 
                                  viewer.classList.contains('inset-0') && 
                                  viewer.classList.contains('z-50');
      setIs3DViewerOpen(!!hasFullscreenModal);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check for 3D viewer on DOM changes
    const observer = new MutationObserver(() => {
      check3DViewer();
    });
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Initial checks
    check3DViewer();
    handleScroll();

    // Periodic check for 3D viewer (fallback)
    const intervalId = setInterval(check3DViewer, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't show if 3D viewer is open or not scrolled enough
  if (is3DViewerOpen || !isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label={t('scrollToTop')}
      className={`
        fixed bottom-6 z-40
        w-12 h-12
        ${isRtl ? 'left-6' : 'right-6'}
        bg-primaryColor hover:bg-primaryColor/90 active:bg-primaryColor/80
        text-white
        rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2
        touch-manipulation
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
      `}
    >
      <ChevronUp size={24} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;

