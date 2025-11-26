import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { OrganizerForm } from "./OrganizerForm";
import type { Organizer } from "./types";

interface AddOrganizerModalProps {
  visible: boolean;
  form: any;
  uploading: boolean;
  imageFile: File | null;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  onImageChange: (file: File | null) => void;
  t: (key: string) => string;
}

export const AddOrganizerModal = ({
  visible,
  form,
  uploading,
  imageFile,
  onCancel,
  onSubmit,
  onImageChange,
  t,
}: AddOrganizerModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-mainColor to-primary p-2.5 rounded-xl shadow-lg">
            <PlusOutlined className="text-white text-xl" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 block">{t("addOrganizer")}</span>
            <span className="text-xs text-gray-500 font-normal">Fill in the organizer information below</span>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      className="add-organizer-modal"
    >
      <OrganizerForm
        form={form}
        onFinish={onSubmit}
        uploading={uploading}
        imageFile={imageFile}
        onImageChange={onImageChange}
        t={t}
        submitText={t("saveOrganizer")}
        loadingText={t("saving") || "Saving..."}
      />
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <Button onClick={onCancel} size="large" className="flex-1 rounded-lg h-11 font-semibold border-gray-300 text-gray-700 hover:text-gray-900">
          {t("cancel")}
        </Button>
        <Button
          htmlType="submit"
          loading={uploading}
          size="large"
          onClick={() => form.submit()}
          className="flex-1 bg-gradient-to-r from-mainColor to-primary border-0 hover:from-[#00443A] hover:to-[#00695C] text-white rounded-lg h-11 font-semibold shadow-lg shadow-mainColor/25 hover:shadow-xl hover:shadow-mainColor/30 transform hover:-translate-y-0.5 transition-all duration-300"
          style={{ color: '#ffffff' }}
        >
          {uploading ? t("saving") || "Saving..." : t("addOrganizer") || "Add Organizer"}
        </Button>
      </div>
    </Modal>
  );
};

