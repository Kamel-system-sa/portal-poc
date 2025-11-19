import React, { useState, useEffect } from 'react';
import { Carousel, Card, Typography, Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined, RocketOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  buttonText?: string;
  buttonAction?: () => void;
}

const HeroSlider: React.FC = () => {
  const { t } = useTranslation('common');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: '1',
      title: t('homepage.heroSlide1Title'),
      subtitle: t('homepage.heroSlide1Subtitle'),
      description: t('homepage.heroSlide1Description'),
      icon: <RocketOutlined />,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      buttonText: t('homepage.getStarted'),
    },
    {
      id: '2',
      title: t('homepage.heroSlide2Title'),
      subtitle: t('homepage.heroSlide2Subtitle'),
      description: t('homepage.heroSlide2Description'),
      icon: <TrophyOutlined />,
      gradient: 'from-green-500 via-teal-500 to-cyan-500',
      buttonText: t('homepage.explore'),
    },
    {
      id: '3',
      title: t('homepage.heroSlide3Title'),
      subtitle: t('homepage.heroSlide3Subtitle'),
      description: t('homepage.heroSlide3Description'),
      icon: <ThunderboltOutlined />,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      buttonText: t('homepage.learnMore'),
    },
  ];

  const carouselRef = React.useRef<any>(null);

  const next = () => {
    carouselRef.current?.next();
  };

  const prev = () => {
    carouselRef.current?.prev();
  };

  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={5000}
        effect="fade"
        dots={{ className: 'custom-dots' }}
        beforeChange={(from, to) => setCurrentSlide(to)}
        className="hero-carousel"
      >
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              className={`relative h-64 md:h-80 lg:h-96 bg-gradient-to-br ${slide.gradient} p-8 md:p-12 flex items-center`}
            >
              <div className="absolute inset-0 bg-black/20" />
              <Row className="relative z-10 w-full" align="middle">
                <Col xs={24} md={16} lg={18}>
                  <div className="animate-fade-in-up">
                    <div className="text-white/90 text-5xl md:text-6xl mb-4 animate-bounce-slow">
                      {slide.icon}
                    </div>
                    <Title
                      level={1}
                      className="!text-white !mb-2 !text-3xl md:!text-4xl lg:!text-5xl font-bold drop-shadow-lg"
                    >
                      {slide.title}
                    </Title>
                    <Text className="text-white/90 text-lg md:text-xl block mb-3 drop-shadow">
                      {slide.subtitle}
                    </Text>
                    <Text className="text-white/80 text-base md:text-lg block mb-6 max-w-2xl drop-shadow">
                      {slide.description}
                    </Text>
                    {slide.buttonText && (
                      <Button
                        type="primary"
                        size="large"
                        className="bg-white text-mainColor hover:bg-gray-100 border-0 font-semibold px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {slide.buttonText}
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Custom Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
        aria-label="Previous slide"
      >
        <LeftOutlined className="text-lg" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
        aria-label="Next slide"
      >
        <RightOutlined className="text-lg" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => carouselRef.current?.goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

