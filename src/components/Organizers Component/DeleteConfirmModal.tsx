import { Modal, Button, Card, Image, Typography } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { Organizer } from "./types";

const { Title, Text } = Typography;

interface DeleteConfirmModalProps {
  visible: boolean;
  organizer: Organizer | null;
  onCancel: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

export const DeleteConfirmModal = ({ visible, organizer, onCancel, onConfirm, t }: DeleteConfirmModalProps) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
      className="delete-confirm-modal"
      centered
    >
      <div className="py-2">
        {/* Icon and Title Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full mb-4 shadow-lg">
            <ExclamationCircleOutlined className="text-white text-4xl" />
          </div>
          <Title level={4} className="text-gray-800 mb-2 text-center">
            {t("deleteOrganizer") || "Delete Organizer"}
          </Title>
          <Text className="text-gray-600 text-center text-sm">
            {t("deleteOrganizerConfirm") ||
              "Are you sure you want to delete this organizer? This action cannot be undone."}
          </Text>
        </div>

        {/* Organizer Info Card (if selected) */}
        {organizer && (
          <Card className="mb-6 border-2 border-red-100 bg-red-50/50">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {organizer.imageURL ? (
                  <Image
                    src={organizer.imageURL}
                    alt={organizer.company}
                    className="rounded-lg"
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={organizer.gender === "Male" ? "/images/male.png" : "/images/female.png"}
                    alt={organizer.gender}
                    className="rounded-lg"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Text className="text-sm font-semibold text-gray-800 block truncate">{organizer.company}</Text>
                <Text className="text-xs text-gray-500 block">
                  {t("organizerNumber")}: {organizer.organizerNumber}
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            size="large"
            className="flex-1 rounded-lg h-11 font-semibold border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            danger
            size="large"
            icon={<DeleteOutlined />}
            className="flex-1 rounded-lg h-11 font-semibold bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 text-white"
            style={{ color: '#ffffff' }}
          >
            {t("delete") || "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

