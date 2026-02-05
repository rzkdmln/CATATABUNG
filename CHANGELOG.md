# Changelog - CATATABUNG v2.1.0

## [2.1.0] - Des 2023 (Professional Green Update)

### UI/UX Improvements
- **Professional Green Theme**: Migrated to a modern Emerald Green (#10B981) palette globally.
- **Improved Dark Mode**: Dark mode is now independent and can be toggled manually without following system settings.
- **Enhanced Dashboard**:
  - Changed label "Total Kekayaan Bersih" to "**Total uang kamu**".
  - Refactored transaction lists to `FlatList` for smooth scrolling on both Android and iOS.
- **Refined Data Display**: Profile stats now only display "Saldo" for a cleaner professional look.

### Features
- **Custom Categories**: Added the ability to Add and Delete custom categories for both Income and Expenses via the new Settings screen.
- **Excel Export**: Added feature to export all transaction history to `.xlsx` format for external reporting.
- **Saving Goals Enhancements**:
  - Added **Daily & Weekly Saving Targets** estimation based on target date.
  - Fixed database constraint error on `reminder_time`.
- **Version History**: Added a dedicated screen in settings to track application updates.
- **Account Management**: Improved Profile sync with Supabase (Name & Profile Image) and fixed logout logic.

### Bug Fixes
- Fixed scrolling issues on Dashboard and Calendar screens.
- Fixed `reminder_time` check constraint error in Goal management.
- Standardized IDR formatting across all screens.
