import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, message, Alert, Space, Card } from 'antd';
import { CheckCircleOutlined, WarningOutlined, ReloadOutlined, SwapOutlined } from '@ant-design/icons';
import type { MockPassportScanResult } from '../../data/mockPassports';

interface ServiceProofActionsProps {
  passport: MockPassportScanResult;
  currentCenterId: string;
  onServiceProvided: (passport: MockPassportScanResult) => void;
  onTransferRequest?: (passport: MockPassportScanResult) => void;
  onNext: () => void;
}

export const ServiceProofActions: React.FC<ServiceProofActionsProps> = ({
  passport,
  currentCenterId,
  onServiceProvided,
  onTransferRequest,
  onNext
}) => {
  const { t } = useTranslation('common');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);

  const belongsToCurrentCenter = passport.serviceCenterId === currentCenterId;

  const handleServiceProvided = () => {
    if (!belongsToCurrentCenter) {
      setTransferVisible(true);
      return;
    }
    setConfirmVisible(true);
  };

  const confirmService = () => {
    onServiceProvided(passport);
    setConfirmVisible(false);
    message.success(t('passport.serviceProof.success'));
  };

  const handleTransferRequest = () => {
    if (onTransferRequest) {
      onTransferRequest(passport);
      message.info(t('passport.transferRequest.comingSoon'));
    }
    setTransferVisible(false);
  };

  return (
    <>
      <Card className="shadow-lg">
        {!belongsToCurrentCenter && (
          <Alert
            message={t('passport.belongsToAnotherCenter')}
            description={t('passport.transferRequest.description')}
            type="warning"
            icon={<WarningOutlined />}
            className="mb-4"
            showIcon
          />
        )}

        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              size="large"
              onClick={handleServiceProvided}
              className={`flex-1 h-12 text-base font-semibold ${
                belongsToCurrentCenter 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                  : ''
              }`}
            >
              {t('passport.serviceProof.confirm')}
            </Button>

            {!belongsToCurrentCenter && onTransferRequest && (
              <Button
                icon={<SwapOutlined />}
                size="large"
                onClick={() => setTransferVisible(true)}
                className="flex-1 h-12 text-base"
              >
                {t('passport.transferRequest.submit')}
              </Button>
            )}

            <Button
              icon={<ReloadOutlined />}
              size="large"
              onClick={onNext}
              className="flex-1 h-12 text-base"
            >
              {t('passport.nextPassport')}
            </Button>
          </div>
        </Space>
      </Card>

      <Modal
        title={t('passport.serviceProof.confirmTitle')}
        open={confirmVisible}
        onOk={confirmService}
        onCancel={() => setConfirmVisible(false)}
        okText={t('passport.serviceProof.confirm')}
        cancelText={t('form.cancel')}
      >
        <p>{t('passport.serviceProof.confirmMessage', { name: passport.name })}</p>
      </Modal>

      {transferVisible && (
        <Modal
          title={t('passport.transferRequest.title')}
          open={transferVisible}
          onOk={handleTransferRequest}
          onCancel={() => setTransferVisible(false)}
          okText={t('passport.transferRequest.submit')}
          cancelText={t('form.cancel')}
        >
          <p>
            {t('passport.transferRequest.message', {
              name: passport.name,
              currentCenter: passport.serviceCenterName,
              targetCenter: 'Target Center'
            })}
          </p>
        </Modal>
      )}
    </>
  );
};

