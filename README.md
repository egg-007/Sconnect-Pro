# SportConnect Pro

<p align="center">
  <strong>Municipal sports, associations, activities, members and registrations — managed in one place.</strong>
</p>

<p align="center">
  Native Node.js · EJS · PostgreSQL · Tailwind CSS · Raw SQL
</p>

---

## About the Project

**SportConnect Pro** is a full-stack sports and association management platform designed for municipal sports departments and community organizations.

It centralizes the management of:

- Sports facilities
- Partner associations
- Activities and schedules
- Families and members
- Registrations
- Pricing rules
- Medical eligibility
- Waiting lists
- Capacity controls
- Schedule conflicts
- Registration concurrency

The project was built with a strong focus on understanding the lower-level mechanics of a web application.

Instead of relying on Express or an ORM, SportConnect Pro uses:

- Native `http.createServer`
- Manual routing with `find-my-way`
- Server-side rendering with EJS
- PostgreSQL with the native `pg` driver
- Raw parameterized SQL
- Explicit service and repository layers
- PostgreSQL transactions for concurrency protection

---

## Preview

### Main UI

The interface follows a clean, responsive visual system based on:

- Cream `#F8F1E5`
- Sand `#EAD2A3`
- Plum `#401A4C`
- Orange `#E66B1F`
- Ink `#24142B`

The application includes responsive pages for:

- Home
- Facilities
- Associations
- Activities
- Members
- Registrations
- Checkout
- Dashboard
- Error handling

---

## Tech Stack

### Backend

- Node.js
- Native `node:http`
- `find-my-way`
- `body-parser`
- `serve-static`
- `finalhandler`
- `dotenv`

### Frontend

- EJS
- Tailwind CSS
- Server-side rendering

### Database

- PostgreSQL
- `pg`
- Raw SQL
- Parameterized queries
- ACID transactions
- Row locking with `FOR UPDATE`

### Tooling

- npm
- Git
- GitHub

---

## Architecture

SportConnect Pro uses a layered architecture:

```text
HTTP Request
     ↓
Router
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
```

### Router

Maps HTTP requests to controllers.

### Controller

Handles:

- `req`
- `res`
- form data
- redirects
- rendering

### Service

Contains business rules such as:

- pricing
- eligibility
- capacity validation
- scheduling
- waiting-list promotion

### Repository

Contains raw PostgreSQL queries only.

### Database

Enforces relational integrity with:

- Primary keys
- Foreign keys
- Unique constraints
- Check constraints
- Indexes

---

## Project Structure

```text
sportconnect-pro/
│
├── database/
│   ├── schema.sql
│   ├── seeds.sql
│   └── queries_analytics.sql
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── core/
│   │   ├── router.js
│   │   └── renderer.js
│   │
│   ├── controllers/
│   │   ├── activityController.js
│   │   ├── associationController.js
│   │   ├── facilityController.js
│   │   ├── memberController.js
│   │   └── registrationController.js
│   │
│   ├── services/
│   │   ├── activityService.js
│   │   ├── associationService.js
│   │   ├── eligibilityService.js
│   │   ├── facilityService.js
│   │   ├── memberService.js
│   │   ├── pricingService.js
│   │   ├── registrationService.js
│   │   ├── scheduleService.js
│   │   └── waitingListService.js
│   │
│   ├── repositories/
│   │   ├── activityRepository.js
│   │   ├── associationRepository.js
│   │   ├── familyRepository.js
│   │   ├── facilityRepository.js
│   │   ├── memberRepository.js
│   │   └── registrationRepository.js
│   │
│   └── utils/
│       └── helpers.js
│
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── navbar.ejs
│   │   ├── alerts.ejs
│   │   └── footer.ejs
│   │
│   └── pages/
│       ├── home.ejs
│       ├── dashboard.ejs
│       ├── facilities.ejs
│       ├── facility-form.ejs
│       ├── facility-edit.ejs
│       ├── associations.ejs
│       ├── association-form.ejs
│       ├── association-edit.ejs
│       ├── activities.ejs
│       ├── activity-form.ejs
│       ├── activity-detail.ejs
│       ├── members.ejs
│       ├── member-form.ejs
│       ├── registration-form.ejs
│       ├── checkout.ejs
│       ├── registrations.ejs
│       └── error.ejs
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

# Features

## Facilities Management

- Create facilities
- Display facilities
- Edit facilities
- Delete facilities
- Store ERP capacity
- Support divisible facilities
- Manage facility addresses and types

---

## Associations Management

- Create partner associations
- List associations
- Edit associations
- Delete associations
- Store contact information

---

## Activities & Scheduling

Activities support:

- Association assignment
- Facility assignment
- Season
- Day of week
- Start time
- End time
- Sub-zone
- Maximum capacity
- Base price
- Age category
- Public-access configuration
- Risk-sport configuration
- Activity status

### Schedule Conflict Detection

Two activities conflict when:

```text
same facility
AND
same day
AND
time ranges overlap
AND
same sub-zone OR one uses the full facility
```

The overlap rule is:

```text
existing.start_time < new.end_time
AND
existing.end_time > new.start_time
```

Example:

```text
Existing: 18:00 → 20:00
New:      19:00 → 21:00

