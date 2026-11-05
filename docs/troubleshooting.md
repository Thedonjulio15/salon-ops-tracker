# Fixes and troubleshooting

## Fixed

### Date picker only worked on the first cell (Client Log)
- **Symptom:** typing a date in the first row gave a calendar picker, but other rows in the Date and time column had to be typed by hand.
- **Cause:** Google Sheets only shows the calendar on cells that have date validation or already hold a date. Only the first cell had a date in it.
- **Fix:** added "is a valid date" validation (not strict, with a help message) to the whole Date and time column in **Client Log** and **Appointments**.
- **How to use it now:**
  1. Double-click (or double-tap) a date cell to open the calendar and pick the day.
  2. Type the time after the date, for example `2026-10-13 14:30`. The picker can't pick a time.
  3. For "right now", type `=NOW()`, then copy the cell and Paste special, Values only, so it doesn't keep changing.
- **Better option:** use the Quick Add form, which fills in the date and time itself.

### Notion charts locked
Notion's free plan allows only one chart per workspace, so the system moved to Google Sheets.

### Notion block limit
Notion's free plan caps multi-member workspaces at 1,000 blocks, so the system moved to Google Sheets.

## Troubleshooting guide

| Problem | Likely cause | Fix |
|---|---|---|
| A worker shows 0 on the Staff Dashboard | Name in Client Log doesn't match the Staff tab exactly | Use the dropdown, or fix the spelling |
| A worker is missing from the dropdown | Not on the Staff tab, or below row 41 | Add them in rows 2 to 41 |
| Worker missing from the form | Form not refreshed, or Active = No | Salon Tracker menu, Update worker names in the form |
| Dashboard shows R 0 | Wrong day or month in the yellow cells, or no rows yet | Check the yellow cells |
| Phone number loses the leading 0 | Column not text format | Column L in Client Log and C in Appointments are set to plain text; type numbers there |
| Upcoming says "No upcoming appointments" | No bookings with status Booked, Confirmed or Arrived | Check the Status column |
| Salon Tracker menu doesn't appear | Script not saved, or page not reloaded | Save in Apps Script, reload the sheet |
| Form submissions don't appear in Client Log | Trigger not created or permission not approved | Run Create the Quick Add form again and approve access |
