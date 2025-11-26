import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { CheckCircleOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MockPassportData } from '../../data/mockPassports';

interface ServiceProofActionsProps {
  passport: MockPassportData | null;
  currentCenterId?: string;
  onConfirm: () => void;
  onNext: () => void;
}

export const ServiceProofActions: React.FC<ServiceProofActionsProps> = ({
  passport,
  currentCenterId = 'center-1',
  onConfirm,
  onNext
}) => {
  const { t } = useTranslation('common');
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleConfirm = () => {
    if (!passport) return;

    // Check if passport belongs to another center
    if (passport.centerId !== currentCenterId) {
      setShowWarningModal(true);
      return;
    }

    // Confirm service proof
    onConfirm();
  };

  const handleConfirmAnyway = () => {
    setShowWarningModal(false);
    onConfirm();
  };

  if (!passport) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleConfirm}
            className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            {t('passport.confirmServiceProof')}
          </Button>

          <Button
            size="large"
            icon={<ReloadOutlined />}
            onClick={onNext}
            className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold border-2 border-gray-300 hover:border-mainColor hover:text-mainColor transition-all duration-300"
          >
            {t('passport.nextPassport')}
          </Button>
        </div>
      </div>

      <Modal
        open={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
        onOk={handleConfirmAnyway}
        okText={t('passport.confirmAnyway')}
        cancelText={t('cancel')}
        icon={<ExclamationCircleOutlined className="text-orange-500" />}
        title={t('passport.belongsToAnotherCenter')}
      >
        <p className="text-gray-700">
          {t('passport.belongsToAnotherCenterMessage', { centerName: passport.centerName })}
        </p>
      </Modal>
    </>
  );
};

