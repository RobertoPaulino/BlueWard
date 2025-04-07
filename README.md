# BlueWard - Residential Facility Check-In Dashboard

BlueWard is a mock frontend application for managing check-ins at a residential facility with multiple houses. This project serves as a demonstration and proposal for the final application.

## Features

- **Multiple User Types**: The application supports four distinct user types, each with their own dashboard:
  - **Resident**: Main users who live in the facility
  - **Guest**: Visitors who are invited by residents
  - **Security Guard**: Staff who manage and verify check-ins
  - **Admin**: Administrative users with special privileges

- **Resident Features**:
  - Manage invites (create, view status, cancel)
  - Friend list management
  - Check-in/out tracking
  - Fast check-in option

- **Guest Features**:
  - View and respond to invites
  - Friend list access
  - Check-in/out process
  - Upgrade to resident with correct code

- **Security Features**:
  - Search invites by various criteria
  - Process notifications from residents/guests
  - Manage check-ins and check-outs

- **Admin Features**:
  - Create VIP invites with extended privileges
  - Link guest accounts to residences
  - Disable resident accounts

- **Multi-language Support**:
  - English
  - Spanish

## Technology Stack

- React Native (for mobile and web compatibility)
- Context API for state management
- Dark theme with blue accents for easy viewing

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # Context providers for state
├── screens/         # Screen components for each dashboard
├── navigation/      # Navigation configuration
├── styles/          # Theme and global styles
└── utils/           # Utilities and mock data
    └── translations/  # Language files
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the application with `npm start`

## Demo Users

For demonstration purposes, you can log in with the following usernames (no password required):

- Resident: `john_resident`
- Guest: `bob_guest`
- Security: `guard_main`
- Admin: `admin_super`

## Notes

This is a mockup frontend application created for presentation purposes. It does not include actual backend connectivity but is structured in a way that would make integration straightforward. 