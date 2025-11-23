import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, message, Alert } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { Pilgrim } from '../../types/passport';

interface ServiceProofButtonProps {
  pilgrim: Pilgrim;
  currentCenterId: string;
  onServiceProvided: (pilgrimId: string) => void;
  onTransferRequest?: (pilgrimId: string, toCenterId: string) => void;
}

export const ServiceProofButton: React.FC<ServiceProofButtonProps> = ({
  pilgrim,
  currentCenterId,
  onServiceProvided,
  onTransferRequest
}) => {
  const { t } = useTranslation('common');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);

  const belongsToCurrentCenter = pilgrim.serviceCenterId === currentCenterId;

  const handleServiceProvided = () => {
    if (!belongsToCurrentCenter) {
      setTransferVisible(true);
      return;
    }
    setConfirmVisible(true);
  };

  const confirmService = () => {
    onServiceProvided(pilgrim.id);
    setConfirmVisible(false);
    message.success(t('passport.serviceProof.success'));
  };

  if (pilgrim.serviceProvided) {
    return (
      <Button 
        type="default" 
        icon={<CheckCircleOutlined />}
        disabled
        className="bg-green-50 text-green-700 border-green-300"
      >
        {t('passport.serviceProof.completed')}
      </Button>
    );
  }

  return (
    <>
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

      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        size="large"
        onClick={handleServiceProvided}
        className={belongsToCurrentCenter ? 'bg-green-600 hover:bg-green-700' : ''}
      >
        {t('passport.serviceProof.confirm')}
      </Button>

      <Modal
        title={t('passport.serviceProof.confirmTitle')}
        open={confirmVisible}
        onOk={confirmService}
        onCancel={() => setConfirmVisible(false)}
        okText={t('passport.serviceProof.confirm')}
        cancelText={t('form.cancel')}
      >
        <p>{t('passport.serviceProof.confirmMessage', { name: pilgrim.name })}</p>
      </Modal>

      {transferVisible && onTransferRequest && (
        <Modal
          title={t('passport.transferRequest.title')}
          open={transferVisible}
          onOk={() => {
            // This would open a transfer request form
            message.info(t('passport.transferRequest.comingSoon'));
            setTransferVisible(false);
          }}
          onCancel={() => setTransferVisible(false)}
          okText={t('passport.transferRequest.submit')}
          cancelText={t('form.cancel')}
        >
          <p>{t('passport.transferRequest.message', { 
            name: pilgrim.name,
            currentCenter: pilgrim.serviceCenterName,
            targetCenter: 'Target Center' // Would be selected
          })}</p>
        </Modal>
      )}
    </>
  );
};

