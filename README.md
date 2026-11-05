# Salon & Barbershop Tracker

A free operations system for a salon and barbershop, built on **Google Sheets** and a **Google Form**. The receptionist logs every client from her phone in a few taps. The owner gets live dashboards for daily and monthly takings, busiest days, and each worker's clients and revenue.

Built by [DigiFlow AI](https://github.com/Thedonjulio15) for a real salon and barbershop in South Africa. This repo is the template. It contains no client data.

## The problem

The owner was adding up paper records by hand to work out each worker's performance, and the staff had no visibility into their own numbers. The fix had to cost nothing, work on a phone and be simple enough for someone who doesn't like technology.

## What it does

- **Quick Add form:** a phone-friendly Google Form that branches between Salon and Barbershop. Each submission lands in the Client Log with a timestamp.
- **Owner Dashboard:** money made, number of clients, walk-ins compared with appointments, and average spend, for any day or month. It also has money per day, totals by service and location, and charts of the busiest days of the week.
- **Staff Dashboard:** clients, revenue and "times helped" for each worker and department, for the chosen month.
- **Appointments + Upcoming:** a bookings list with colour-coded status, and a live, sorted view of today's and future bookings.
- **One menu:** the owner can create the form, sync worker names and find the form links from inside the sheet.

## Why Google Sheets

The first version was built in Notion. Notion's free plan allows only one chart per workspace and caps workspaces with several members at 1,000 blocks. Sheets has no limits that matter at this scale: the Client Log has room for about 40,000 visits. Charts are free, and staff already have the app on their phones.

## What's in the repo

| Path | What it is |
|---|---|
| [`src/form_setup.gs`](src/form_setup.gs) | Apps Script that builds the Quick Add form, routes submissions into the Client Log, and adds the menu |
| [`docs/sheet-structure.md`](docs/sheet-structure.md) | Every tab, column, dropdown, formula and chart, so you can rebuild the sheet from scratch |
| [`docs/quick-add-form.md`](docs/quick-add-form.md) | How the form flows, one-time setup, and daily use |
| [`docs/troubleshooting.md`](docs/troubleshooting.md) | Bugs fixed after launch, and common problems with their fixes |

## Setup

1. Build the sheet using [`docs/sheet-structure.md`](docs/sheet-structure.md).
2. Add workers on the **Staff** tab.
3. **Extensions → Apps Script**: paste in `src/form_setup.gs`, save, then reload the sheet.
4. Use **Salon Tracker → Create the Quick Add form (run once)** and approve the permissions.
5. Send the form link to the receptionist and add it to her phone's home screen.

## Stack

Google Sheets (SUMIFS / COUNTIFS / FILTER / SORT dashboards, data validation, conditional formatting, charts) · Google Forms · Google Apps Script (JavaScript)
