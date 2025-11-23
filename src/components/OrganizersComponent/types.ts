export interface Organizer {
  id: string;
  organizerNumber: string;
  licenseNumber: string;
  company: string;
  hajjCount: number;
  organizerNationality?: string; // جنسية المنظم
  nationality: string; // جنسية الحجاج
  gender: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  phone?: string; // For backward compatibility
  countryPhoneCountryCode?: string;
  countryPhoneNumber?: string;
  countryPhone?: string; // For backward compatibility
  passport: string;
  email: string;
  imageURL?: string;
  createdAt: Date | string;
}