Result: Conflict
```

But:

```text
Existing: 18:00 → 20:00
New:      20:00 → 22:00

Result: Allowed
```

---

## ERP Capacity Validation

An activity cannot exceed the capacity of its assigned facility.

```text
activity.max_capacity <= facility.erp_capacity
```

Invalid activities are rejected before insertion.

---

## Families & Members

Members are linked to families.

Stored member information includes:

- First name
- Last name
- Birth date
- Email
- Phone
- Medical certificate date
- Medical status
- Pass'Sport code

Family information includes:

- Family name
- Family quotient
- Resident status
- Address

---

## Age Eligibility

Age categories are calculated for the active season.

```text
Under 6 → Baby-Sport
7–8     → U9
9–10    → U11
11–12   → U13
13–14   → U15
15–17   → U18
18–39   → Senior
40+     → Master
```

If an activity is marked as:

```text
is_all_public = true
```

the age restriction is ignored.

Otherwise, the member category must match the activity category.

---

## Medical Certificate Validation

Standard sports:

```text
Certificate validity = 3 years
```

Risk sports:

```text
Certificate validity = 1 year
```

Possible medical states include:

```text
pending
compliant
medical_non_compliant
```

A non-compliant member can still have their administrative record stored, while their participation status is restricted according to the business rules.

---

# Pricing Engine

The registration price is calculated automatically by the backend.

The browser does **not** choose the final price.

---

## 1. Base Price

Each activity defines:

```text
base_price
```

---

## 2. Resident / Non-Resident

Resident:

```text
price = base_price
```

Non-resident:

```text
price = base_price × 1.35
```

---

## 3. Family Discount

Based on previous registrations from the same family during the same season:

```text
1st registration → 0%
2nd registration → -15%
3rd+             → -30%
```

---

## 4. Family Quotient

```text
QF < 600
→ -40%

600 ≤ QF ≤ 900
→ -20%

QF > 900
→ no additional reduction
```

---

## 5. Pass'Sport

A valid Pass'Sport code applies:

```text
- €50
```

---

## 6. Minimum Price

The final price cannot be lower than:

```text
€15
```

---

## 7. Payment Plans

The user can select:

```text
1 payment
```

or:

```text
3 payments
```

For three payments:

```text
Payment 1 → 40%
Payment 2 → 30%
Payment 3 → 30%
```

The first payment absorbs any cent-level rounding difference.

---

# Registrations

The registration flow validates:

1. Member existence
2. Activity existence
3. Family existence
4. Age eligibility
5. Medical compliance
6. Pricing rules
7. Activity capacity
8. Duplicate registrations
9. Availability

The final registration stores:

- Member
- Activity
- Final price
- Status
- Payment plan
- Registration date

---

# Waiting List

When an activity reaches its maximum capacity, the member is moved to:

```text
waiting_list
```

instead of creating a normal confirmed registration.

Residents receive a priority bonus.

A waiting candidate can move through states such as:

```text
waiting
promoted_pending
confirmed
expired
cancelled
```

When a place becomes available:

```text
first candidate
      ↓
promoted_pending
      ↓
48-hour deadline
```

The deadline is calculated with:

```sql
NOW() + INTERVAL '48 hours'
```

If the candidate does not confirm before the deadline:

```text
status = expired
```

and the next candidate can be promoted.

---

# Anti-Overbooking

Registration is protected with PostgreSQL transactions and pessimistic row locking.

Example flow:

```sql
BEGIN;
```

Lock the activity:

```sql
SELECT id, max_capacity
FROM activities
WHERE id = $1
FOR UPDATE;
```

Count existing confirmed registrations.

If capacity remains:

```sql
INSERT INTO registrations (...);
```

Then:

```sql
COMMIT;
```

On error:

```sql
ROLLBACK;
```

This prevents two simultaneous requests from taking the same final place.

---

# Database

The application uses 7 main PostgreSQL tables:

```text
facilities
associations
activities
families
members
registrations
waiting_list
```

## Relationships

```text
associations 1 ─── N activities
facilities   1 ─── N activities

families     1 ─── N members

