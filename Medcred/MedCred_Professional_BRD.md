# MedCred India - Business Requirements & System Design

## 1. Project Overview

MedCred is a healthcare membership and assistance platform that provides:

- Individual Healthcare Cards
- Family Healthcare Cards
- Mediclaim Support
- Loan Eligibility Services
- Agent-Based User Onboarding
- Hospital Network Access
- Notifications & Reporting

---

# 2. User Registration & Authentication

## Authentication

- JWT Authentication
- Access Token
- Refresh Token
- bcrypt Password Hashing

## Registration Types

### Self Registration
### Agent Assisted Registration

## Registration Fields

- Full Name
- Mobile Number
- Email Address
- Date of Birth
- Gender
- Address
- Aadhaar Number
- Profile Photo

---

# 3. Profile Photo Storage

## Recommended Architecture

React App
→ Request Upload URL
→ Node.js Backend
→ Generate Pre-Signed URL
→ Upload Directly to S3
→ Store URL in MongoDB

## Storage Options

### AWS S3 (Recommended)
- Scalable
- Cost Effective
- Secure

### Cloudinary
- Easier Image Management
- Higher Cost

### VPS Storage
- Suitable for MVP
- Limited Scalability

---

# 4. Aadhaar & KYC Verification

## Verification Options

### DigiLocker Integration
### ABDM / ABHA Verification
### Third Party Providers

- Setu
- Digio
- Protean

## KYC Flow

User Registration
→ OTP Verification
→ Aadhaar Verification
→ KYC Review
→ Approval

---

# 5. OTP Verification

## Workflow

User Registration
→ Generate OTP
→ Store OTP in Redis
→ Send SMS
→ User Enters OTP
→ Verify OTP
→ Account Verified

## Providers

### MSG91
Recommended for India

### Twilio
Recommended for International Users

### Firebase Authentication
Alternative Solution

---

# 6. Card Management

## Card Types

### Individual Card
### Family Card

## Card Benefits

- Mediclaim Eligibility
- Loan Eligibility
- Hospital Access
- Wallet Benefits
- Claim Validation

---

# 7. Individual Card Workflow

User Registration
→ Mobile Verification
→ Aadhaar Verification
→ KYC Approval
→ Plan Selection
→ Payment
→ Card Generation
→ Card Activation

## Card Model

- Card Number
- User ID
- Plan ID
- QR Code
- PDF Card
- Status
- Claim Eligibility
- Validity Period

---

# 8. Family Card Architecture

## Family Master Card

Example:

MCI-FAM-0001

## Member Cards

- Primary Holder
- Spouse
- Children
- Parents

Each member receives an individual member identifier linked to the family card.

---

# 9. Card Status Lifecycle

- Draft
- Mobile Verified
- KYC Pending
- Under Review
- Approved
- Payment Pending
- Active
- Suspended
- Blocked
- Expired
- Rejected

---

# 10. Claim Management

## Claim Types

### Hospital Claim
Maximum: ₹2,00,000

### Home Treatment Claim
Maximum: ₹80,000

## Claim Workflow

Create Claim
→ Upload Documents
→ Fraud Check
→ Admin Review
→ Approval / Rejection
→ Settlement

## Required Documents

- Hospital Bills
- Prescription
- Medical Reports
- Discharge Summary

## Claim Status

- Draft
- Submitted
- Under Review
- Verification Pending
- Approved
- Settled
- Rejected

## Fraud Checks

- Duplicate Bills
- Duplicate Claims
- Expired Cards
- Fake Documents
- Multiple Claims

---

# 11. Loan Eligibility

## Eligibility Criteria

- Card Must Be Active
- 30 Days Waiting Period Completed
- KYC Verified
- No Existing Active Loan

## Result

Eligible / Not Eligible

---

# 12. Hospital Module

## Features

- Hospital Directory
- Hospital Verification
- Claim Supported Hospitals
- Hospital Management

Future Scope:

- Dedicated Hospital Portal
- Claim Verification Workflow

---

# 13. Agent Module

## Agent Lifecycle

Registration
→ KYC Verification
→ Admin Approval
→ Activation
→ User Registration
→ Card Activation
→ Commission Generation
→ Settlement

## Agent Dashboard

- Total Users Registered
- Cards Activated
- Pending Applications
- Commission Earned
- Wallet Balance
- Performance Rating

## Agent Features

- Register Users
- Upload Documents
- Submit KYC
- Track Applications

## Commission Workflow

Agent Registers User
→ User Approved
→ Card Activated
→ Commission Generated
→ Wallet Credited
→ Settlement

