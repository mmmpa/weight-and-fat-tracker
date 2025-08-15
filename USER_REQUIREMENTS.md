# User Requirements and Patterns

This document captures specific requirements and patterns mentioned by the user during development.

## Share URL Logic
- **Issue**: Share logic was converting "67.1 -> 067" (incorrect)
- **Fix**: Should convert "67.1 -> 671" (multiply by 10 to preserve one decimal place)
- **Implementation**: Both 3-digit and 4-digit weight formats now multiply by 10 during encoding and divide by 10 during parsing

## App Naming
- **App name**: Changed from "Weight & Fat Tracker" to "1kg"
- **Scope**: Updated in translations, package.json, and page titles

## Pages Removed
- **Dashboard page**: Completely removed including:
  - Route file (`dashboard.tsx`)
  - Route definition in `routes.ts`
  - Navigation links
  - All translations
  - Story files

## Internationalization (i18n) Requirements
All user-facing text must use i18n translations:

### Config Page - Danger Zone
- All danger zone text must be translated
- Includes: title, descriptions, button states, confirmation dialogs, success/error messages

### Monthly Pages
- **Section titles**: Page headers, navigation text
- **Placeholders**: Input field placeholders for weight and fat percentage
- **Table headers**: All column headers
- **Date labels**: "(TODAY)" marker
- **Alert messages**: Validation error messages
- **Graph titles**: Dynamic titles with month/year

### Export-Import Page
- **All text**: Every piece of user-facing text must be translated
- **Status messages**: Processing, success, and error states
- **File format description**: Including notes about legacy format support

## General Patterns
1. **Always run after code changes**:
   - `bun run typecheck`
   - `bun run check:fix`

2. **Translation structure**:
   - Keep English and Japanese translations synchronized
   - Use nested objects for logical grouping
   - Use interpolation for dynamic values (e.g., `{{year}}/{{month}}`)

3. **Error handling**:
   - All error messages should use translation keys
   - Include specific error details when available

4. **UI/UX consistency**:
   - Maintain consistent styling (plain HTML, no modern CSS)
   - Use existing translation keys where possible
   - Follow established navigation patterns