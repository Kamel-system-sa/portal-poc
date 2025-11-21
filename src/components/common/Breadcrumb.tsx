import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';

const Breadcrumb: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{ path: string; label: string; key: string }> = [];

    // Always start with Home
    breadcrumbs.push({
      path: '/',
      label: t('homeTitle'),
      key: 'home'
    });

    // Map path segments to labels
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      let label = '';

      // Map segments to translation keys
      switch (segment) {
        case 'housing':
          // Check if this is the housing dashboard or a sub-page
          if (index === pathSegments.length - 1) {
            label = t('housing.dashboardTitle');
          } else {
            label = t('housingTitle');
          }
          break;
        case 'hotels':
          label = t('housing.hotels');
          break;
        case 'buildings':
          label = t('housing.buildings');
          break;
        case 'mina':
          label = t('housing.mina');
          break;
        case 'arafat':
          label = t('housing.arafat');
          break;
        case 'pilgrims':
          label = t('housing.pilgrimsList');
          break;
        case 'hr':
          label = t('hr.title');
          break;
        case 'service-centers':
          label = t('serviceCentersTitle');
          break;
        case 'test':
          label = t('testPageTitle');
          break;
        default:
          // For dynamic segments like :id, try to get a label or use the segment
          if (segment.match(/^\d+$/)) {
            label = segment; // For IDs, just show the ID
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
      }

      breadcrumbs.push({
        path,
        label,
        key: segment
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const isLast = (index: number) => index === breadcrumbs.length - 1;

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <nav 
      className="mb-2 sm:mb-3 md:mb-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto pb-2 scrollbar-hide"
      aria-label={t('ariaLabels.breadcrumb')}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.key}>
          {index === 0 ? (
            <Link
              to={crumb.path}
              className="flex items-center gap-1 text-customgray hover:text-primaryColor transition-colors duration-200"
            >
              <HomeOutlined className="text-xs" />
              <span>{crumb.label}</span>
            </Link>
          ) : (
            <>
              <RightOutlined 
                className={`text-xs text-customgray ${isRtl ? 'rotate-180' : ''}`}
                style={{ opacity: 0.5 }}
              />
              {isLast(index) ? (
                <span className="text-gray-800 font-medium">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-customgray hover:text-primaryColor transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