---

# 14. Notification System

## Push Notifications
Firebase Cloud Messaging (FCM)

## SMS Notifications
MSG91

## Email Notifications
Amazon SES

## In-App Notifications
MongoDB Collection

---

# 15. Payment Gateway

## Recommended

### Razorpay
- Card Purchases
- Renewals
- Family Plans

### RazorpayX
- Agent Settlements
- Payouts

## Alternatives

- Cashfree
- PayU
- PhonePe
- CCAvenue
- Stripe

---

# 16. Admin Panel

## Dashboard

- User Statistics
- Card Statistics
- Claim Statistics
- Revenue Metrics
- Agent Metrics
- Hospital Metrics

## User Management

- View Users
- Verify Users
- Suspend Users
- Block Users

## Card Management

- Individual Cards
- Family Cards
- Card Approvals
- Renewals

## Claim Management

- Review Claims
- Approve Claims
- Reject Claims
- Fraud Investigation

## Loan Management

- Eligibility Tracking
- Loan Approvals
- Loan History

## Agent Management

- Agent Approval
- Performance Monitoring
- Commission Management

## Hospital Management

- Add Hospitals
- Verify Hospitals
- Manage Claim Support

## KYC Management

- Aadhaar Review
- KYC Approval
- Document Requests

## Notifications

- Push Notifications
- SMS
- Email Campaigns

## Fraud Detection

- Duplicate Aadhaar
- Duplicate Claims
- Suspicious Activities

## Reports

- User Reports
- Claim Reports
- Agent Reports
- Revenue Reports
- Loan Reports

## System Settings

- Plan Pricing
- Card Validity
- Claim Limits
- Agent Incentives

## Role Management

- Super Admin
- Claims Manager
- Agent Manager
- KYC Manager
- Finance Manager
- Support Executive

## Audit Logs

- User Actions
- Admin Actions
- System Events

---

# 17. Reports & Analytics

## Report Categories

### User Reports
### Card Reports
### Claim Reports
### Agent Reports
### Revenue Reports
### Hospital Reports
### Loan Reports
### Fraud Reports

## Export Formats

- Excel
- PDF
- CSV

---

# 18. Technology Stack

## Frontend

- React.js
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## Cache

- Redis

## Storage

- AWS S3

## Notifications

- FCM
- MSG91
- Amazon SES

## Payments

- Razorpay
- RazorpayX

## Authentication

- JWT
- Refresh Tokens
- bcrypt


# 19. Infrastructure & Third-Party Service Costs

## Authentication

### JWT Authentication

Cost: Free

### bcrypt Password Hashing

Cost: Free

### Redis (OTP Storage)

Development:
Free (Local)

Production:
₹500 – ₹1,500/month

Recommended:
Redis Cloud

---

## OTP Verification

### MSG91

Cost Per OTP:
₹0.12 – ₹0.25

Example:

10,000 OTPs/month
≈ ₹1,200 – ₹2,500/month

Recommended for India.

### Twilio

Cost Per OTP:
₹0.50 – ₹2.00+

Recommended for international users.

### Firebase Authentication

Free Tier Available

Pay-as-you-go after free limits.

---

## Profile Photos & Document Storage

### AWS S3 (Recommended)

Storage Cost:
Approximately ₹2 – ₹3 per GB/month

Example:

100 GB Storage
≈ ₹250/month

500 GB Storage
≈ ₹1,000/month

Suitable for:
Profile Photos
Claims Documents
KYC Documents
Card PDFs

### Cloudinary

Free Tier Available

Paid Plans:
₹8,000 – ₹10,000/month

Suitable for image-heavy applications.

### VPS Storage

Included with server cost

Suitable only for MVP stage.

---

## Notifications

### Firebase Cloud Messaging (FCM)

Push Notifications

Cost:
Free

### MSG91 SMS

₹0.12 – ₹0.25 per SMS

### Amazon SES

Email Cost:

First 62,000 Emails/Month
Usually Free (when sent from AWS infrastructure)

After Free Tier:
Approximately $0.10 per 1,000 emails

Very low cost.

---

## Payment Gateway

### Razorpay

Setup Cost:
₹0

Annual Fee:
₹0

Transaction Fee:
Approximately 2% + GST

Example:

₹999 Payment

Gateway Fee:
≈ ₹20

### RazorpayX

Agent Payout Fee:

₹5 + GST per payout

---

## Database

### MongoDB Atlas

Free Tier:
Available

Production Cluster:

₹2,000 – ₹10,000/month

Depends on scale.

Recommended:
M10 Cluster or above for production.

---

