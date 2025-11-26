# Transport Module - Setup and Documentation

## Overview

The Transport module is a comprehensive section for managing bus routes, passenger information, and transport operations. It is designed to match the existing design system used in Housing and Public Affairs modules.

## Access Control

- **Authorized Roles**: Only users with "main-admin" role can access the Transport section
- **Route Protection**: All Transport pages are protected with `ProtectedRoute` component
- **Sidebar Visibility**: Transport menu items are automatically hidden for unauthorized users

## File Structure

```
src/
├── components/
│   └── Transport/
│       ├── BusCard.tsx              # Bus card component displaying bus information
│       ├── AddBusModal.tsx          # Modal for adding/editing buses
│       ├── PassengersPopup.tsx      # Popup showing passenger list
│       ├── PassengerDetailModal.tsx # Modal showing detailed passenger information
│       ├── ExportImport.tsx         # Export/Import functionality
│       └── ProtectedRoute.tsx       # Route protection component
├── pages/
│   └── TransportPages/
│       ├── TransportDashboardPage.tsx  # Main dashboard page
│       └── TransferInfoPage.tsx        # Transfer information page with bus cards
├── data/
│   └── mockTransport.ts            # Mock data and helper functions
└── locales/
    ├── en/
    │   └── Transport.json          # English translations
    ├── ar/
    │   └── Transport.json          # Arabic translations
    └── ur/
        └── Transport.json          # Urdu translations
```

## Pages

### 1. Transport Dashboard (`/transport`)

**Features:**
- Statistics cards showing:
  - Total Buses
  - Total Trips Today
  - Total Passengers
  - Active Trips
- Quick actions section:
  - Add Bus button
  - Export/Import data buttons
- Latest 5 bus records displayed as cards

### 2. Transfer Information (`/transport/transfer-info`)

**Features:**
- Grid of bus cards showing all buses
- Each bus card displays:
  - Route (e.g., Jeddah → Makkah)
  - Departure and arrival times
  - Transport company
  - License plate and bus number
  - Driver information (primary and secondary)
  - Passenger count (clickable)
- Donut chart showing passenger distribution by route
- Add Bus button
- Export/Import functionality

**Interactions:**
- Clicking passenger count opens a popup with passenger list
- Clicking a passenger in the list opens detailed passenger modal
- Bus cards show color-coded status (Full/Partially Full/Empty)

## Components

### BusCard
Displays bus information in a card format with status indicators.

### AddBusModal
Form modal for adding or editing bus information. Includes all bus fields and passenger management.

### PassengersPopup
Compact popup showing list of passengers for a selected bus.

### PassengerDetailModal
Detailed view of passenger information including:
- Full name
- ID/Passport number
- Seat number
- Phone number
- Notes

### ExportImport
Handles data export (CSV/JSON) and import (JSON) functionality.

### ProtectedRoute
Wrapper component that checks user permissions before rendering protected content.

## Mock Data

The module uses mock data stored in `src/data/mockTransport.ts`. The file includes:
- 6 sample buses with various routes
- Each bus has at least 3 passengers
- Helper functions for data manipulation

**TODO**: Replace mock data with backend API calls or Firebase integration.

## Internationalization (i18n)

All UI text is translated in three languages:
- English (`en/Transport.json`)
- Arabic (`ar/Transport.json`)
- Urdu (`ur/Transport.json`)

Translation keys follow the pattern: `transport.*`

## Future Expansion

### Backend Integration

**TODO Comments are placed in the following locations:**

1. `src/data/mockTransport.ts`
   - Replace `addBus`, `updateBus`, `deleteBus` functions with API calls
   - Replace mock data array with API fetch

2. `src/pages/TransportPages/TransportDashboardPage.tsx`
   - Replace `handleAddBus` with API call
   - Replace `handleDataImported` with API call

3. `src/pages/TransportPages/TransferInfoPage.tsx`
   - Replace `handleAddBus` with API call
   - Replace `handleDataImported` with API call

4. `src/components/Transport/ExportImport.tsx`
   - Implement CSV parsing for import
   - Add data validation for imported files
   - Connect to backend for data persistence

### Features to Add

1. **Real-time Updates**
   - WebSocket integration for live bus status updates
   - Real-time passenger count updates

2. **Advanced Filtering**
   - Filter buses by route, company, status
   - Search functionality for buses and passengers

3. **Reporting**
   - Generate reports for transport operations
   - Analytics dashboard with charts and graphs

4. **Notifications**
   - Alerts for delayed buses
   - Notifications for capacity issues

5. **Mobile App Integration**
   - API endpoints for mobile app access
   - Push notifications

6. **GPS Tracking**
   - Real-time bus location tracking
   - Route visualization on map

## Testing

### Test Scenarios

1. **Adding a Bus**
   - Click "Add Bus" button
   - Fill in all required fields
   - Submit form
   - Verify bus appears in the list

2. **Importing Invalid Data**
   - Click Import button
   - Upload invalid JSON file
   - Verify error message is displayed

3. **Unauthorized Access**
   - Log in as non-admin user
   - Try to access `/transport` directly
   - Verify "Unauthorized Access" page is shown

4. **Passenger Details**
   - Click passenger count on a bus card
   - Click on a passenger in the popup
   - Verify detailed modal opens with correct information

## Design System

The module follows the exact design system used in Housing and Public Affairs:
- Uses `GlassCard` component for cards
- Uses `HousingStatsCard` for statistics
- Matches color palette and typography
- Responsive layout with Tailwind CSS
- RTL support for Arabic and Urdu

## Dependencies

- React 19.2.0
- Ant Design 5.29.0
- React Router DOM 7.9.6
- Recharts 3.4.1 (for charts)
- i18next 25.6.2 (for translations)

## Notes

- All modals support ESC key to close
- Focus management is implemented for accessibility
- ARIA labels are included for screen readers
- The module is fully responsive and works on mobile devices

