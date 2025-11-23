import { Modal, Button, Card, Typography, Tag } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import type { Organizer } from "./types";

const { Text } = Typography;

interface NationalityModalProps {
  visible: boolean;
  nationality: string;
  organizers: Organizer[];
  onCancel: () => void;
  translateNationality: (nationality: string) => string;
  getHajjCountByNationality: (nationality: string) => number;
  t: (key: string) => string;
}

export const NationalityModal = ({
  visible,
  nationality,
  organizers,
  onCancel,
  translateNationality,
  getHajjCountByNationality,
  t,
}: NationalityModalProps) => {
  const filteredOrganizers = organizers.filter((org) => org.nationality === nationality);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <GlobalOutlined className="text-mainColor" />
          <span>{translateNationality(nationality)}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          {t("close")}
        </Button>,
      ]}
      width={500}
    >
      {nationality && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <div className="text-3xl font-bold text-mainColor mb-2">{filteredOrganizers.length}</div>
              <div className="text-sm text-gray-600">{t("organizers")}</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-mainColor mb-2">{getHajjCountByNationality(nationality)}</div>
              <div className="text-sm text-gray-600">{t("totalHajjCount")}</div>
            </Card>
          </div>
          <div>
            <Text strong className="text-gray-700 block mb-2">
              {t("organizersList")}:
            </Text>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredOrganizers.map((org) => (
                <Card key={org.id} size="small" className="mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text strong className="block">
                        {org.company}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {t("organizerNumber")}: {org.organizerNumber}
                      </Text>
                    </div>
                    <Tag color="blue">
                      {org.hajjCount} {t("hajjCount")}
                    </Tag>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

