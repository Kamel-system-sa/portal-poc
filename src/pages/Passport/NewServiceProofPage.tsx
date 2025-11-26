import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { usePassportScanner } from '../../components/Passport/usePassportScanner';
import { ScannerPanel } from '../../components/Passport/ScannerPanel';
import { PassportViewer } from '../../components/Passport/PassportViewer';
import { PilgrimInfoCard } from '../../components/Passport/PilgrimInfoCard';
import { OrganizerInfoCard } from '../../components/Passport/OrganizerInfoCard';
import { ServiceProofActions } from '../../components/Passport/ServiceProofActions';
import { AssignToBoxPanel } from '../../components/Passport/AssignToBoxPanel';
import { searchPassportById } from '../../data/mockPassports';
import type { MockPassportData } from '../../data/mockPassports';

const NewServiceProofPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { scan, isScanning } = usePassportScanner();
  const [passport, setPassport] = useState<MockPassportData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentCenterId] = useState<string>('center-1'); // In real app, get from user context

  const handleScan = async () => {
    try {
      const scannedPassport = await scan();
      setPassport(scannedPassport);
    } catch (error) {
      message.error(t('passport.scanError') || 'Failed to scan passport');
    }
  };

  const handleSearchByPassportId = async (passportId: string) => {
    setIsSearching(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundPassport = searchPassportById(passportId);
      
      if (foundPassport) {
        setPassport(foundPassport);
        message.success(t('passport.passportFound') || 'Passport found successfully');
      } else {
        message.error(t('passport.passportNotFound') || 'Passport not found. Please check the passport number and try again.');
      }
    } catch (error) {
      message.error(t('passport.searchError') || 'Failed to search passport');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (!passport) return;
    
    setIsConfirming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success(t('passport.serviceProofConfirmed') || 'Service proof confirmed successfully');
      
      // Clear passport and reset UI with fade animation
      setTimeout(() => {
        setPassport(null);
        setIsConfirming(false);
      }, 300);
    } catch (error) {
      message.error(t('passport.confirmError') || 'Failed to confirm service proof');
      setIsConfirming(false);
    }
  };

  const handleNext = () => {
    setPassport(null);
  };

  const handleAssignToBox = (boxId: string) => {
    if (!passport) return;
    message.success(t('passport.passportAssignedSuccessfully') || 'Passport assigned to box successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('passport.serviceProof')}
        </h1>
        <p className="text-gray-600">{t('passport.serviceProofSubtitle')}</p>
      </div>

      {/* Passport Scanning Card - Full Width */}
      {!passport && (
        <section className="w-full">
          <ScannerPanel
            onScan={handleScan}
            onSearchByPassportId={handleSearchByPassportId}
            isScanning={isScanning}
            isSearching={isSearching}
          />
        </section>
      )}

      {/* Main Content Grid - Only show when passport is scanned */}
      {passport && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Passport Viewer with fade animation */}
            <div
              className={`transition-all duration-300 ${
                isConfirming ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
              }`}
            >
              <section className="mb-6">
                <PassportViewer passport={passport} />
              </section>

              {/* Additional Info Cards */}
              <section className="mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PilgrimInfoCard passport={passport} />
                  <OrganizerInfoCard passport={passport} />
                </div>
              </section>

              {/* Service Proof Actions */}
              <section>
                <ServiceProofActions
                  passport={passport}
                  currentCenterId={currentCenterId}
                  onConfirm={handleConfirm}
                  onNext={handleNext}
                />
              </section>
            </div>
          </div>

          {/* Right Column - Assign to Box Panel */}
          <div className="lg:col-span-1">
            <AssignToBoxPanel
              passport={passport}
              onAssign={handleAssignToBox}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewServiceProofPage;

