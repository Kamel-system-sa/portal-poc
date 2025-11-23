import React, { useRef } from 'react';
import { Carousel, Card, Typography, Button } from 'antd';
import { LeftOutlined, RightOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: ReactNode;
  tag?: {
    text: string;
    color: string;
  };
  action?: () => void;
}

export interface ContentCarouselProps {
  title: string;
  items: CarouselItem[];
  itemsPerSlide?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showNavigation?: boolean;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  title,
  items,
  itemsPerSlide = { xs: 1, sm: 2, md: 3, lg: 4 },
  showNavigation = true,
}) => {
  const { t } = useTranslation('common');
  const carouselRef = useRef<any>(null);

  const next = () => {
    carouselRef.current?.next();
  };

  const prev = () => {
    carouselRef.current?.prev();
  };

  const getSlidesToShow = () => {
    return {
      xs: itemsPerSlide.xs || 1,
      sm: itemsPerSlide.sm || 2,
      md: itemsPerSlide.md || 3,
      lg: itemsPerSlide.lg || 4,
      xl: itemsPerSlide.xl || itemsPerSlide.lg || 4,
    };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <Title level={3} className="!mb-0 !text-gray-800">
          {title}
        </Title>
        {showNavigation && items.length > (itemsPerSlide.md || 3) && (
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              aria-label={t('ariaLabels.previous')}
            >
              <LeftOutlined />
            </button>
            <button
              onClick={next}
              className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              aria-label={t('ariaLabels.next')}
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>

      <Carousel
        ref={carouselRef}
        dots={false}
        infinite
        slidesToShow={getSlidesToShow().lg}
        slidesToScroll={1}
        responsive={[
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: getSlidesToShow().md,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: getSlidesToShow().sm,
            },
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: getSlidesToShow().xs,
            },
          },
        ]}
        className="content-carousel"
      >
        {items.map((item) => (
          <div key={item.id} className="px-2">
            <Card
              hoverable
              className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              styles={{ body: { padding: '20px' } }}
              onClick={item.action}
            >
              {item.image && (
                <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              {item.icon && (
                <div className="mb-4 text-4xl text-mainColor group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
              )}
              <div className="flex items-start justify-between gap-2 mb-2">
                <Title level={5} className="!mb-0 !text-gray-800 group-hover:text-mainColor transition-colors">
                  {item.title}
                </Title>
                {item.tag && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap`}
                    style={{
                      backgroundColor: item.tag.color === 'success' ? '#DCFCE7' : 
                                     item.tag.color === 'warning' ? '#FEF3C7' :
                                     item.tag.color === 'info' ? '#DBEAFE' : '#F3F4F6',
                      color: item.tag.color === 'success' ? '#16A34A' :
                            item.tag.color === 'warning' ? '#D97706' :
                            item.tag.color === 'info' ? '#2563EB' : '#6B7280',
                    }}
                  >
                    {item.tag.text}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <Text className="text-gray-600 text-sm block mb-2">{item.subtitle}</Text>
              )}
              {item.description && (
                <Text className="text-gray-500 text-xs block mb-4 line-clamp-2">
                  {item.description}
                </Text>
              )}
              {item.action && (
                <Button
                  type="link"
                  className="p-0 text-mainColor hover:text-primaryColor font-medium group-hover:translate-x-1 transition-transform duration-300"
                  icon={<RightCircleOutlined />}
                  iconPosition="end"
                >
                  View Details
                </Button>
              )}
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ContentCarousel;

