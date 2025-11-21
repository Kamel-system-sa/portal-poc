import { Card } from "antd";
import { TeamOutlined, GlobalOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";

interface StatisticsCardsProps {
  totalCount: number;
  nationalitiesCount: number;
  maleCount: number;
  femaleCount: number;
  onTotalClick: () => void;
  onMaleClick: () => void;
  onFemaleClick: () => void;
  t: (key: string) => string;
}

export const StatisticsCards = ({
  totalCount,
  nationalitiesCount,
  maleCount,
  femaleCount,
  onTotalClick,
  onMaleClick,
  onFemaleClick,
  t,
}: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Organizers Card */}
      <Card
        className="stat-card stat-card-primary group cursor-pointer border-0 overflow-hidden relative"
        onClick={onTotalClick}
        style={{
          background: "linear-gradient(135deg, #005B4F 0%, #00796B 100%)",
          boxShadow: "0 4px 20px rgba(0, 91, 79, 0.15)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                {t("organizers")}
              </div>
              <div className="text-white text-5xl font-bold mb-1 leading-none">{totalCount}</div>
              <div className="text-white/70 text-xs mt-2">Total Count</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <TeamOutlined className="text-white text-4xl" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
      </Card>

      {/* Nationalities Card */}
      <Card
        className="stat-card stat-card-info group border-0 overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #005B4F 0%, #00796B 100%)",
          boxShadow: "0 4px 20px rgba(47, 128, 237, 0.15)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                {t("nationalitiesLabel")}
              </div>
              <div className="text-white text-5xl font-bold mb-1 leading-none">{nationalitiesCount}</div>
              <div className="text-white/70 text-xs mt-2">Unique Countries</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <GlobalOutlined className="text-white text-4xl" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
      </Card>

      {/* Male Organizers Card */}
      <Card
        className="stat-card stat-card-success group cursor-pointer border-0 overflow-hidden relative"
        onClick={onMaleClick}
        style={{
          background: "linear-gradient(135deg, #005B4F 0%, #00796B 100%)",
          boxShadow: "0 4px 20px rgba(39, 174, 96, 0.15)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                {t("maleOrganizers")}
              </div>
              <div className="text-white text-5xl font-bold mb-1 leading-none">{maleCount}</div>
              <div className="text-white/70 text-xs mt-2">Male Count</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <ManOutlined className="text-white text-4xl" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
      </Card>

      {/* Female Organizers Card */}
      <Card
        className="stat-card stat-card-warning group cursor-pointer border-0 overflow-hidden relative"
        onClick={onFemaleClick}
        style={{
          background: "linear-gradient(135deg, #005B4F 0%, #00796B 100%)",
          boxShadow: "0 4px 20px rgba(242, 201, 76, 0.15)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                {t("femaleOrganizers")}
              </div>
              <div className="text-white text-5xl font-bold mb-1 leading-none">{femaleCount}</div>
              <div className="text-white/70 text-xs mt-2">Female Count</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <WomanOutlined className="text-white text-4xl" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
      </Card>
    </div>
  );
};

