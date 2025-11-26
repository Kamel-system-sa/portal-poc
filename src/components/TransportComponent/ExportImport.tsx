import React, { useState } from 'react';
import { Modal, Button, Upload, message, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { ImportOutlined, FileExcelOutlined, FileTextOutlined, MoreOutlined } from '@ant-design/icons';
import type { Bus } from '../../types/transport';
import { mockTransportData } from '../../data/mockTransport';

interface ExportImportProps {
  onDataImported?: (buses: Bus[]) => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ onDataImported }) => {
  const { t } = useTranslation('Transport');
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Export functions
  const exportToCSV = () => {
    try {
      const headers = [
        'ID', 'Route', 'Departure Time', 'Expected Arrival', 'Transport Company',
        'License Plate', 'Bus Number', 'Bus ID', 'Driver 1 Name', 'Driver 1 Phone',
        'Driver 2 Name', 'Driver 2 Phone', 'Capacity', 'Passenger Count', 'Status'
      ];

      const rows = mockTransportData.map(bus => [
        bus.id,
        bus.route,
        bus.departureTime,
        bus.expectedArrival,
        bus.transportCompany,
        bus.licensePlate,
        bus.busNumber,
        bus.busId,
        bus.driver1Name,
        bus.driver1Phone,
        bus.driver2Name,
        bus.driver2Phone,
        bus.capacity,
        bus.passengers.length,
        bus.status
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transport_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(t('exportData') + ' (CSV)');
    } catch (error) {
      message.error(t('error'));
      console.error('Export error:', error);
    }
  };

  const exportToJSON = () => {
    try {
      const jsonContent = JSON.stringify(mockTransportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transport_data_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(t('exportData') + ' (JSON)');
    } catch (error) {
      message.error(t('error'));
      console.error('Export error:', error);
    }
  };

  // Import functions
  const handleFileImport = (file: File, type: 'csv' | 'json') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (type === 'json') {
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            // TODO: Validate data structure
            // TODO: Replace with backend API call
            if (onDataImported) {
              onDataImported(data);
            }
            message.success(t('fileUploaded'));
            setImportModalOpen(false);
          } else {
            message.error(t('invalidFile'));
          }
        } else {
          // CSV parsing would go here
          // TODO: Implement CSV parsing
          message.error(t('csvImportNotImplemented'));
        }
      } catch (error) {
        message.error(t('importError'));
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    return false; // Prevent default upload
  };

  const actionsMenuItems: MenuProps['items'] = [
    {
      key: 'export-csv',
      label: t('exportCSV'),
      icon: <FileExcelOutlined />,
      onClick: exportToCSV
    },
    {
      key: 'export-json',
      label: t('exportJSON'),
      icon: <FileTextOutlined />,
      onClick: exportToJSON
    },
    {
      type: 'divider'
    },
    {
      key: 'import-csv',
      label: t('importCSV'),
      icon: <FileExcelOutlined />,
      onClick: () => {
        // TODO: Implement CSV import
        message.info(t('csvImportNotImplemented'));
      }
    },
    {
      key: 'import-json',
      label: t('importJSON'),
      icon: <FileTextOutlined />,
      onClick: () => setImportModalOpen(true)
    }
  ];

  return (
    <>
      <Dropdown menu={{ items: actionsMenuItems }} trigger={['click']}>
        <Button
          className="px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-primaryColor transition-all duration-200 flex items-center gap-2 font-medium text-xs sm:text-sm"
        >
          <MoreOutlined />
          <span>{t('actions')}</span>
        </Button>
      </Dropdown>

      <Modal
        title={t('importData')}
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={null}
        aria-label={t('importData')}
      >
        <Upload
          accept=".json"
          beforeUpload={(file) => {
            handleFileImport(file, 'json');
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<ImportOutlined />} block>
            {t('selectFile')} (JSON)
          </Button>
        </Upload>
        <p className="text-sm text-customgray mt-4">
          {t('importJSON')}: {t('selectFile')}
        </p>
      </Modal>
    </>
  );
};

