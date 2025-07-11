# Database Seeding Guide

This guide explains how to populate the database with sample data for the Acme Corp Patient Dashboard.

## Overview

The seeding system provides realistic patient data including:
- **Users**: Demo patients, admin, and moderator accounts
- **Weight Entries**: 13 initial entries + 25 recent entries (38 total)
- **Medications**: GLP-1 medication history
- **Shipments**: Medication delivery tracking

## Quick Start

### 1. Initial Database Seeding

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Seed the database with initial data
npm run seed
```

### 2. Add Recent Weight Data (Optional)

```bash
# Add more recent weight entries (continues from last mock entry)
npm run add-recent-data
```

## Demo Credentials

After seeding, you can log in with these credentials:

### Patient Account
- **Email**: `patient@example.com`
- **Password**: `demo123`
- **Role**: User

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `demo123`
- **Role**: Admin

### Moderator Account
- **Email**: `moderator@example.com`
- **Password**: `demo123`
- **Role**: Moderator

## Data Details

### Patient Profile
- **Name**: Sarah Johnson
- **Enrollment Date**: January 15, 2024
- **Starting Weight**: 185 lbs
- **Current Weight**: 136 lbs (as of June 30, 2025)
- **Total Weight Loss**: 49 lbs

### Weight Tracking Journey
The patient's weight loss journey spans from January 2024 to June 2025:

#### Initial Phase (Jan-Jun 2024)
- Starting weight: 185 lbs
- Gradual progress with GLP-1 medication
- Reached 10-pound milestone in April
- Achieved 20-pound loss by June

#### Continued Progress (Jul-Dec 2024)
- Consistent weekly tracking
- Reached 25-pound milestone in August
- Achieved 30-pound loss in October
- Hit 35-pound milestone in December

#### Recent Progress (Jan-Jun 2025)
- Maintained healthy habits
- Reached 40-pound milestone in February
- Achieved 45-pound loss in May
- Current weight: 136 lbs (49 lbs total loss)

### Medication History
- **Current**: Semaglutide 1.0 mg (weekly)
- **Previous**: Semaglutide 0.5 mg (weekly, Dec 2023 - Jan 2024)

### Key Milestones
- 🎯 **10 lbs lost**: April 8, 2024
- 🎯 **20 lbs lost**: June 17, 2024
- 🎯 **25 lbs lost**: August 12, 2024
- 🎯 **30 lbs lost**: October 7, 2024
- 🎯 **35 lbs lost**: December 16, 2024
- 🎯 **40 lbs lost**: February 24, 2025
- 🎯 **45 lbs lost**: May 5, 2025

## Scripts Available

### `npm run seed`
- Clears existing data
- Creates users, weight entries, medications, and shipments
- Provides initial dataset

### `npm run seed:dev`
- Same as `seed` but with development mode
- Includes hot reloading for development

### `npm run add-recent-data`
- Adds 25 additional weight entries
- Continues from the last mock entry (July 2024)
- Brings data up to June 2025
- Skips existing entries to avoid duplicates

## Data Structure

### Weight Entries
Each entry includes:
- Weight in pounds
- Date recorded
- Optional notes
- Timestamps

### User Data
Each user includes:
- Personal information
- Contact details
- Role-based permissions
- Encrypted password

### Medication Data
- Medication name and dosage
- Frequency and duration
- Start/end dates

### Shipment Data
- Order and delivery tracking
- Status updates
- Shipping information

## Troubleshooting

### Database Connection Issues
Ensure your MongoDB instance is running and the connection string in `.env` is correct.

### Duplicate Entries
The `add-recent-data` script automatically checks for existing entries and skips duplicates.

### Permission Issues
Make sure you have write permissions to the database.

## Development Notes

- All passwords are hashed using bcrypt
- Dates are stored in ISO format
- User IDs are MongoDB ObjectIds
- Weight entries are linked to users via userId

## Next Steps

After seeding:
1. Start the backend server: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Log in with demo credentials
4. Explore the weight tracking dashboard
5. Test CRUD operations for weight entries

The seeded data provides a realistic foundation for testing all dashboard features and demonstrating the weight loss journey visualization. 