export interface PassportReport {
  id: string;
  name: string;
  template: string;
  columns: string[];
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'completed' | 'sent';
  format: 'pdf' | 'excel';
  lastModified?: string;
}

export const mockPassportReports: PassportReport[] = [
  {
    id: 'report-1',
    name: 'Daily Service Proof Report',
    template: 'default',
    columns: ['name', 'passportNumber', 'nationality', 'timeVerified', 'operator'],
    createdAt: '2024-01-15T08:30:00',
    createdBy: 'Ahmed Mohammed',
    status: 'completed',
    format: 'pdf',
    lastModified: '2024-01-15T09:00:00'
  },
  {
    id: 'report-2',
    name: 'Verified Pilgrims by Organizer',
    template: 'detailed',
    columns: ['name', 'passportNumber', 'nationality', 'organizer', 'timeVerified', 'serviceCenter'],
    createdAt: '2024-01-14T14:20:00',
    createdBy: 'Fatima Khalid',
    status: 'sent',
    format: 'excel',
    lastModified: '2024-01-14T15:00:00'
  },
  {
    id: 'report-3',
    name: 'Weekly Summary Report',
    template: 'summary',
    columns: ['nationality', 'totalVerified', 'serviceCenter'],
    createdAt: '2024-01-13T10:15:00',
    createdBy: 'Mohammed Abdullah',
    status: 'draft',
    format: 'pdf'
  },
  {
    id: 'report-4',
    name: 'Box Arrangement Report',
    template: 'default',
    columns: ['boxNumber', 'shelf', 'nationality', 'passportCount', 'organizer'],
    createdAt: '2024-01-12T16:45:00',
    createdBy: 'Sara Ahmed',
    status: 'completed',
    format: 'excel',
    lastModified: '2024-01-12T17:30:00'
  },
  {
    id: 'report-5',
    name: 'Monthly Verification Report',
    template: 'detailed',
    columns: ['name', 'passportNumber', 'nationality', 'dateOfBirth', 'visaNumber', 'organizer', 'campaign', 'timeVerified', 'operator'],
    createdAt: '2024-01-10T09:00:00',
    createdBy: 'Khalid Bin Saad',
    status: 'sent',
    format: 'pdf',
    lastModified: '2024-01-10T10:30:00'
  }
];

export const availableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'passportNumber', label: 'Passport Number' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'visaNumber', label: 'Visa Number' },
  { key: 'organizer', label: 'Organizer' },
  { key: 'campaign', label: 'Campaign' },
  { key: 'timeVerified', label: 'Time Verified' },
  { key: 'operator', label: 'Operator' },
  { key: 'serviceCenter', label: 'Service Center' },
  { key: 'boxNumber', label: 'Box Number' },
  { key: 'shelf', label: 'Shelf' },
  { key: 'passportCount', label: 'Passport Count' },
  { key: 'totalVerified', label: 'Total Verified' }
];

export const reportTemplates = [
  { key: 'default', label: 'Default Template' },
  { key: 'detailed', label: 'Detailed Template' },
  { key: 'summary', label: 'Summary Template' },
  { key: 'custom', label: 'Custom Template' }
];

