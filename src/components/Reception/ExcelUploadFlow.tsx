import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadOutlined, FileExcelOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import type { ArrivalGroup } from '../../types/reception';
import { mockAccommodations } from '../../data/mockReception';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents } from '../../data/mockHousing';

// Interface for raw Excel row data (can have various column names)
interface ExcelRowData {
  [key: string]: any;
  // Possible column names for accommodations
  accommodationName?: string;
  accommodation_name?: string;
  accommodation?: string;
  hotel?: string;
  building?: string;
  tent?: string;
  // Possible column names for pilgrims per accommodation
  accommodationPilgrims?: number | string;
  accommodation_pilgrims?: number | string;
  pilgrims?: number | string;
  pilgrimsPerAccommodation?: number | string;
  // Contract number
  contractNumber?: string;
  contract_number?: string;
  contract?: string;
}

// Helper function to parse Excel data and extract accommodations
const parseExcelAccommodations = (rawData: ExcelRowData | ExcelRowData[]): Array<{
  accommodationId: string;
  accommodationName: string;
  pilgrimsAssigned: number;
  contractNumber?: string;
}> => {
  const accommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    pilgrimsAssigned: number;
    contractNumber?: string;
  }> = [];

  // Combine all available accommodations from different sources
  const allAccommodations = [
    ...mockAccommodations,
    ...mockHotels.map(h => ({ id: h.id, name: h.name, type: h.location })),
    ...mockBuildings.map(b => ({ id: b.id, name: b.name, type: b.location })),
    ...mockMinaTents.map(t => ({ id: t.id, name: `Mina Tent ${t.tentNumber}`, type: 'mina' })),
    ...mockArafatTents.map(t => ({ id: t.id, name: `Arafat Tent ${t.tentNumber}`, type: 'arafat' }))
  ];

  // Helper function to find accommodation by name (case-insensitive, partial match)
  const findAccommodationByName = (name: string): { id: string; name: string } | null => {
    if (!name) return null;
    const normalizedName = name.toString().toLowerCase().trim();
    
    // Try exact match first
    const exactMatch = allAccommodations.find(acc => 
      acc.name.toLowerCase().trim() === normalizedName
    );
    if (exactMatch) {
      return { id: exactMatch.id, name: exactMatch.name };
    }

    // Try partial match
    const partialMatch = allAccommodations.find(acc => 
      acc.name.toLowerCase().includes(normalizedName) || 
      normalizedName.includes(acc.name.toLowerCase())
    );
    if (partialMatch) {
      return { id: partialMatch.id, name: partialMatch.name };
    }

    return null;
  };

  // Helper function to extract number from string
  const extractNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Handle single row data
  if (!Array.isArray(rawData)) {
    rawData = [rawData];
  }

  // Process each row
  for (const row of rawData) {
    // Check for accommodation name in various possible column names
    const accommodationName =
      row.accommodationName ||
      row.accommodation_name ||
      row.accommodation ||
      row.hotel ||
      row.building ||
      row.tent ||
      null;

    if (accommodationName) {
      const foundAcc = findAccommodationByName(accommodationName);
      
      if (foundAcc) {
        // Get pilgrims count for this accommodation
        const pilgrimsAssigned =
          extractNumber(
            row.accommodationPilgrims ||
            row.accommodation_pilgrims ||
            row.pilgrims ||
            row.pilgrimsPerAccommodation ||
            0
          );

        // Get contract number if available
        const contractNumber =
          row.contractNumber ||
          row.contract_number ||
          row.contract ||
          undefined;

        // Only add if we have a valid accommodation and pilgrims count
        if (pilgrimsAssigned > 0) {
          accommodations.push({
            accommodationId: foundAcc.id,
            accommodationName: foundAcc.name,
            pilgrimsAssigned,
            contractNumber
          });
        }
      }
    }

    // Also check for multiple accommodations in a single row (comma-separated or pipe-separated)
    // Format: "Hotel A: 100, Hotel B: 50" or "Hotel A|100,Hotel B|50"
    const multipleAccommodations = 
      row.accommodations ||
      row.accommodation_list ||
      row.hotels ||
      null;

    if (multipleAccommodations && typeof multipleAccommodations === 'string') {
      // Try to parse comma or pipe-separated list
      const parts = multipleAccommodations.split(/[,|;]/).map(p => p.trim());
      
      for (const part of parts) {
        // Try format "Name: Count" or "Name|Count"
        const match = part.match(/(.+?)[:|\|](.+)/);
        if (match) {
          const name = match[1].trim();
          const count = extractNumber(match[2].trim());
          const foundAcc = findAccommodationByName(name);
          
          if (foundAcc && count > 0) {
            accommodations.push({
              accommodationId: foundAcc.id,
              accommodationName: foundAcc.name,
              pilgrimsAssigned: count
            });
          }
        } else {
          // Just accommodation name, try to find it
          const foundAcc = findAccommodationByName(part);
          if (foundAcc) {
            // Use default pilgrims count if not specified
            const count = extractNumber(row.pilgrims || row.pilgrimsCount || 0);
            if (count > 0) {
              accommodations.push({
                accommodationId: foundAcc.id,
                accommodationName: foundAcc.name,
                pilgrimsAssigned: count
              });
            }
          }
        }
      }
    }
  }

  return accommodations;
};

