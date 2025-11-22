import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface PreArrivalFiltersProps {
  filters: {
    status: string[];
    destination: string[];
    dateRange: [string, string] | null;
  };
  onChange: (filters: {
    status: string[];
    destination: string[];
    dateRange: [string, string] | null;
  }) => void;
  onReset: () => void;
  onApply: () => void;
}

const PreArrivalFilters: React.FC<PreArrivalFiltersProps> = ({
  filters,
  onChange,
  onReset,
  onApply
}) => {
  const { t } = useTranslation('common');
  const { RangePicker } = DatePicker;

  const statusOptions = [
    { value: 'scheduled', label: t('reception.preArrival.status.scheduled') },
    { value: 'arrived', label: t('reception.preArrival.status.arrived') },
    { value: 'completed', label: t('reception.preArrival.status.completed') },
  ];

  const destinationOptions = [
    { value: 'مطار الملك عبدالعزيز', label: 'مطار الملك عبدالعزيز' },
    { value: 'منفذ البطحاء البري', label: 'منفذ البطحاء البري' },
  ];

  const handleStatusChange = (values: string[]) => {
    onChange({ ...filters, status: values });
  };

  const handleDestinationChange = (values: string[]) => {
    onChange({ ...filters, destination: values });
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onChange({
        ...filters,
        dateRange: [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]
      });
    } else {
      onChange({ ...filters, dateRange: null });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('reception.preArrival.filters.status')}
        </label>
        <div className="space-y-2">
          {statusOptions.map(option => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.status.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleStatusChange([...filters.status, option.value]);
                  } else {
                    handleStatusChange(filters.status.filter(s => s !== option.value));
                  }
                }}
                className="w-4 h-4 text-mainColor border-gray-300 rounded focus:ring-mainColor"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('reception.preArrival.filters.destination')}
        </label>
        <div className="space-y-2">
          {destinationOptions.map(option => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.destination.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleDestinationChange([...filters.destination, option.value]);
                  } else {
                    handleDestinationChange(filters.destination.filter(d => d !== option.value));
                  }
                }}
                className="w-4 h-4 text-mainColor border-gray-300 rounded focus:ring-mainColor"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('reception.preArrival.filters.dateRange')}
        </label>
        <RangePicker
          className="w-full"
          value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
          onChange={handleDateRangeChange}
          format="YYYY-MM-DD"
        />
      </div>

      <div className="col-span-full flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onApply}
          className="px-6 py-2.5 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
        >
          <CheckOutlined />
          {t('reception.preArrival.filters.apply')}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center gap-2"
        >
          <CloseCircleOutlined />
          {t('reception.preArrival.filters.reset')}
        </button>
      </div>
    </div>
  );
};

export default PreArrivalFilters;

