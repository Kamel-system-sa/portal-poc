import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { 
  DashboardOutlined,
  CheckCircleOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { FaCampground } from 'react-icons/fa';
import { 
  getMinaTents, 
  getMinaAssignments, 
  getArafatTents, 
  getArafatAssignments 
} from '../../data/mashairStorage';

const MashairDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  // Get all data
  const minaTents = getMinaTents();
  const minaAssignments = getMinaAssignments();
  const arafatTents = getArafatTents();
  const arafatAssignments = getArafatAssignments();

  // Calculate Mina stats
  const minaStats = useMemo(() => {
    const totalTents = minaTents.length;
    const assignedTents = minaAssignments.length;
    const totalArea = minaTents.reduce((sum, t) => sum + t.area, 0);
    const totalCapacity = minaTents.reduce((sum, t) => sum + t.capacity, 0);
    const uniqueCampaigns = new Set(
      minaAssignments.map(a => 
        a.campaign === 'campaignNumber' ? a.campaignNumber : 
        a.campaign === 'other' ? a.otherCampaignName : 
        a.campaign
      )
    );
    const campaignsCount = uniqueCampaigns.size;
    
    return { totalTents, assignedTents, totalArea, totalCapacity, campaignsCount };
  }, [minaTents, minaAssignments]);

  // Calculate Arafat stats
  const arafatStats = useMemo(() => {
    const totalTents = arafatTents.length;
    const assignedTents = arafatAssignments.length;
    const totalArea = arafatTents.reduce((sum, t) => sum + t.area, 0);
    const totalCapacity = arafatTents.reduce((sum, t) => sum + t.capacity, 0);
    const uniqueCampaigns = new Set(
      arafatAssignments.map(a => 
        a.campaign === 'campaignNumber' ? a.campaignNumber : 
        a.campaign === 'other' ? a.otherCampaignName : 
        a.campaign
      )
    );
    const campaignsCount = uniqueCampaigns.size;
    
    return { totalTents, assignedTents, totalArea, totalCapacity, campaignsCount };
  }, [arafatTents, arafatAssignments]);

  // Get last entries
  const lastEntries = useMemo(() => {
    const sortedMinaTents = [...minaTents].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const sortedMinaAssignments = [...minaAssignments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const sortedArafatTents = [...arafatTents].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const sortedArafatAssignments = [...arafatAssignments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      minaTents: sortedMinaTents.slice(0, 5),
      minaAssignments: sortedMinaAssignments.slice(0, 5),
      arafatTents: sortedArafatTents.slice(0, 5),
      arafatAssignments: sortedArafatAssignments.slice(0, 5),
    };
  }, [minaTents, minaAssignments, arafatTents, arafatAssignments]);

  // Calculate campaign statistics
  const campaignStats = useMemo(() => {
    // Helper function to get campaign identifier
    const getCampaignId = (assignment: typeof minaAssignments[0]) => {
      if (assignment.campaign === 'campaignNumber' && assignment.campaignNumber) {
        return assignment.campaignNumber;
      }
      if (assignment.campaign === 'other' && assignment.otherCampaignName) {
        return assignment.otherCampaignName;
      }
      return assignment.campaign; // 'office' or 'kitchen'
    };

    // Group assignments by campaign
    const campaignMap = new Map<string, {
      campaignId: string;
      minaAssignments: typeof minaAssignments;
      arafatAssignments: typeof arafatAssignments;
    }>();

    // Process Mina assignments
    minaAssignments.forEach(assignment => {
      const campaignId = getCampaignId(assignment);
      if (!campaignMap.has(campaignId)) {
        campaignMap.set(campaignId, {
          campaignId,
          minaAssignments: [],
          arafatAssignments: [],
        });
      }
      campaignMap.get(campaignId)!.minaAssignments.push(assignment);
    });

    // Process Arafat assignments
    arafatAssignments.forEach(assignment => {
      const campaignId = getCampaignId(assignment);
      if (!campaignMap.has(campaignId)) {
        campaignMap.set(campaignId, {
          campaignId,
          minaAssignments: [],
          arafatAssignments: [],
        });
      }
      campaignMap.get(campaignId)!.arafatAssignments.push(assignment);
    });

    // Calculate stats for each campaign
    return Array.from(campaignMap.values()).map(campaign => {
      // Get unique tent names for Mina
      const minaTentNames = new Set(campaign.minaAssignments.map(a => a.tentNameOrNumber));
      const minaTentsCount = minaTentNames.size;

      // Get unique tent names for Arafat
      const arafatTentNames = new Set(campaign.arafatAssignments.map(a => a.tentNameOrNumber));
      const arafatTentsCount = arafatTentNames.size;

      // Calculate total area and capacity for Mina tents assigned to this campaign
      const minaTentsForCampaign = minaTents.filter(t => 
        minaTentNames.has(t.tentNameOrNumber)
      );
      const minaTotalArea = minaTentsForCampaign.reduce((sum, t) => sum + t.area, 0);
      const minaTotalCapacity = minaTentsForCampaign.reduce((sum, t) => sum + t.capacity, 0);
      const minaAvgAreaPerPilgrim = minaTotalCapacity > 0 ? minaTotalArea / minaTotalCapacity : 0;

      // Calculate total area and capacity for Arafat tents assigned to this campaign
      const arafatTentsForCampaign = arafatTents.filter(t => 
        arafatTentNames.has(t.tentNameOrNumber)
      );
      const arafatTotalArea = arafatTentsForCampaign.reduce((sum, t) => sum + t.area, 0);
      const arafatTotalCapacity = arafatTentsForCampaign.reduce((sum, t) => sum + t.capacity, 0);
      const arafatAvgAreaPerPilgrim = arafatTotalCapacity > 0 ? arafatTotalArea / arafatTotalCapacity : 0;

      return {
        campaignId: campaign.campaignId,
        minaTentsCount,
        arafatTentsCount,
        minaAvgAreaPerPilgrim,
        arafatAvgAreaPerPilgrim,
      };
    }).sort((a, b) => {
      // Sort by campaign ID (numbers first, then text)
      const aIsNum = !isNaN(Number(a.campaignId));
      const bIsNum = !isNaN(Number(b.campaignId));
      if (aIsNum && bIsNum) {
        return Number(a.campaignId) - Number(b.campaignId);
      }
      if (aIsNum) return -1;
      if (bIsNum) return 1;
      return a.campaignId.localeCompare(b.campaignId);
    });
  }, [minaTents, minaAssignments, arafatTents, arafatAssignments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                {t('mashair.dashboardTitle')}
              </h1>
              <p className="text-customgray text-sm sm:text-base break-words">
                {t('mashair.dashboardSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          <HousingStatsCard
            title={t('mashair.totalTents')}
            value={minaStats.totalTents + arafatStats.totalTents}
            icon={<FaCampground />}
            color="mainColor"
          />
          <HousingStatsCard
            title={t('mashair.assignedTents')}
            value={minaStats.assignedTents + arafatStats.assignedTents}
            icon={<CheckCircleOutlined />}
            color="success"
          />
          <HousingStatsCard
            title={t('mashair.totalArea')}
            value={`${(minaStats.totalArea + arafatStats.totalArea).toFixed(0)} ${t('mashair.squareMeters')}`}
            icon={<AppstoreOutlined />}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('mashair.totalCampaigns')}
            value={minaStats.campaignsCount + arafatStats.campaignsCount}
            icon={<GlobalOutlined />}
            color="secondaryColor"
          />
        </div>

        {/* Mina and Arafat Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Mina Section */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCampground className="text-primaryColor text-xl" />
                {t('mashair.minaTents')}
              </h3>
              <button
                onClick={() => navigate('/housing/mina')}
                className="text-primaryColor hover:text-primaryColor/80 text-sm font-medium"
              >
                {t('mashair.viewAll')} →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-primaryColor">{minaStats.totalTents}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.totalTents')}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-secondaryColor">{minaStats.assignedTents}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.assignedTents')}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-primaryColor">{minaStats.totalArea.toFixed(0)}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.totalArea')} (م²)</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-success">{minaStats.totalCapacity}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.totalCapacity')}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('mashair.lastEntries')}</h4>
              {lastEntries.minaTents.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lastEntries.minaTents.map((tent) => (
                    <div key={tent.id} className="p-3 bg-gray-50 rounded-lg border border-bordergray">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{tent.tentNameOrNumber}</span>
                        <span className="text-xs text-customgray">{tent.area} م²</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-customgray text-center py-4">{t('mashair.noEntries')}</p>
              )}
            </div>
          </GlassCard>

          {/* Arafat Section */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCampground className="text-secondaryColor text-xl" />
                {t('mashair.arafatTents')}
              </h3>
              <button
                onClick={() => navigate('/housing/arafat')}
                className="text-secondaryColor hover:text-secondaryColor/80 text-sm font-medium"
              >
                {t('mashair.viewAll')} →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-secondaryColor">{arafatStats.totalTents}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.totalTents')}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-primaryColor">{arafatStats.assignedTents}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.assignedTents')}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-secondaryColor">{arafatStats.totalArea.toFixed(0)}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.totalArea')} (م²)</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-2xl font-bold text-success">{arafatStats.totalCapacity}</div>
                <div className="text-xs text-customgray mt-1">{t('mashair.totalCapacity')}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('mashair.lastEntries')}</h4>
              {lastEntries.arafatTents.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lastEntries.arafatTents.map((tent) => (
                    <div key={tent.id} className="p-3 bg-gray-50 rounded-lg border border-bordergray">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{tent.tentNameOrNumber}</span>
                        <span className="text-xs text-customgray">{tent.area} م²</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-customgray text-center py-4">{t('mashair.noEntries')}</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Campaigns Statistics */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            {t('mashair.campaignsStatistics') || 'إحصائيات الحملات'}
          </h2>
          {campaignStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {campaignStats.map((campaign) => (
                <GlassCard 
                  key={campaign.campaignId}
                  className="p-5 sm:p-6 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-bordergray">
                      <h3 className="text-lg font-bold text-gray-800">
                        {t('mashair.campaignNumber') || 'رقم الحملة'}: {campaign.campaignId}
                      </h3>
                      <GlobalOutlined className="text-primaryColor text-xl" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-primaryColor/5 rounded-lg border border-primaryColor/20">
                        <div className="text-xs text-customgray mb-1">
                          {t('mashair.minaTentsCount') || 'عدد خيام منى'}
                        </div>
                        <div className="text-xl font-bold text-primaryColor">
                          {campaign.minaTentsCount}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-secondaryColor/5 rounded-lg border border-secondaryColor/20">
                        <div className="text-xs text-customgray mb-1">
                          {t('mashair.arafatTentsCount') || 'عدد خيام عرفات'}
                        </div>
                        <div className="text-xl font-bold text-secondaryColor">
                          {campaign.arafatTentsCount}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-primaryColor/5 rounded-lg border border-primaryColor/20">
                        <div className="text-xs text-customgray mb-1">
                          {t('mashair.minaAvgAreaPerPilgrim') || 'متوسط المساحة للحاج منى'}
                        </div>
                        <div className="text-lg font-bold text-primaryColor">
                          {campaign.minaAvgAreaPerPilgrim.toFixed(2)} {t('mashair.squareMeters')}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-secondaryColor/5 rounded-lg border border-secondaryColor/20">
                        <div className="text-xs text-customgray mb-1">
                          {t('mashair.arafatAvgAreaPerPilgrim') || 'متوسط المساحة للحاج عرفات'}
                        </div>
                        <div className="text-lg font-bold text-secondaryColor">
                          {campaign.arafatAvgAreaPerPilgrim.toFixed(2)} {t('mashair.squareMeters')}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
              <p className="text-center text-customgray">
                {t('mashair.noCampaigns') || 'لا توجد حملات مخصصة'}
              </p>
            </GlassCard>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <GlassCard 
            className="p-6 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/housing/mina')}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primaryColor/10 rounded-lg">
                <FileTextOutlined className="text-primaryColor text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{t('mashair.minaTents')}</h4>
                <p className="text-xs text-customgray">{t('mashair.manageMinaTents')}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard 
            className="p-6 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/housing/arafat')}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondaryColor/10 rounded-lg">
                <FileTextOutlined className="text-secondaryColor text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{t('mashair.arafatTents')}</h4>
                <p className="text-xs text-customgray">{t('mashair.manageArafatTents')}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default MashairDashboardPage;

