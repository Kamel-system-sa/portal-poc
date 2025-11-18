import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message
}) => {
  const { t } = useTranslation('common');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ExclamationCircleOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{t('form.confirmDelete')}</h2>
                <p className="text-sm text-white/80">{t('form.confirmDeleteSubtitle')}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center">
            {message || t('form.confirmDeleteMessage')}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
            >
              {t('form.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl font-semibold"
            >
              {t('form.confirmDelete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