## Hosting

### VPS (Recommended Initially)

Hostinger VPS

₹500 – ₹2,000/month

Suitable for:

Backend
Admin Panel
Agent Portal
User Portal

### AWS EC2

₹2,000 – ₹10,000/month

Recommended for scaling.

---

## Domain

.com Domain

₹800 – ₹1,500/year

---

## SSL Certificate

Let's Encrypt

Cost:
Free

---

## Estimated Monthly Cost

### MVP Stage (0 – 1,000 Users)

Hosting:
₹500 – ₹1,000

OTP:
₹500 – ₹2,000

Storage:
₹50 – ₹200

Database:
Free – ₹500

Total:
₹1,000 – ₹4,000/month

---

### Growth Stage (10,000+ Users)

Hosting:
₹2,000 – ₹5,000

OTP:
₹5,000 – ₹20,000

Storage:
₹500 – ₹2,000

Database:
₹2,000 – ₹5,000

Notifications:
₹500 – ₹2,000

Total:
₹10,000 – ₹35,000/month

---

### Enterprise Scale (100,000+ Users)

Hosting:
₹10,000+

Database:
₹10,000+

Storage:
₹5,000+

OTP:
₹20,000+

Total:
₹50,000+/month


# 20. Competitor Analysis

## 1. Star Health Insurance

Category:
Health Insurance Company

Strengths:

* Strong brand recognition
* Large hospital network
* Comprehensive insurance products
* Fast claim processing
* Nationwide presence

Weaknesses:

* Expensive premiums
* Complex claim procedures
* Lengthy policy documentation
* Limited personalization

Opportunity for MedCred:
Provide a simpler onboarding experience and agent-assisted support.

---

## 2. Care Health Insurance

Category:
Health Insurance Company

Strengths:

* Wide range of health plans
* Strong digital presence
* Cashless hospital network
* Good customer support

Weaknesses:

* Premium increases with age
* Claim approval dependency on policy terms
* Difficult policy comparisons for customers

Opportunity for MedCred:
Offer healthcare assistance and eligibility services without complex insurance jargon.

---

## 3. Niva Bupa

Category:
Health Insurance Company

Strengths:

* Digital-first approach
* Good mobile experience
* Strong customer satisfaction
* Fast claim settlement

Weaknesses:

* Higher premium plans
* Limited accessibility for lower-income users

Opportunity for MedCred:
Affordable membership plans and agent-led onboarding.

---

## 4. MediBuddy

Category:
Healthcare Platform

Strengths:

* Online doctor consultations
* Diagnostics integration
* Medicine ordering
* Corporate healthcare solutions

Weaknesses:

* Not focused on card-based healthcare memberships
* Limited financial assistance services
* Limited agent network

Opportunity for MedCred:
Combine healthcare benefits with loan eligibility and membership cards.

---

## 5. Practo

Category:
Healthcare Discovery Platform

Strengths:

* Large doctor network
* Appointment booking
* Strong brand awareness
* Nationwide reach

Weaknesses:

* No healthcare membership model
* No financial assistance features
* No claim support system

Opportunity for MedCred:
Provide benefits beyond appointment booking.

---

## 6. Bajaj Finserv Health

Category:
Healthcare + Financial Services

Strengths:

* Health EMI options
* Financial backing
* Digital healthcare ecosystem
* Strong technology infrastructure

Weaknesses:

* Complex financial products
* Less focus on agent-assisted onboarding

Opportunity for MedCred:
Target semi-urban and rural users through agents.

---

## 7. Ayushman Bharat

Category:
Government Healthcare Program

Strengths:

* Massive reach
* Government trust
* Large beneficiary base
* Cashless healthcare

Weaknesses:

* Eligibility restrictions
* Limited flexibility
* Slow administrative processes

Opportunity for MedCred:
Serve users not covered under government schemes.

---

# MedCred Competitive Advantages

Potential Strengths:

* Agent-driven onboarding
* Individual and family healthcare cards
* Simplified user experience
* Healthcare membership model
* Loan eligibility services
* Claim assistance
* Hospital discovery
* Faster onboarding
* Local language support
* Lower entry cost

---

# Potential Risks

* Dependence on partner hospitals
* Dependence on claim partners
* Regulatory uncertainty
* User confusion between membership and insurance
* Need for strong trust and brand building

---

# Recommended Positioning

MedCred should position itself as:

"Healthcare Membership and Assistance Platform"

Not as:

* Insurance Company
* Loan Provider
* Hospital Management Platform

Core Value Proposition:

"Affordable healthcare access, claim assistance, family healthcare cards, and financial eligibility services through a single platform."


