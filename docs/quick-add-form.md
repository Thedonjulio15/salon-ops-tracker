# Quick Add form

A Google Form the receptionist uses on her phone. Each submission becomes a row in the Client Log, with the date and time stamped automatically.

The form is built by an Apps Script that the owner runs once from the spreadsheet.

## How the form flows

1. **Page 1:** Salon or Barbershop? (required). The answer decides the next page.
2. **Page 2, Salon details:** Service (Hair, Nails, Makeup, Product), Styles (tick any, plus Other), Product sold. Then skips to page 4.
3. **Page 3, Barbershop details:** Barbershop service (Haircut, Trim, Beard, Haircut and beard, Kids cut, Other).
4. **Page 4, everyone:** Visit type, Worker, Helper (includes "No helper"), Price (R) (numbers only, at least 0), Client name, Phone, Email, Notes.

On submit, the script writes to Client Log:
- Timestamp into Date and time
- Barbershop visits get Service = "Barbershop service"
- "No helper" is saved as blank
- Price saved as a number

## One-time setup (owner, on a computer)

1. Add workers on the **Staff** tab first.
2. In the spreadsheet: **Extensions, then Apps Script**.
3. Delete what's in the editor, paste the code from `src/form_setup.gs`, click Save.
4. Reload the spreadsheet. A **Salon Tracker** menu appears.
5. **Salon Tracker, then Create the Quick Add form (run once)**. Approve Google's permission prompt.
6. Copy the link it shows. Find it again any time under **Salon Tracker, then Show the form links**.

## Daily use (receptionist)

1. Open the form link. Add it to the phone home screen (Chrome: menu, Add to Home screen; Safari: Share, Add to Home Screen).
2. Pick Salon or Barbershop.
3. Fill in the details, worker, helper, price, client name and phone.
4. Submit. The visit appears in Client Log and the dashboards update.

## When staff change

Edit the Staff tab, then **Salon Tracker, then Update worker names in the form**. Workers with Active = "No" are left out.

## Script

The full script is in [`src/form_setup.gs`](../src/form_setup.gs).
