/**
 * Campaign Helpers
 * 
 * These functions help link Campaigns with Pre-Arrival Preparation
 * When selecting organizer/campaign in Pre-Arrival forms, fetch data from Campaigns
 */

import { mockOrganizers, getCampaignByNumber, getCampaignsByOrganizer } from '../data/mockCampaigns';
import type { Organizer, Campaign } from '../types/reception';

/**
 * Get organizer by ID, number, or name (for Pre-Arrival form)
 * Uses organizers from Campaigns to avoid data duplication
 */
export const getOrganizerForPreArrival = (query: string): Organizer | undefined => {
  // Use organizers from mockCampaigns (shared with Pre-Arrival)
  return mockOrganizers.find(
    org =>
      org.id === query ||
      org.number.toLowerCase() === query.toLowerCase() ||
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.company.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Get campaign by number (for Pre-Arrival form)
 * Returns campaign data which includes organizer info
 */
export const getCampaignForPreArrival = (campaignNumber: string): Campaign | undefined => {
  return getCampaignByNumber(campaignNumber);
};

/**
 * Get all campaigns for an organizer (for Pre-Arrival form)
 */
export const getOrganizerCampaigns = (organizerId: string): Campaign[] => {
  return getCampaignsByOrganizer(organizerId);
};

/**
 * Auto-fill Pre-Arrival form data from Campaign
 * This prevents data duplication - when campaign number is selected,
 * organizer info is automatically fetched from Campaigns
 */
export const fillPreArrivalFromCampaign = (campaign: Campaign) => {
  return {
    organizerId: campaign.organizerId,
    organizerNumber: campaign.organizerNumber,
    organizerName: campaign.organizerName,
    organizerCompany: campaign.organizerCompany,
    organizerPhone: campaign.organizerPhone,
    organizerEmail: campaign.organizerEmail,
    campaignNumber: campaign.campaignNumber,
    pilgrimsCount: campaign.totalPilgrims,
    // Additional data can be fetched from campaign
  };
};

/**
 * Check if organizer exists in Campaigns
 * Used for validation in Pre-Arrival forms
 */
export const organizerExistsInCampaigns = (organizerId: string): boolean => {
  // Check organizers from mockCampaigns
  return mockOrganizers.some(org => org.id === organizerId);
};

