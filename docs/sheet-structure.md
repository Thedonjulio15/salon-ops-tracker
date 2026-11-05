# Google Sheets system (the working build)

- **File:** Salon Tracker (make your own copy)
- **Time zone:** Africa/Johannesburg
- **Font:** Arial throughout
- **Colours:** dark green `#0F6D56` headers with white text, light green `#E1F5EE` banding and panels, mid green `#5BC9A5` for secondary tabs and charts, yellow `#FFF2CC` for cells the user changes

## Why Sheets
- Free, no row or block cap that matters (Client Log sized for about 40,000 visits)
- Charts are free
- Works in the Sheets app on a phone
- A Google Form gives the receptionist a simple phone screen

## Tabs (in order)

| # | Tab | sheetId | Purpose | Tab colour |
|---|---|---|---|---|
| 1 | Start Here | 0 | How-to for owner and receptionist | dark green |
| 2 | Owner Dashboard | 14 | Day and month totals, charts | dark green |
| 3 | Staff Dashboard | 15 | Per-worker and per-department month totals | dark green |
| 4 | Appointments | 12 | Bookings with status | mid green |
| 5 | Upcoming | 13 | Live bookings only, soonest first | mid green |
| 6 | Client Log | 11 | One row per visit (source of all numbers) | mid green |
| 7 | Staff | 16 | Worker list and departments | light green |

## Staff tab

| Column | Header | Input |
|---|---|---|
| A | Name | typed |
| B | Department | dropdown: Salon - Hair, Salon - Nails, Salon - Makeup, Barbershop |
| C | Phone | typed |
| D | Active | dropdown: Yes, No |

Rows 2 to 41 feed the Worker and Helper dropdowns elsewhere (up to 40 workers).

## Client Log tab

Header row frozen, dark green. Alternate rows banded light green by conditional format `=AND($A2<>"",MOD(ROW(),2)=0)`.

| Col | Header | Format / validation |
|---|---|---|
| A | Date and time | `yyyy-mm-dd hh:mm`; date validation on all rows (gives the calendar picker) |
| B | Location | dropdown, strict: Salon, Barbershop |
| C | Service | dropdown, strict: Hair, Nails, Makeup, Product, Barbershop service |
| D | Salon styles | free text (the form writes comma-separated ticks) |
| E | Barbershop service | dropdown, not strict: Haircut, Trim, Beard, Haircut and beard, Kids cut, Other |
| F | Product sold | text |
| G | Visit type | dropdown, strict: Walk-in, Appointment |
| H | Worker | dropdown from `Staff!$A$2:$A$41` |
| I | Helper | dropdown from `Staff!$A$2:$A$41` |
| J | Price (R) | `"R "#,##0.00` |
| K | Client name | text |
| L | Phone | plain text format (keeps leading 0) |
| M | Email | text |
| N | Notes | text |

No tips column, by design.

## Appointments tab

| Col | Header | Notes |
|---|---|---|
| A | Date and time | `ddd d mmm yyyy hh:mm`, date validation |
| B | Client name | |
| C | Phone | plain text |
| D | Email | |
| E | Location | dropdown |
| F | Service | dropdown |
| G | Style or details | text |
| H | Worker | dropdown from Staff |
| I | Status | dropdown: Booked, Confirmed, Arrived, Completed, No-show, Cancelled |
| J | Expected price (R) | rand format |
| K | Notes | |

Status colours: Booked yellow, Confirmed light blue, Arrived light green, Completed grey, No-show light red, Cancelled grey-brown.

## Upcoming tab

- A1 title, A2 explanation
- B3 "Appointments today":
  `=COUNTIFS(Appointments!A:A,">="&TODAY(),Appointments!A:A,"<"&TODAY()+1,Appointments!I:I,"<>Cancelled",Appointments!I:I,"<>No-show")`
- Row 4 headers (same as Appointments)
- A5:
  `=IFERROR(SORT(FILTER(Appointments!A2:K, Appointments!A2:A<>"", (Appointments!I2:I="Booked")+(Appointments!I2:I="Confirmed")+(Appointments!I2:I="Arrived")>0), 1, TRUE), "No upcoming appointments")`

