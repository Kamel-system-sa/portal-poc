import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Card, Button, Tag, Space } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { getBoxesByShelf, getBoxSortMethod, type Box } from '../../data/mockBoxes';
import { mockBoxes } from '../../data/mockBoxes';
import type { MockPassportData } from '../../data/mockPassports';

const { Option } = Select;

interface AssignToBoxPanelProps {
  passport: MockPassportData | null;
  onAssign: (boxId: string) => void;
}

export const AssignToBoxPanel: React.FC<AssignToBoxPanelProps> = ({ passport, onAssign }) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [selectedShelf, setSelectedShelf] = useState<string>('A');
  const [assignedBoxes, setAssignedBoxes] = useState<Set<string>>(new Set());
  
  const boxSortMethod = getBoxSortMethod();

  const boxesForShelf = useMemo(() => {
    const boxes = getBoxesByShelf(selectedShelf, mockBoxes);
    
    // Sort boxes based on the sorting method
    return [...boxes].sort((a, b) => {
      if (boxSortMethod === 'nationality') {
        return (a.nationality || '').localeCompare(b.nationality || '');
      } else if (boxSortMethod === 'organizer') {
        return (a.organizer?.name || '').localeCompare(b.organizer?.name || '');
      } else if (boxSortMethod === 'boxNumber') {
        return a.number.localeCompare(b.number);
      }
      return 0;
    });
  }, [selectedShelf, boxSortMethod]);

  const handleAssign = (boxId: string) => {
    if (!passport) return;
    
    setAssignedBoxes(prev => new Set(prev).add(boxId));
    onAssign(boxId);
  };

  const getBoxLabel = (box: Box): string => {
    if (boxSortMethod === 'nationality' && box.nationality) {
      return t(`nationalities.${box.nationality.toLowerCase()}`) || box.nationality;
    } else if (boxSortMethod === 'organizer' && box.organizer) {
      return `${box.organizer.number} - ${box.organizer.name}`;
    } else if (boxSortMethod === 'boxNumber') {
      return box.number;
    }
    return box.number;
  };

  const getBoxSubLabel = (box: Box): string | null => {
    if (boxSortMethod === 'nationality' && box.organizer) {
      return `${box.organizer.number} - ${box.organizer.name}`;
    } else if (boxSortMethod === 'organizer' && box.nationality) {
      return t(`nationalities.${box.nationality.toLowerCase()}`) || box.nationality;
    }
    return null;
  };

  if (!passport) {
    return null;
  }

  return (
    <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 h-fit sticky top-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md shadow-mainColor/20">
          <InboxOutlined className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{t('passport.assignToBox')}</h3>
      </div>

      <div className="space-y-4">
        {/* Shelf Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('passport.selectShelf')}
          </label>
          <Select
            value={selectedShelf}
            onChange={setSelectedShelf}
            size="large"
            className="w-full"
          >
            <Option value="A">{t('passport.shelfA')}</Option>
            <Option value="B">{t('passport.shelfB')}</Option>
            <Option value="C">{t('passport.shelfC')}</Option>
            <Option value="D">{t('passport.shelfD')}</Option>
            <Option value="1">{t('passport.shelf1')}</Option>
            <Option value="2">{t('passport.shelf2')}</Option>
            <Option value="3">{t('passport.shelf3')}</Option>
            <Option value="4">{t('passport.shelf4')}</Option>
          </Select>
        </div>

        {/* Box List */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('passport.selectBox')}
          </label>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {boxesForShelf.length > 0 ? (
              boxesForShelf.map((box) => {
                const isAssigned = assignedBoxes.has(box.id);
                const isFull = box.passportCount >= box.maxCapacity;
                
                return (
                  <Card
                    key={box.id}
                    className={`border-2 transition-all duration-200 ${
                      isAssigned
                        ? 'border-green-500 bg-green-50'
                        : isFull
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 hover:border-mainColor/50 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{getBoxLabel(box)}</span>
                            {isAssigned && (
                              <Tag color="green" className="text-xs">
                                {t('passport.assigned')}
                              </Tag>
                            )}
                            {isFull && !isAssigned && (
                              <Tag color="red" className="text-xs">
                                {t('passport.full')}
                              </Tag>
                            )}
                          </div>
                          {getBoxSubLabel(box) && (
                            <p className="text-xs text-gray-500">{getBoxSubLabel(box)}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {t('passport.boxContentCount')
                              .replace('{{count}}', box.passportCount.toString())
                              .replace('{{max}}', box.maxCapacity.toString())}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        type={isAssigned ? 'default' : 'primary'}
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAssign(box.id)}
                        disabled={isFull && !isAssigned}
                        className={`w-full ${
                          isAssigned
                            ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                            : ''
                        }`}
                      >
                        {isAssigned
                          ? t('passport.assignedToBox')
                          : t('passport.addToBox')}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <InboxOutlined className="text-3xl mb-2 opacity-50" />
                <p className="text-sm">{t('passport.noBoxesOnShelf')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

