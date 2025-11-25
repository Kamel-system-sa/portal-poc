import React from 'react';
import type { NationalityStatisticsData } from '../../data/mockReception';

interface ArrivalNationalityStatisticsProps {
  data: NationalityStatisticsData[];
  title?: string;
}

const ArrivalNationalityStatistics: React.FC<ArrivalNationalityStatisticsProps> = ({ 
  data, 
  title = 'الوصول حسب الجنسيات' 
}) => {
  // Calculate totals
  const totalArrivals = data.reduce((sum, item) => sum + item.arrivals, 0);
  const totalDepartures = data.reduce((sum, item) => sum + item.departures, 0);
  const grandTotal = totalArrivals + totalDepartures;

  // Generate circular chart showing total pilgrims with arrivals as part of it
  const generateChart = (nationality: NationalityStatisticsData, index: number) => {
    // إجمالي عدد الحجاج للجنسية (الوصول + المغادرة = العدد الكلي)
    const totalPilgrims = nationality.arrivals + nationality.departures;
    
    // النسبة بناءً على الوصول من إجمالي الحجاج
    const arrivalPercentage = totalPilgrims > 0 ? (nationality.arrivals / totalPilgrims) * 100 : 0;
    
    // لون ثابت للوصول - متناسق مع الموقع (تيل فاتح)
    const arrivalColor = '#00A896'; // secondaryColor - Teal
    // لون رمادي للإجمالي (الخلفية)
    const totalColor = '#E5E7EB'; // Gray background
    
    const radius = 50;
    const centerX = 60;
    const centerY = 60;
    const circumference = 2 * Math.PI * radius;
    
    // دائرة كاملة تمثل الإجمالي (الوصول + المغادرة)
    // الوصول جزء منها
    const arrivalDashoffset = circumference - (arrivalPercentage / 100) * circumference;

    return (
      <div key={nationality.id} className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="relative mb-3">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle - يمثل إجمالي عدد الحجاج */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={totalColor}
              strokeWidth="10"
            />
            {/* دائرة الوصول - جزء من إجمالي الحجاج */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={arrivalColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={arrivalDashoffset}
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
            <div className="flex items-center justify-between gap-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)' }}>
              <span className="font-semibold">الإجمالي:</span>
              <span className="font-bold text-gray-700">{totalPilgrims.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}>
              <span>الوصول:</span>
              <span className="font-bold" style={{ color: '#00A896' }}>{nationality.arrivals.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 168, 150, 0.15)' }}>
              <span className="font-semibold">نسبة الوصول:</span>
              <span className="font-bold" style={{ color: '#00A896' }}>{arrivalPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-end mb-6">
        <div className="flex gap-4 text-sm text-gray-600">
          <span>إجمالي الوصول: <span className="font-bold text-gray-900">{totalArrivals.toLocaleString()}</span></span>
          <span>إجمالي الحجاج: <span className="font-bold text-gray-900">{grandTotal.toLocaleString()}</span></span>
        </div>
      </div>

      {/* Color Legend - مفتاح الألوان */}
      <div className="mb-6 flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#00A896' }}></div>
          <span className="text-sm font-semibold text-gray-700">الوصول</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#E5E7EB' }}></div>
          <span className="text-sm font-semibold text-gray-700">إجمالي الحجاج</span>
        </div>
      </div>

      {/* Arrivals View - Shows only arrivals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((nationality, index) => generateChart(nationality, index))}
      </div>
    </div>
  );
};

export default ArrivalNationalityStatistics;

