// Removed Firebase dependency

export interface Organizer {
  id: string;
  organizerNumber: string;
  licenseNumber: string;
  organizerName: string; // اسم المنظم
  company: string; // اسم الشركة (الوكيل الخارجي)
  hajjCount: number;
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
  createdAt: Timestamp;
}