## Owner Dashboard tab

### Inputs (yellow)
| Cell | Label | Default |
|---|---|---|
| B4 | Pick a day | `=TODAY()` |
| B5 | Pick a month (any date in it) | `=TODAY()` |
| B6 | Month starts | `=EOMONTH(B5,-1)+1` |
| B7 | Next month starts | `=EOMONTH(B5,0)+1` |

### Day panel (A9:B16) and month panel (D9:E16)
Same rows on both sides; day uses `$B$4` to `$B$4+1`, month uses `$B$6` to `$B$7`.

| Row | Metric | Day formula (column B) |
|---|---|---|
| 10 | Money made (R) | `=SUMIFS('Client Log'!$J:$J,'Client Log'!$A:$A,">="&$B$4,'Client Log'!$A:$A,"<"&$B$4+1)` |
| 11 | Clients | `=COUNTIFS('Client Log'!$A:$A,">="&$B$4,'Client Log'!$A:$A,"<"&$B$4+1)` |
| 12 | Walk-ins | COUNTIFS with `'Client Log'!$G:$G,"Walk-in"` |
| 13 | Appointments | COUNTIFS with `'Client Log'!$G:$G,"Appointment"` |
| 14 | Salon clients | COUNTIFS with `'Client Log'!$B:$B,"Salon"` |
| 15 | Barbershop clients | COUNTIFS with `'Client Log'!$B:$B,"Barbershop"` |
| 16 | Average spend per client (R) | `=IF(B11=0,0,B10/B11)` |

### Month breakdown tables
- **Service totals (A19:C25):** Hair, Nails, Makeup, Product, Barbershop service, Total. Clients via COUNTIFS on column C, money via SUMIFS, both limited to the month.
- **Location totals (D19:F21):** Salon, Barbershop.
- **Visit type (D23:F25):** Walk-in, Appointment.

### Money per day (A27:C59)
- A29 `=$B$6`, then each row `=IF(A28="","",IF(A28+1<$B$7,A28+1,""))` so it lists every day of the chosen month.
- B and C: COUNTIFS and SUMIFS for that date.

### Busiest days of the week (A62:C70)
Monday to Sunday, using `SUMPRODUCT` with `WEEKDAY(...,2)` limited to the month.

### Charts (all free in Sheets)
| Chart | Type | Data |
|---|---|---|
| Money by service this month (R) | column, dark green | A19:A24 vs C19:C24, anchored H9 |
| Money made per day (R) | column, dark green | A28:A59 vs C28:C59, anchored D27 |
| Busiest days of the week (clients) | column, mid green | A63:A70 vs B63:B70, anchored D45 |

## Staff Dashboard tab

- B4 (yellow): pick a month, default `=TODAY()`
- B5 `=EOMONTH(B4,-1)+1`, B6 `=EOMONTH(B4,0)+1`

### Department totals (A9:D13)
Salon - Hair, Salon - Nails, Salon - Makeup, Barbershop. Each sums the worker table below by department:
`=SUMIFS($C$18:$C$57,$B$18:$B$57,$A10)` (and D, E for money and times helped).

### Every worker (A17:E57)
| Col | Formula (row 18, filled down to 57) |
|---|---|
| A Name | `=IF(Staff!A2="","",Staff!A2)` |
| B Department | `=IF($A18="","",Staff!B2)` |
| C Clients | COUNTIFS on Client Log column H = name, within month |
| D Money brought in (R) | SUMIFS on column J where H = name, within month |
| E Times helped | COUNTIFS on column I = name, within month |

**No salary calculations**, by request.

## Start Here tab
Plain-language instructions: set up staff, log clients, book appointments, read the dashboards, install the Quick Add form. Gridlines hidden, green headings.

## Known limits
- Staff Dashboard shows up to 40 workers.
- Worker names must match the Staff tab exactly, or they won't count.
- Turning an appointment into a client log row is manual.
- Google's date picker picks the date only; time is typed.
