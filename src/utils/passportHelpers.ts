// Passport Module Helper Functions

import type { Pilgrim, PassportKPI, StorageLayout, StoredPassport } from '../types/passport';

/**
 * Calculate passport KPIs from pilgrim data
 */
export const calculatePassportKPIs = (
  pilgrims: Pilgrim[],
  storedPassports: StoredPassport[],
  transferRequests: any[] = []
): PassportKPI => {
  const today = new Date().toISOString().split('T')[0];
  
  const totalReceivedToday = pilgrims.filter(p => {
    const receivedDate = p.createdAt.split('T')[0];
    return receivedDate === today;
  }).length;

  const totalInStorage = storedPassports.length;
  const totalServiceProvided = pilgrims.filter(p => p.serviceProvided).length;
  const pendingTransfers = transferRequests.filter(t => t.status === 'pending').length;

  // Distribution by nationality
  const distributionByNationality: Record<string, number> = {};
  pilgrims.forEach(p => {
    distributionByNationality[p.nationality] = (distributionByNationality[p.nationality] || 0) + 1;
  });

  // Distribution by campaign
  const distributionByCampaign: Record<string, number> = {};
  pilgrims.forEach(p => {
    if (p.campaignNumber) {
      distributionByCampaign[p.campaignNumber] = (distributionByCampaign[p.campaignNumber] || 0) + 1;
    }
  });

  // Distribution by center (for company users)
  const distributionByCenter: Record<string, number> = {};
  pilgrims.forEach(p => {
    if (p.serviceCenterName) {
      distributionByCenter[p.serviceCenterName] = (distributionByCenter[p.serviceCenterName] || 0) + 1;
    }
  });

  return {
    totalReceivedToday,
    totalInStorage,
    totalServiceProvided,
    pendingTransfers,
    distributionByNationality,
    distributionByCampaign,
    distributionByCenter
  };
};

/**
 * Check if pilgrim belongs to current service center
 */
export const belongsToCenter = (pilgrim: Pilgrim, currentCenterId: string): boolean => {
  return pilgrim.serviceCenterId === currentCenterId;
};

/**
 * Format passport number for display
 */
export const formatPassportNumber = (passportNumber: string): string => {
  // Add formatting if needed (e.g., spaces, dashes)
  return passportNumber;
};

/**
 * Format visa number for display
 */
export const formatVisaNumber = (visaNumber: string): string => {
  // Add formatting if needed
  return visaNumber;
};

/**
 * Get storage location string
 */
export const getStorageLocation = (
  cabinet: string,
  drawer: string,
  box: string
): string => {
  return `Cabinet ${cabinet}, Drawer ${drawer}, Box ${box}`;
};

/**
 * Search pilgrims by passport or visa number
 */
export const searchPilgrims = (
  pilgrims: Pilgrim[],
  query: string
): Pilgrim[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return [];

  return pilgrims.filter(p => 
    p.passportNumber.toLowerCase().includes(lowerQuery) ||
    p.visaNumber.toLowerCase().includes(lowerQuery) ||
    p.name.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Group passports by criteria
 */
export const groupPassportsBy = (
  storedPassports: StoredPassport[],
  criteria: 'nationality' | 'organizer' | 'campaign' | 'ageGroup' | 'arrivalOrder'
): Record<string, StoredPassport[]> => {
  const grouped: Record<string, StoredPassport[]> = {};

  storedPassports.forEach(passport => {
    let key = '';
    
    switch (criteria) {
      case 'nationality':
        key = passport.nationality;
        break;
      case 'organizer':
        key = 'organizer'; // Would need organizer data
        break;
      case 'campaign':
        key = 'campaign'; // Would need campaign data
        break;
      default:
        key = 'other';
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(passport);
  });

  return grouped;
};

