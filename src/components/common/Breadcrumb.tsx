import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';

const Breadcrumb: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { t: tPublicAffairs } = useTranslation('PublicAffairs');
  const { t: tTransport } = useTranslation('Transport');
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
        case 'reception':
          if (index === pathSegments.length - 1) {
            label = t('reception.dashboard.title') || t('reception.title');
          } else {
            label = t('reception.title');
          }
          break;
        case 'pre-arrival':
          if (pathSegments.includes('departures')) {
            label = t('reception.preArrival.departures.title') || t('reception.preArrival.dashboard.title');
          } else {
            label = t('reception.preArrival.list.title') || t('reception.preArrival.dashboard.title');
          }
          break;
        case 'departures':
          if (pathSegments.includes('pre-arrival')) {
            label = t('reception.preArrival.departures.title');
          }
          break;
        case 'ports':
          if (pathSegments[pathSegments.length - 1] === 'airports') {
            label = t('reception.ports.airports.title');
          } else if (pathSegments[pathSegments.length - 1] === 'land') {
            label = t('reception.ports.landPorts.title');
          } else {
            label = t('reception.ports.title');
          }
          break;
        case 'list':
          if (pathSegments.includes('pre-arrival')) {
            label = t('reception.preArrival.list.title');
          }
          break;
        case 'centers-dashboard':
          label = t('reception.centersDashboard.title');
          break;
        case 'airports':
          label = t('reception.ports.airports.title');
          break;
        case 'land':
          label = t('reception.ports.landPorts.title');
          break;
        case 'campaigns':
          if (pathSegments[pathSegments.length - 1] === 'register') {
            label = t('reception.campaigns.registration.title');
          } else {
            label = t('reception.campaigns.title');
          }
          break;
        case 'register':
          if (pathSegments.includes('campaigns')) {
            label = t('reception.campaigns.registration.title');
          }
          break;
        case 'test':
          label = t('testPageTitle');
          break;
        case 'passport':
          label = t('passport.title');
          break;
        case 'box-arrangement':
          label = t('passport.boxArrangement');
          break;
        case 'service-proof':
          label = t('passport.serviceProof');
          break;
        case 'verified-pilgrims':
          label = t('passport.verifiedPilgrims');
          break;
        case 'reports':
          if (pathSegments.includes('passport')) {
            label = t('passport.reports.title');
          } else if (pathSegments.includes('housing')) {
            label = t('housing.reports');
          } else if (pathSegments.includes('hr')) {
            label = t('hr.reports');
          } else if (pathSegments.includes('reception')) {
            label = t('reception.reports');
          } else if (pathSegments.includes('public-affairs')) {
            label = t('publicAffairsReports.title');
          } else if (pathSegments.includes('service-centers')) {
            label = t('serviceCentersReports.title');
          } else if (pathSegments.includes('mashair')) {
            label = t('mashair.reports');
          } else {
            label = t('breadcrumbs.reports') || t('reports.title');
          }
          break;
        case 'organizers':
          label = t('sidebar.organizersControlPanel');
          break;
        case 'public-affairs':
          label = tPublicAffairs('title');
          break;
        case 'deaths':
          if (pathSegments.includes('public-affairs')) {
            label = tPublicAffairs('deaths');
          }
          break;
        case 'hospitalized':
          if (pathSegments.includes('public-affairs')) {
            label = tPublicAffairs('hospitalized');
          }
          break;
        case 'other-incidents':
          if (pathSegments.includes('public-affairs')) {
            label = tPublicAffairs('otherIncidents');
          }
          break;
        case 'finance':
          label = t('finance.title');
          break;
        case 'transport':
          label = tTransport('title');
          break;
        case 'transfer-info':
          if (pathSegments.includes('transport')) {
            label = tTransport('transferInfo');
          }
          break;
        case 'inter-city':
          if (pathSegments.includes('transport')) {
            label = tTransport('interCityTransfers');
          }
          break;
        case 'holy-sites':
          if (pathSegments.includes('transport')) {
            label = tTransport('holySitesTransfers');
          }
          break;
        case 'mashair':
          label = t('mashair.holySitesTitle');
          break;
        case 'employees':
          if (pathSegments.includes('hr')) {
            label = t('hr.employees');
          }
          break;
        case 'attendance':
          if (pathSegments.includes('hr')) {
            label = t('hr.attendance.title');
          }
          break;
        case 'leaves':
          if (pathSegments.includes('hr')) {
            label = t('hr.leaves.title');
          }
          break;
        case 'shift-schedules':
          if (pathSegments.includes('hr')) {
            label = t('hr.shifts.title');
          }
          break;
        default:
          // For dynamic segments like :id, try to get a label or use the segment
          if (segment.match(/^\d+$/)) {
            label = segment; // For IDs, just show the ID
          } else {
            // Try to find a translation key for unknown segments
            const translationKey = `breadcrumbs.${segment}`;
            const translated = t(translationKey);
            if (translated !== translationKey) {
              label = translated;
            } else {
              // Fallback: use translation for common segment or capitalize
              label = t(`breadcrumbs.${segment.replace(/-/g, '')}`) || segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
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

