import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { Tag, Select } from 'antd';
import { ArrowLeftOutlined, EditOutlined, HomeOutlined, ApartmentOutlined } from '@ant-design/icons';
import { mockPilgrims, mockHotels, mockBuildings } from '../../data/mockHousing';

const { Option } = Select;

const PilgrimDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [isReassigning, setIsReassigning] = useState(false);

  const pilgrim = mockPilgrims.find(p => p.id === id);

  if (!pilgrim) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 text-center">
            <p className="text-customgray text-lg">
              {t('housing.pilgrimNotFound')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/housing/pilgrims')}
              className="mt-4 px-4 py-2 border-2 border-bordergray text-gray-700 rounded-lg hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5 transition-all duration-200 font-medium"
            >
              {t('housing.backToList')}
            </button>
          </GlassCard>
        </div>
      </div>
    );
  }

  const getAssignmentDetails = () => {
    if (pilgrim.assignedRoom) {
      if (pilgrim.assignedRoom.type === 'hotel') {
        const hotel = mockHotels.find(h => h.id === pilgrim.assignedRoom?.hotelId);
        return {
          type: 'room',
          location: hotel?.name || t('housing.unknownHotel'),
          roomNumber: pilgrim.assignedRoom.roomNumber,
          bedId: pilgrim.assignedRoom.bedId,
          icon: <HomeOutlined />,
          color: 'mainColor'
        };
      } else {
        const building = mockBuildings.find(b => b.id === pilgrim.assignedRoom?.buildingId);
        return {
          type: 'room',
          location: building?.name || t('housing.unknownBuilding'),
          roomNumber: pilgrim.assignedRoom.roomNumber,
          bedId: pilgrim.assignedRoom.bedId,
          icon: <HomeOutlined />,
          color: 'primaryColor'
        };
      }
    }
    if (pilgrim.assignedTent) {
      return {
        type: 'tent',
        location: pilgrim.assignedTent.location === 'mina' ? t('housing.mina') : t('housing.arafat'),
        tentNumber: pilgrim.assignedTent.tentNumber,
        bedId: pilgrim.assignedTent.bedId,
        icon: <ApartmentOutlined />,
        color: 'secondaryColor'
      };
    }
    return null;
  };

  const assignment = getAssignmentDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/housing/pilgrims')}
          className="mb-6 px-4 py-2 border-2 border-bordergray text-gray-700 rounded-lg hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5 transition-all duration-200 font-medium flex items-center gap-2"
        >
          <ArrowLeftOutlined />
          {t('housing.backToList')}
        </button>

        {/* Pilgrim Profile Card */}
        <GlassCard className="p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className={`
              w-20 h-20 rounded-2xl 
              bg-gradient-to-br from-primaryColor to-secondaryColor
              flex items-center justify-center
              shadow-lg
            `}>
              <span className="text-white text-3xl font-bold">
                {pilgrim.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{pilgrim.name}</h1>
              <div className="flex flex-wrap gap-4 mt-4">
                <Tag className={`text-sm px-3 py-1 ${pilgrim.gender === 'male' ? 'bg-primaryColor/10 text-primaryColor border-primaryColor/30' : 'bg-pink-100 text-pink-600 border-pink-300'}`}>
                  {pilgrim.gender === 'male' ? t('housing.male') : t('housing.female')}
                </Tag>
                <Tag className="text-sm px-3 py-1">
                  {t(`nationalities.${pilgrim.nationality.toLowerCase()}`) || pilgrim.nationality}
                </Tag>
                <Tag className="text-sm px-3 py-1">
                  {pilgrim.age} {t('labels.age') || 'years old'}
                </Tag>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Personal Information */}
        <GlassCard className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('housing.personalInformation')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-customgray">{t('labels.hawiya') || 'ID'}:</span>
              <p className="font-semibold text-gray-800">{pilgrim.hawiya || t('housing.notAvailable')}</p>
            </div>
            <div>
              <span className="text-sm text-customgray">{t('labels.mobile') || 'Phone'}:</span>
              <p className="font-semibold text-gray-800">{pilgrim.phone || t('housing.notAvailable')}</p>
            </div>
            <div>
              <span className="text-sm text-customgray">{t('labels.email') || 'Email'}:</span>
              <p className="font-semibold text-gray-800">{pilgrim.email || t('housing.notAvailable')}</p>
            </div>
            <div>
              <span className="text-sm text-customgray">{t('serviceCentersTitle') || 'Service Center'}:</span>
              <p className="font-semibold text-gray-800">{pilgrim.serviceCenter || t('housing.notAvailable')}</p>
            </div>
            <div>
              <span className="text-sm text-customgray">{t('housing.organizer')}:</span>
              <p className="font-semibold text-gray-800">{pilgrim.organizer || t('housing.notAvailable')}</p>
            </div>
            <div>
              <span className="text-sm text-customgray">{t('housing.group')}:</span>
              <p className="font-semibold text-gray-800">{pilgrim.group || t('housing.notAvailable')}</p>
            </div>
          </div>
        </GlassCard>

        {/* Assignment Information */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('housing.assignmentInformation')}
            </h2>
            <button
              type="button"
              onClick={() => setIsReassigning(!isReassigning)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                isReassigning 
                  ? 'border-2 border-bordergray text-gray-700 hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5' 
                  : 'bg-gradient-to-r from-primaryColor to-secondaryColor text-white hover:from-primaryColor/90 hover:to-secondaryColor/90 border-0 shadow-md hover:shadow-lg'
              }`}
            >
              <EditOutlined />
              {isReassigning ? t('housing.cancel') : t('housing.reassign')}
            </button>
          </div>

          {assignment ? (
            <div className={`
              p-6 rounded-xl border-2
              ${assignment.color === 'mainColor' ? 'border-mainColor/30 bg-mainColor/5' : ''}
              ${assignment.color === 'primaryColor' ? 'border-primaryColor/30 bg-primaryColor/5' : ''}
              ${assignment.color === 'secondaryColor' ? 'border-secondaryColor/30 bg-secondaryColor/5' : ''}
            `}>
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl
                  ${assignment.color === 'mainColor' ? 'bg-mainColor' : ''}
                  ${assignment.color === 'primaryColor' ? 'bg-primaryColor' : ''}
                  ${assignment.color === 'secondaryColor' ? 'bg-secondaryColor' : ''}
                  flex items-center justify-center
                  text-white text-xl
                `}>
                  {assignment.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {assignment.type === 'room' 
                      ? `${t('housing.room')} ${assignment.roomNumber}`
                      : `${t('housing.tent')} ${assignment.tentNumber}`
                    }
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-customgray">
                      <span className="font-medium">{t('housing.location')}:</span> {assignment.location}
                    </p>
                    <p className="text-customgray">
                      <span className="font-medium">{t('housing.bedId')}:</span> {assignment.bedId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border-2 border-bordergray bg-gray-100 text-center">
              <p className="text-customgray">
                {t('housing.notAssigned')}
              </p>
            </div>
          )}

          {isReassigning && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-bordergray">
              <p className="text-sm text-customgray mb-4">
                {t('housing.reassignNote')}
              </p>
              <Select
                placeholder={t('housing.selectNewAssignment')}
                className="w-full"
                size="large"
                disabled
              >
                <Option value="placeholder">{t('housing.comingSoon')}</Option>
              </Select>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default PilgrimDetailsPage;

