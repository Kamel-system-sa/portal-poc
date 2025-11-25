import React from 'react';
import type { NationalityStatisticsData } from '../../data/mockReception';

interface NationalityStatisticsProps {
  data: NationalityStatisticsData[];
  title?: string;
}

const NationalityStatistics: React.FC<NationalityStatisticsProps> = ({ 
  data, 
  title = 'الوصول والمغادرة حسب الجنسيات' 
}) => {
  // Calculate total for percentage calculation
  const totalArrivals = data.reduce((sum, item) => sum + item.arrivals, 0);
  const totalDepartures = data.reduce((sum, item) => sum + item.departures, 0);

  // Generate circular chart with two halves
  const generateChart = (nationality: NationalityStatisticsData, index: number) => {
    // النسبة بناءً على الوصول من إجمالي الوصول
    const arrivalPercentage = totalArrivals > 0 ? (nationality.arrivals / totalArrivals) * 100 : 0;
    // النسبة بناءً على المغادرة من إجمالي المغادرة
    const departurePercentage = totalDepartures > 0 ? (nationality.departures / totalDepartures) * 100 : 0;
    
    // لون ثابت للوصول - متناسق مع الموقع (تيل فاتح)
    const arrivalColor = '#00A896'; // secondaryColor - Teal
    // لون ثابت للمغادرة - متناسق مع الموقع (تيل داكن)
    const departureColor = '#00796B'; // primary - Dark Teal
    
    const totalForNationality = nationality.arrivals + nationality.departures;
    
    const radius = 50;
    const centerX = 60;
    const centerY = 60;
    const circumference = 2 * Math.PI * radius;
    const halfCircumference = circumference / 2;
    
    // للوصول: النصف الأول من الدائرة (0° إلى 180°)
    const arrivalDashoffset = halfCircumference - (arrivalPercentage / 100) * halfCircumference;
    
    // للمغادرة: النصف الثاني من الدائرة (180° إلى 360°)
    const departureDashoffset = halfCircumference - (departurePercentage / 100) * halfCircumference;

    return (
      <div key={nationality.id} className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="relative mb-3">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            {/* النصف الأول: الوصول (من 0° إلى 180°) - لون أزرق */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={arrivalColor}
              strokeWidth="10"
              strokeDasharray={halfCircumference}
              strokeDashoffset={arrivalDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* النصف الثاني: المغادرة (من 180° إلى 360°) - لون أخضر */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={departureColor}
              strokeWidth="10"
              strokeDasharray={halfCircumference}
              strokeDashoffset={departureDashoffset + halfCircumference}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          {/* Center content - فقط العلم */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl">{nationality.flag}</div>
          </div>
        </div>
        <div className="text-center w-full">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {nationality.nameAr}
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center justify-between gap-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 91, 79, 0.1)' }}>
              <span className="font-semibold">الإجمالي:</span>
              <span className="font-bold" style={{ color: '#005B4F' }}>{totalForNationality.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}>
              <span>الوصول:</span>
              <span className="font-bold" style={{ color: '#00A896' }}>{nationality.arrivals.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 121, 107, 0.1)' }}>
              <span>المغادرة:</span>
              <span className="font-bold" style={{ color: '#00796B' }}>{nationality.departures.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>إجمالي الوصول: <span className="font-bold text-gray-900">{totalArrivals.toLocaleString()}</span></span>
          <span>إجمالي المغادرة: <span className="font-bold text-gray-900">{totalDepartures.toLocaleString()}</span></span>
        </div>
      </div>

      {/* Color Legend - مفتاح الألوان */}
      <div className="mb-6 flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#00A896' }}></div>
          <span className="text-sm font-semibold text-gray-700">الوصول</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#00796B' }}></div>
          <span className="text-sm font-semibold text-gray-700">المغادرة</span>
        </div>
      </div>

      {/* Combined View - Shows both arrivals and departures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((nationality, index) => generateChart(nationality, index))}
      </div>
    </div>
  );
};

export default NationalityStatistics;

