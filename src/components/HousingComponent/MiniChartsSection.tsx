import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { GlassCard } from './GlassCard';
import { GlobalOutlined, ManOutlined, WomanOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { mockPilgrims } from '../../data/mockHousing';

interface MiniChartsSectionProps {
  type: 'hotel' | 'building' | 'mina' | 'arafat';
  roomsOrTents?: any[];
}

export const MiniChartsSection: React.FC<MiniChartsSectionProps> = ({ type, roomsOrTents = [] }) => {
  const { t } = useTranslation('common');

  // Get pilgrims assigned to this type from beds
  const assignedPilgrims = useMemo(() => {
    const pilgrims: any[] = [];
    
    // Extract pilgrims from beds in rooms/tents
    roomsOrTents.forEach((roomOrTent: any) => {
      if (roomOrTent.beds && Array.isArray(roomOrTent.beds)) {
        roomOrTent.beds.forEach((bed: any) => {
          if (bed.occupied && bed.pilgrimId) {
            // Try to find pilgrim in mockPilgrims first
            const pilgrim = mockPilgrims.find(p => p.id === bed.pilgrimId);
            if (pilgrim) {
              // Only add if not already added
              if (!pilgrims.find(p => p.id === pilgrim.id)) {
                pilgrims.push(pilgrim);
              }
            } else if (bed.pilgrimName) {
              // If pilgrim not found in mockPilgrims, create a basic pilgrim object from bed data
              const basicPilgrim = {
                id: bed.pilgrimId,
                name: bed.pilgrimName,
                gender: bed.pilgrimGender || 'male',
                age: 30, // Default age if not available
                nationality: 'Unknown',
                phone: '',
                email: '',
                organizer: '',
                group: ''
              };
              if (!pilgrims.find(p => p.id === basicPilgrim.id)) {
                pilgrims.push(basicPilgrim);
              }
            }
          }
        });
      }
    });
    
    return pilgrims;
  }, [type, roomsOrTents]);

  // Nationalities distribution
  const nationalitiesData = useMemo(() => {
    const natCount: Record<string, number> = {};
    assignedPilgrims.forEach(p => {
      const nat = (p.nationality || 'Unknown').toLowerCase();
      // Extract main nationality name without code
      const natKey = nat.split('_')[0] || nat.split('-')[0] || nat;
      natCount[natKey] = (natCount[natKey] || 0) + 1;
    });
    return Object.entries(natCount)
      .map(([key, value]) => {
        // Get nationality title without code - only show the main title
        const translationKey = `nationalities.${key}`;
        const nationalityTitle = t(translationKey);
        // Check if translation exists (not the same as the key)
        const displayName = nationalityTitle && nationalityTitle !== translationKey
          ? nationalityTitle 
          : key === 'unknown' 
            ? t('housing.unknown') || 'Unknown'
            : key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        return {
          name: displayName,
          value
        };
      })
      .slice(0, 5)
      .sort((a, b) => b.value - a.value);
  }, [assignedPilgrims, t]);

  // Gender distribution
  const genderData = useMemo(() => {
    const male = assignedPilgrims.filter(p => (p.gender || 'male') === 'male').length;
    const female = assignedPilgrims.filter(p => (p.gender || 'male') === 'female').length;
    return [
      { name: t('housing.male'), value: male, fill: '#00796B' },
      { name: t('housing.female'), value: female, fill: '#DB2777' }
    ];
  }, [assignedPilgrims, t]);

  // Age groups
  const ageGroupsData = useMemo(() => {
    const groups = {
      '18-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0
    };
    assignedPilgrims.forEach(p => {
      const age = p.age || 30; // Default age if not available
      if (age <= 30) groups['18-30']++;
      else if (age <= 45) groups['31-45']++;
      else if (age <= 60) groups['46-60']++;
      else groups['60+']++;
    });
    return Object.entries(groups).map(([key, value]) => ({ 
      name: t(`housing.ageGroup.${key}`) || key, 
      key,
      value 
    }));
  }, [assignedPilgrims, t]);

  // Pilgrims per organizer
  const organizerData = useMemo(() => {
    const orgCount: Record<string, number> = {};
    assignedPilgrims.forEach(p => {
      const org = p.organizer || t('housing.unknown');
      orgCount[org] = (orgCount[org] || 0) + 1;
    });
    const result = Object.entries(orgCount)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 5)
      .sort((a, b) => b.value - a.value);
    // If no organizers, return empty array or show "Unknown"
    return result.length > 0 ? result : [{ name: t('housing.unknown'), value: assignedPilgrims.length }];
  }, [assignedPilgrims, t]);

  const COLORS = ['#00796B', '#00A896', '#14B8A6', '#F59E0B', '#8B5CF6'];

  // Calculate totals for percentages
  const totalNationalities = nationalitiesData.reduce((sum, item) => sum + item.value, 0);
  const totalGender = genderData.reduce((sum, item) => sum + item.value, 0);
  const totalAgeGroups = ageGroupsData.reduce((sum, item) => sum + item.value, 0);
  const totalOrganizers = organizerData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Nationalities Distribution */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <GlobalOutlined className="text-primaryColor text-lg" />
          <h4 className="text-sm font-bold text-gray-800">{t('housing.nationalitiesDistribution')}</h4>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0" style={{ width: '120px', height: '120px', minWidth: '120px', minHeight: '120px' }}>
            <ResponsiveContainer width={120} height={120} minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={nationalitiesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  dataKey="value"
                >
                  {nationalitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {nationalitiesData.map((entry, index) => {
              const percentage = totalNationalities > 0 ? Math.round((entry.value / totalNationalities) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-700">
                    {entry.name} — {entry.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Gender Distribution */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ManOutlined className="text-primaryColor text-lg" />
          <h4 className="text-sm font-bold text-gray-800">{t('housing.genderDistribution')}</h4>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0" style={{ width: '120px', height: '120px', minWidth: '120px', minHeight: '120px' }}>
            <ResponsiveContainer width={120} height={120} minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {genderData.map((entry, index) => {
              const percentage = totalGender > 0 ? Math.round((entry.value / totalGender) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-gray-700">
                    {entry.name} — {entry.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Age Groups */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarOutlined className="text-primaryColor text-lg" />
          <h4 className="text-sm font-bold text-gray-800">{t('housing.ageGroups')}</h4>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0" style={{ width: '120px', height: '120px', minWidth: '120px', minHeight: '120px' }}>
            <ResponsiveContainer width={120} height={120} minWidth={0} minHeight={0}>
              <BarChart data={ageGroupsData}>
                <Bar dataKey="value" fill="#00796B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {ageGroupsData.map((entry, index) => {
              const percentage = totalAgeGroups > 0 ? Math.round((entry.value / totalAgeGroups) * 100) : 0;
              const displayName = entry.name || entry.key;
              return (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: '#00796B' }}
                  />
                  <span className="text-gray-700">
                    {displayName} — {entry.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Pilgrims per Organizer */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TeamOutlined className="text-primaryColor text-lg" />
          <h4 className="text-sm font-bold text-gray-800">{t('housing.pilgrimsPerOrganizer')}</h4>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0" style={{ width: '120px', height: '120px', minWidth: '120px', minHeight: '120px' }}>
            <ResponsiveContainer width={120} height={120} minWidth={0} minHeight={0}>
              <BarChart data={organizerData}>
                <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {organizerData.map((entry, index) => {
              const percentage = totalOrganizers > 0 ? Math.round((entry.value / totalOrganizers) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: '#F59E0B' }}
                  />
                  <span className="text-gray-700">
                    {entry.name} — {entry.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