COMPETITORS 
Policybazaar
InsuranceDekho
Turtlemint

Medi Assist
Vidal Health

HealthAssure
Bajaj Finserv Health



# Technology Mapping

## User Registration

Features:

* Self Registration
* Agent Registration
* User Profile Creation

Technology:
React.js + Node.js + Express.js + MongoDB

---

## Authentication

Features:

* Login
* Logout
* Session Management
* Secure APIs

Technology:
JWT + Refresh Tokens + bcrypt + HTTP Only Cookies

Cost:
Free

---

## OTP Verification

Features:

* Mobile Verification
* Login Verification
* Password Reset

Technology:
MSG91 + Redis

Cost:
₹0.12 – ₹0.25 per OTP

---

## Aadhaar Verification

Features:

* Identity Verification
* KYC Verification

Technology:
Digio / Setu / Protean APIs

Cost:
₹1 – ₹10 per verification (depends on provider)

---

## Profile Photo Upload

Features:

* User Photo
* Agent Photo
* Document Storage

Technology:
AWS S3 + Pre-Signed URLs

Cost:
₹2 – ₹3 per GB/month

---

## Individual Card Generation

Features:

* Digital Card
* QR Code
* Card PDF

Technology:
Node.js + QR Generator + PDF Generator + AWS S3

Cost:
Minimal

---

## Family Card Management

Features:

* Family Members
* Relationship Mapping
* Member Cards

Technology:
MongoDB Relationships + Node.js

Cost:
Included

---

## Claim Management

Features:

* Claim Submission
* Document Upload
* Claim Tracking

Technology:
React + Node.js + MongoDB + AWS S3

Cost:
Storage Cost Only

---

## Fraud Detection

Features:

* Duplicate Claims
* Duplicate Aadhaar
* Risk Scoring

Technology:
Node.js Validation Engine + MongoDB Aggregation

Cost:
Included

---

## Loan Eligibility

Features:

* Eligibility Check
* Waiting Period Calculation
* Loan Tracking

Technology:
Node.js Business Rules Engine

Cost:
Included

---

## Hospital Directory

Features:

* Hospital Listing
* Hospital Search
* Claim Enabled Hospitals

Technology:
MongoDB + REST APIs

Cost:
Included

---

## Notifications

Push Notifications

Technology:
Firebase Cloud Messaging (FCM)

Cost:
Free

SMS Notifications

Technology:
MSG91

Cost:
₹0.12 – ₹0.25 per SMS

Email Notifications

Technology:
Amazon SES

Cost:
Approximately ₹8–₹10 per 1,000 emails

In-App Notifications

Technology:
MongoDB Collection

Cost:
Free

---

## Agent Management

Features:

* Agent Registration
* Agent Dashboard
* Agent Wallet
* Agent Tracking

Technology:
React + Node.js + MongoDB

Cost:
Included

---

## Commission Management

Features:

* Commission Calculation
* Settlement Tracking
* Agent Wallet

Technology:
Node.js Scheduler + MongoDB

Cost:
Included

---

## Payment Gateway

Features:

* Card Purchase
* Family Plan Purchase
* Renewals

Technology:
Razorpay

Cost:
~2% + GST per transaction

---

## Agent Payouts

Features:

* Commission Settlements
* Bank Transfers

Technology:
RazorpayX

Cost:
₹5 + GST per payout

---

## Reports & Analytics

Features:

* Revenue Reports
* User Reports
* Claim Reports
* Agent Reports

Technology:
MongoDB Aggregation Pipeline + ExcelJS + PDFKit

Cost:
Free

---

## Admin Panel

Features:

* User Management
* Claim Management
* Agent Management
* Hospital Management

Technology:
React Admin Dashboard + Node.js APIs

Cost:
Included

---

## Database

Technology:
MongoDB Atlas

Cost:
Free Tier Available

Production:
₹2,000 – ₹10,000/month

---

## Cache Layer

Technology:
Redis

Purpose:
OTP Storage
Session Storage
Rate Limiting

Cost:
₹500 – ₹1,500/month

---

## Hosting

Technology:
Hostinger VPS / AWS EC2

Cost:

MVP:
₹500 – ₹2,000/month

Production:
₹2,000 – ₹10,000/month

---

## Monitoring & Logs

Technology:
PM2 + Winston + MongoDB Logs

Cost:
Free

Optional:
Sentry

Cost:
Free Tier Available

---

## Domain & SSL

Domain:
₹800 – ₹1,500/year

SSL:
Let's Encrypt

Cost:
Free
