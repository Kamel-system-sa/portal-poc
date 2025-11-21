import { Modal, Button, Card, Typography, Tag } from "antd";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import type { Organizer } from "./types";

const { Text } = Typography;

interface GenderModalProps {
  visible: boolean;
  gender: string;
  organizers: Organizer[];
  onCancel: () => void;
  translateNationality: (nationality: string) => string;
  getOrganizersByGender: (gender: string) => Organizer[];
  getHajjCountByGender: (gender: string) => number;
  t: (key: string) => string;
}

export const GenderModal = ({
  visible,
  gender,
  organizers,
  onCancel,
  translateNationality,
  getOrganizersByGender,
  getHajjCountByGender,
  t,
}: GenderModalProps) => {
  const filteredOrganizers = getOrganizersByGender(gender);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {gender === "Male" ? (
            <ManOutlined className="text-mainColor text-xl" />
          ) : (
            <WomanOutlined className="text-mainColor text-xl" />
          )}
          <span>{gender === "Male" ? t("maleOrganizers") : t("femaleOrganizers")}</span>
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
      {gender && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <div className="text-3xl font-bold text-mainColor mb-2">{filteredOrganizers.length}</div>
              <div className="text-sm text-gray-600">{t("organizers")}</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-mainColor mb-2">{getHajjCountByGender(gender)}</div>
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
                      <Text className="text-xs text-gray-500">
                        {t("nationality")}: {translateNationality(org.nationality)}
                      </Text>
                    </div>
                    <Tag className="bg-primary/10 text-primary border-primary/20">
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

