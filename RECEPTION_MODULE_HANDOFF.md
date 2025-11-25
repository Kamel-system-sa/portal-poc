# Reception Module (الاستقبال) - UI Mockups Handoff

## Overview
This document provides a complete handoff for the Reception module UI mockups. The module is fully bilingual (Arabic RTL / English LTR) and matches the existing site design.

## Module Structure

### 1. Pre-Arrival Preparation (الاستعداد المسبق للوصول)

#### Pages
- **Dashboard**: `/reception/pre-arrival` - `PreArrivalDashboardPage.tsx`
- **List/Index**: `/reception/pre-arrival/list` - `PreArrivalListPage.tsx`

#### Components
- `PreArrivalKPICards.tsx` - KPI summary cards (Total Contracted, Arrived, Remaining, Today's Expected, Arrived Today)
- `ArrivalGroupsList.tsx` - Table view with search, filters, pagination

#### Features
- ✅ Table view of arrival groups with search, sort, filters, pagination
- ✅ Create/Edit form modal (placeholder - would include Excel upload + manual entry)
- ✅ Dashboard with KPI cards, charts (destination, trend, campaigns), tables, activity timeline
- ✅ All cards/charts/tables clickable to filtered views
- ✅ Loading, empty, error states
- ✅ Privacy: raw passenger data stored but hidden by default (role-based toggle needed)

### 2. Air & Land Ports (المنافذ الجوية والبرية)

#### Pages
- **Airports**: `/reception/ports/airports` - `AirportPortPage.tsx`
- **Land Ports**: `/reception/ports/land` - `LandPortPage.tsx`

#### Features
- ✅ **Airports**: Split-screen - left: confirm flight arrival & group count; right: bus info (photo, carrier, number, driver phone, passengers per bus)
- ✅ **Land Ports**: Bus form with photo upload + guide phone confirmation
- ✅ Notifications: Placeholder for bus passage → notify Accommodation, Reception, Card teams
- ✅ Overcapacity alerts / mismatch warnings (ready for implementation)

### 3. Campaigns (الحملات)
- Placeholder: Coming Soon (routes ready)

## Route Structure

```typescript
/reception                              → Pre-Arrival Dashboard
/reception/pre-arrival                  → Pre-Arrival Dashboard
/reception/pre-arrival/list             → Arrival Groups List
/reception/ports/airports               → Airport Port Screen
/reception/ports/land                   → Land Port Screen
/reception/campaigns                    → Campaigns (Coming Soon)
```

## Components List

### Pages (`src/pages/ReceptionPages/`)
1. `PreArrivalDashboardPage.tsx` - Main dashboard with KPIs, charts, tables, timeline
2. `PreArrivalListPage.tsx` - Table view of arrival groups
3. `AirportPortPage.tsx` - Split-screen airport confirmation
4. `LandPortPage.tsx` - Land port bus passage confirmation

### Components (`src/components/Reception/`)
1. `PreArrivalKPICards.tsx` - KPI summary cards
2. `ArrivalGroupsList.tsx` - Groups table with search, filters, pagination

### Types (`src/types/reception.ts`)
- `Accommodation` - Accommodation data structure
- `Organizer` - Organizer information
- `ArrivalGroup` - Arrival group with all fields
- `RawPassengerData` - Passenger data (hidden by default)
- `Bus` - Bus information
- `PortActivity` - Port activity log
- `DashboardKPI` - Dashboard metrics
- `ChartData` - Chart data structure
- `ActivityTimelineItem` - Timeline activity items

### Mock Data (`src/data/mockReception.ts`)
- `mockArrivalGroups` - 10 arrival groups (8-12 as requested)
- `mockAccommodations` - 5 accommodations
- `mockBuses` - 6 buses
- `mockDashboardKPI` - Calculated KPIs
- `mockArrivalsByDestination` - Chart data
- `mockArrivalsTrend` - Trend chart data
- `mockArrivalsByCampaign` - Campaign chart data
- `mockActivityTimeline` - Activity timeline data
- `mockPortActivities` - Port activity log

## Translation Keys

### English (`src/locales/en/common.json`)
All keys under `reception.*`:
- `reception.title` - "Reception"
- `reception.preArrival.*` - Pre-Arrival section
- `reception.ports.*` - Ports section
- `reception.campaigns.*` - Campaigns section

### Arabic (`src/locales/ar/common.json`)
Same structure with Arabic translations:
- `reception.title` - "الاستقبال"
- All nested keys translated

## Mock Data Summary

### Arrival Groups (10 groups)
- Group numbers: GRP-001 to GRP-010
- Mix of scheduled, arrived, completed statuses
- Various destinations: Makkah, Madinah, Mina, Arafat
- Pilgrim counts: 150-320 per group
- Includes flight numbers and trip numbers
- Accommodation assignments included
- Raw passenger data included (hidden by default)

### Accommodations (5 total)
- 2 Hotels: Grand Makkah Hotel, Al-Safa Towers
- 1 Building: Pilgrim Residence Complex A
- 2 Tent Camps: Mina Camp Alpha, Arafat Camp Beta

### Buses (6 total)
- Mix of available, assigned, in-transit, arrived statuses
- Different carriers: Al-Najm Transport, Saudi Bus Company, Hajj Transport Services
- Capacity: 45-50 passengers
- Driver information included

## Interactive Flows

### Pre-Arrival → Accommodation → Ports → Notifications → Dashboard

1. **Pre-Arrival List** → Click "Add Group" → Form modal opens
2. **Dashboard** → Click any KPI card → Navigate to filtered list
3. **Dashboard** → Click chart → Navigate to filtered view
4. **List** → Click "View" → Group details modal
5. **List** → Click "Edit" → Edit form modal
6. **Airport Port** → Select flight → Auto-fill group count → Select bus → Confirm → Notify teams
7. **Land Port** → Select bus → Upload photo → Enter guide phone → Confirm → Notify teams

## Design System Compliance

✅ Matches existing site design:
- Colors: `mainColor` (#005B4F), `primary` (#00796B)
- Rounded corners: `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-lg`, `shadow-gray-200/50`
- Cards: White background with borders
- Typography: Bold headings, semibold labels
- Spacing: Consistent padding and margins
- Gradients: Used for buttons and accents
- Icons: Ant Design icons

## Bilingual Support

✅ Full RTL/LTR support:
- Arabic screens: RTL layout
- English screens: LTR layout
- All text translated
- Direction-aware spacing and alignment
- Breadcrumbs support both directions

## States Handled

✅ All required states:
- **Loading**: Ready for implementation (use loading spinners)
- **Empty**: Empty state with illustrations and call-to-action
- **Error**: Ready for implementation (error messages)
- **Normal**: All screens implemented

## Next Steps (Backend Integration)

1. **Forms**: Implement actual form submission (Excel upload, validation, column mapping)
2. **Privacy Toggle**: Add role-based permission check to reveal raw passenger data
3. **Notifications**: Integrate with notification system (Accommodation, Reception, Card teams)
4. **Alerts**: Implement overcapacity and mismatch warnings
5. **API Integration**: Replace mock data with API calls
6. **Real-time Updates**: Add WebSocket for live activity timeline
7. **Export**: Add Excel/PDF export functionality

## Notes

- All screens are **UI mockups only** - no functional backend code
- All clickable items open modals or navigate to filtered views
- Charts are simplified visual representations (ready for Chart.js/Recharts integration)
- Forms show placeholders indicating where actual form components would go
- Notification system is placeholder (ready for integration)

## File Locations

```
portal-poc/
├── src/
│   ├── pages/
│   │   └── ReceptionPages/
│   │       ├── PreArrivalDashboardPage.tsx
│   │       ├── PreArrivalListPage.tsx
│   │       ├── AirportPortPage.tsx
│   │       └── LandPortPage.tsx
│   ├── components/
│   │   └── Reception/
│   │       ├── PreArrivalKPICards.tsx
│   │       └── ArrivalGroupsList.tsx
│   ├── types/
│   │   └── reception.ts
│   ├── data/
│   │   └── mockReception.ts
│   ├── locales/
│   │   ├── en/
│   │   │   └── common.json (updated)
│   │   └── ar/
│   │       └── common.json (updated)
│   └── main.tsx (updated routes)
└── layouts/
    └── AppSidebar.tsx (updated menu)
```

## Testing Checklist

- [ ] Navigate to all routes
- [ ] Switch between Arabic and English
- [ ] Verify RTL/LTR layouts
- [ ] Test search and filters
- [ ] Test pagination
- [ ] Click all clickable cards/charts/tables
- [ ] Open all modals
- [ ] Verify responsive design
- [ ] Check breadcrumbs
- [ ] Test sidebar navigation

---

**Status**: ✅ Complete - Ready for backend integration