interface ExcelUploadFlowProps {
  onUploadComplete: (data: Partial<ArrivalGroup>) => void;
  onClose: () => void;
}

export const ExcelUploadFlow: React.FC<ExcelUploadFlowProps> = ({ onUploadComplete, onClose }) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProcessing(true);

    // Simulate file processing (in real app, this would use a library like xlsx to parse Excel file)
    setTimeout(() => {
      // Mock parsed data from Excel - simulate what would come from reading the Excel file
      // In a real implementation, you would use a library like 'xlsx' to read the file
      
      // Example: Simulate Excel data with accommodation information
      // The Excel file might have columns like:
      // groupNumber | groupName | arrivalDate | flightNumber | pilgrimsCount | accommodationName | accommodationPilgrims | contractNumber
      const mockExcelRows: ExcelRowData[] = [
        {
          groupNumber: 'GRP-NEW',
          groupName: 'New Group from Excel',
          arrivalDate: new Date().toISOString().split('T')[0],
          arrivalTime: '14:30',
          flightNumber: 'SV-9999',
          pilgrimsCount: 200,
          destination: 'makkah',
          // Accommodation data in various possible formats:
          accommodationName: 'Grand Makkah Hotel',
          accommodationPilgrims: 120,
          contractNumber: 'CNT-2024-001'
        },
        // Additional accommodation rows (if accommodations are in separate rows)
        {
          accommodationName: 'Al-Safa Towers',
          accommodationPilgrims: 80,
          contractNumber: 'CNT-2024-002'
        }
      ];

      // Extract main group data from first row
      const mainRow = mockExcelRows[0];
      
      // Parse accommodations from all rows (this extracts accommodation data automatically)
      const parsedAccommodations = parseExcelAccommodations(mockExcelRows);
      
      // If no accommodations were parsed from rows, try to find them in the main row
      // This handles cases where accommodation data is in the same row as group data
      let accommodations = parsedAccommodations;
      
      if (accommodations.length === 0) {
        // Try alternative column names or formats in the main row
        // Check if there's accommodation info embedded in the row
        const alternativeAccommodations = parseExcelAccommodations([mainRow]);
        if (alternativeAccommodations.length > 0) {
          accommodations = alternativeAccommodations;
        }
      }
      
      // If still no accommodations, try to infer from total pilgrims count
      // Split pilgrims among available accommodations (for demo purposes)
      if (accommodations.length === 0 && mainRow.pilgrimsCount) {
        const totalPilgrims = typeof mainRow.pilgrimsCount === 'number' 
          ? mainRow.pilgrimsCount 
          : parseInt(mainRow.pilgrimsCount?.toString() || '0', 10);
        
        // Try to match destination with available accommodations
        const destination = (mainRow.destination || 'makkah') as 'makkah' | 'madinah' | 'mina' | 'arafat';
        
        // Find accommodations that match the destination
        const matchingAccommodations = mockAccommodations.filter(acc => {
          if (destination === 'makkah') {
            return acc.location.toLowerCase().includes('makkah') || acc.location.toLowerCase().includes('mecca');
          } else if (destination === 'madinah') {
            return acc.location.toLowerCase().includes('madinah') || acc.location.toLowerCase().includes('medina');
          } else if (destination === 'mina') {
            return acc.location.toLowerCase().includes('mina');
          } else if (destination === 'arafat') {
            return acc.location.toLowerCase().includes('arafat');
          }
          return true;
        });
        
        // If found matching accommodations, distribute pilgrims
        if (matchingAccommodations.length > 0 && totalPilgrims > 0) {
          const pilgrimsPerAcc = Math.floor(totalPilgrims / matchingAccommodations.length);
          const remainder = totalPilgrims % matchingAccommodations.length;
          
          accommodations = matchingAccommodations.map((acc, index) => ({
            accommodationId: acc.id,
            accommodationName: acc.name,
            pilgrimsAssigned: pilgrimsPerAcc + (index === 0 ? remainder : 0)
          }));
        }
      }
      
      const parsedData: Partial<ArrivalGroup> = {
        groupNumber: mainRow.groupNumber || 'GRP-NEW',
        groupName: mainRow.groupName || 'New Group from Excel',
        arrivalDate: mainRow.arrivalDate || new Date().toISOString().split('T')[0],
        arrivalTime: mainRow.arrivalTime || '14:30',
        flightNumber: mainRow.flightNumber || mainRow.flight || undefined,
        tripNumber: mainRow.tripNumber || mainRow.trip || undefined,
        pilgrimsCount: typeof mainRow.pilgrimsCount === 'number' 
          ? mainRow.pilgrimsCount 
          : parseInt(mainRow.pilgrimsCount?.toString() || '0', 10) || 200,
        destination: (mainRow.destination || 'makkah') as 'makkah' | 'madinah' | 'mina' | 'arafat',
        accommodations: accommodations
      };

      setUploading(false);
      setProcessing(false);
      onUploadComplete(parsedData);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mainColor to-primary flex items-center justify-center">
              <FileExcelOutlined className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('reception.preArrival.excelUpload.title')}</h2>
              <p className="text-sm text-gray-500">{t('reception.preArrival.excelUpload.description')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!file && !processing && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-mainColor transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileExcelOutlined className="text-6xl text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.excelUpload.dragDrop')}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {t('reception.preArrival.excelUpload.supportedFormats')}
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center gap-2 mx-auto">
                <UploadOutlined />
                {t('reception.preArrival.excelUpload.selectFile')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {file && !processing && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircleOutlined className="text-green-600 text-xl" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">{file.name}</p>
                  <p className="text-sm text-green-700">
                    {(file.size / 1024).toFixed(2)} KB • {t('reception.preArrival.excelUpload.fileSelected')}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseOutlined />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      {t('reception.preArrival.excelUpload.uploading')}
                    </>
                  ) : (
                    <>
                      <UploadOutlined />
                      {t('reception.preArrival.excelUpload.validate')}
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
                >
                  {t('form.cancel')}
                </button>
              </div>
            </div>
          )}

          {processing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl text-mainColor mb-4">⏳</div>
              <p className="text-lg font-semibold text-gray-700">
                {t('reception.preArrival.excelUpload.processing')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('reception.preArrival.excelUpload.validating')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

