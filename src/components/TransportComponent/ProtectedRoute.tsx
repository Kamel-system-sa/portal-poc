import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserRole } from '../../contexts/UserRoleContext';
import { hasPermission } from '../../utils/rolePermissions';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { currentRole } = useUserRole();
  const { t } = useTranslation('Transport');

  const hasAccess = hasPermission(currentRole, requiredPermission as any);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 flex items-center justify-center p-4">
        <Result
          status="403"
          title={t('unauthorizedAccess')}
          subTitle={t('unauthorizedMessage')}
          extra={
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={() => window.location.href = '/'}
            >
              {t('goToDashboard')}
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