members      1 ─── N registrations
activities   1 ─── N registrations

members      1 ─── N waiting_list
activities   1 ─── N waiting_list
```

---

# Database Integrity

The schema uses:

- Primary keys
- Foreign keys
- `NOT NULL`
- `CHECK`
- `UNIQUE`
- Indexes

Examples:

```sql
CHECK (erp_capacity > 0)
```

```sql
CHECK (start_time < end_time)
```

```sql
UNIQUE (member_id, activity_id)
```

---

# SQL Security

All dynamic SQL uses placeholders.

Example:

```js
const result = await pool.query(
    `
    SELECT *
    FROM facilities
    WHERE id = $1
    `,
    [id]
);
```

This avoids unsafe SQL string concatenation.

---

# UI

SportConnect Pro uses a responsive Tailwind CSS interface.

## Palette

```text
Cream  #F8F1E5
Sand   #EAD2A3
Plum   #401A4C
Orange #E66B1F
Ink    #24142B
```

The UI includes:

- Shared header
- Shared footer
- Responsive navigation
- CRUD forms
- Responsive tables
- Activity cards
- Registration flow
- Checkout summary
- Error pages
- Dashboard views

---

# Installation

## Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- Git

---

## Clone

```bash
git clone YOUR_REPOSITORY_URL
```

Enter the project:

```bash
cd sportconnect-pro
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Database

```bash
createdb -U postgres sportconnect_pro
```

---

## Execute Schema

```bash
psql -U postgres -d sportconnect_pro -f database/schema.sql
```

---

## Insert Seed Data

```bash
psql -U postgres -d sportconnect_pro -f database/seeds.sql
```

---

# Environment Configuration

Create:

```text
.env
```

Example:

```env
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=sportconnect_pro
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432
```

Do not commit `.env`.

---

# Run

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

---

# Routes

## Home

```text
GET /
```

---

## Facilities

```text
GET  /facilities
GET  /facilities/create
GET  /facilities/:id
GET  /facilities/:id/edit

POST /facilities
POST /facilities/:id/update
POST /facilities/:id/delete
```

---

## Associations

```text
GET  /associations
GET  /associations/create
GET  /associations/:id
GET  /associations/:id/edit

POST /associations
POST /associations/:id/update
POST /associations/:id/delete
```

---

## Activities

```text
GET  /activities
GET  /activities/create
GET  /activities/:id

POST /activities
```

---

## Members

```text
GET  /members
GET  /members/create

POST /members
```

---

## Registrations

```text
GET  /registrations
GET  /registrations/create

POST /registrations
```

---

# Key Test Scenarios

The project validates scenarios including:

### Infrastructure

- Valid facility creation
- Negative ERP capacity rejected
- Invalid foreign keys rejected

### Scheduling

- Valid free schedule accepted
- Overlapping schedule rejected
- Different sub-zones accepted
- Full-facility overlap rejected
- ERP capacity violation rejected

### Eligibility

- Valid age category accepted
- Wrong age category rejected
- Expired certificate detected
- Risk-sport certificate rule applied

### Pricing

- Resident pricing
- Non-resident +35%
- Second family registration -15%
- Third+ family registration -30%
- QF under 600
- QF between 600 and 900
- Pass'Sport deduction
- €15 minimum
- Three-payment rounding

### Registrations

- Duplicate registration blocked
- Full activity redirected to waiting list
- Concurrent final-place registrations protected

### Waiting List

- Resident priority bonus
- Automatic promotion
- 48-hour confirmation deadline
- Expired promotion
- Next candidate promotion

---

# Design Principles

SportConnect Pro was developed around four core principles:

### No hidden framework magic

The HTTP lifecycle is handled explicitly using native Node.js.

### Business logic stays out of controllers

Pricing, eligibility and scheduling belong in services.

### SQL stays out of views and business services

Database operations belong in repositories.

### PostgreSQL protects critical consistency

Transactions, foreign keys, constraints and locks protect application integrity.

---

# What I Learned

This project provided practical experience with:

- Native Node.js HTTP
- Server-side routing
- Request/response lifecycle
- EJS
- PostgreSQL
- Raw SQL
- Parameterized queries
- Relational modeling
- Repository pattern
- Service layer architecture
- CRUD design
- Business-rule modeling
- Time-overlap algorithms
- Pricing algorithms
- Transactions
- `FOR UPDATE`
- Concurrency
- Waiting-list algorithms
- Responsive UI design
- Git workflow

---

# Author

**Achraf Abdelhakim Es-saloua**

Full-Stack Web Developer  
YouCode — 2026/2027

---

# License

This project was created for educational purposes as part of the YouCode curriculum.
