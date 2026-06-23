#### USER REGISTRATION - JWT + Access token + Refresh token + bcrypt



1\. Self registration 

2\. Agent Registration 



&#x20;

Registration Fields

• Full Name

• Mobile Number

• Email Address

• Date of Birth

• Gender

• Address

• Aadhaar Number

• Profile Photo 



profile photo - Amazon S3 OR VPS 



React

&#x20;↓

Request Upload URL

&#x20;↓

Node Backend

&#x20;↓

Generate S3 Pre-Signed URL

&#x20;↓

React Uploads Directly To S3

&#x20;↓

Store URL In MongoDB





1 Million Users

1,000,000 × 500 KB

= 500 GB



AWS S3:



500 × $0.023

≈ $11.5/month

≈ ₹1,000/month





Cloudinary - $99/month (\~₹8,500/month)

Firebase





### Adhaar Verification 



1\. Direct Access to DigiLocker  

API SetuBecause you are an insurance provider, you qualify as a Regulated Financial Entity. You can register directly on the DigiLocker Requesters Portal as an official "Requester."The Advantage: You will likely pass the government compliance check without friction.The Use Case: This allows you to securely pull digital insurance policies, health records, and verified Aadhaar details directly into your onboarding or claims system for free.

IRDAI Approval



2\. IRDAI and UIDAI Approvals

To legally perform direct Aadhaar-based KYC (e-KYC) for issuing policies or processing claims, you must be recognized under the insurance regulator:



3\. Integration with ABDM (Ayushman Bharat Digital Mission)

As a healthcare insurance player in India, you are required to integrate with the National Health Authority (NHA) ecosystem.ABHA Verification: Instead of just verifying standard Aadhaar, you must register your organization with the ABDM Digital Health Incentive Scheme (DHIS) portal.The Flow: This allows you to verify a user's ABHA (Ayushman Bharat Health Account) ID, which is directly linked to their Aadhaar. This grants you secure, consent-based access to their digital medical histories for instant underwriting and automated



Third-Party Services (Setu, Protean, Digio)





### OTP Verification



React App

&#x20;   ↓

Node.js Backend

&#x20;   ↓

Generate OTP

&#x20;   ↓

Store OTP in Redis

&#x20;   ↓

Send SMS via SMS Provider

&#x20;   ↓

User Enters OTP

&#x20;   ↓

Verify OTP

&#x20;   ↓

Account Verified



Option 1:MSG91 - for india  - ₹0.12 - ₹0.25 per OTP



Option 2:Twilio- For outside india



Option 3: Firebase Authentication







#### CARD CREATION 







1\. INDIVIDUAL PLAN 

2\. Family PLAN 





Mediclaim Eligibility

Loan Eligibility

Hospital Access

Wallet Benefits

Claim Validation







##### INDIVIDUAL PLAN



User Registration

&#x20;       ↓

Mobile OTP Verification

&#x20;       ↓

Aadhaar Verification

&#x20;       ↓

KYC Approved

&#x20;       ↓

Select Plan

&#x20;       ↓

Payment Success

&#x20;       ↓

Generate Individual Card

&#x20;       ↓

Activate Card



MODEL - 

Card {

&#x20;   \_id,



&#x20;   cardNumber,



&#x20;   userId,



&#x20;   planId,



&#x20;   qrCodeUrl,



&#x20;   cardPdfUrl,



&#x20;   status,



&#x20;   claimEligibility,



&#x20;   validityStart,



&#x20;   validityEnd,



&#x20;   createdAt,



&#x20;   updatedAt

}







##### FAMILY CARD - Hybrid CARD 

Family Card:

MCI-FAM-0001



Individual CARD: 

Primary Holder:

MCI-FAM-0001-01



Spouse:

MCI-FAM-0001-02



Son:

MCI-FAM-0001-03



Daughter:

MCI-FAM-0001-04



Family Card

MCI-FAM-0001

&#x20;       │

&#x20;┌──────┼──────┬──────┐

&#x20;│      │      │      │

\-01    -02    -03    -04

Rahul  Priya  Aryan  Neha









#### CARD STATUS

{

&#x20;  DRAFT,

&#x20;  MOBILE\_VERIFIED,

&#x20;  KYC\_PENDING,

&#x20;  UNDER\_REVIEW,

&#x20;  APPROVED,

&#x20;  PAYMENT\_PENDING,

&#x20;  ACTIVE,

&#x20;  SUSPENDED,

&#x20;  BLOCKED,

&#x20;  EXPIRED,

&#x20;  REJECTED

}



#### CLAIM 



1 Hospital - 2 lakh - DIFFERENT FORM 

2 Home treatmnet - 80k 





User Login

↓

Create Claim

↓

Upload Documents

↓

Fraud Check

↓

Admin Review

↓

Approval / Rejection

↓

Settlement







##### Step 1: Create Claim



User clicks:



Create New Claim



Form:



Claim Type

Hospital Name

Treatment Date

Claim Amount

Description



Example:



{

&#x20; "claimType": "Hospital",

&#x20; "hospital": "Apollo Hospital",

&#x20; "amount": 50000

}

##### Step 2: Upload Documents



Documents stored in:



AWS S3



Example:



Hospital Bill

Discharge Summary

Prescription

Medical Reports



Folder:



claims/

&#x20;  claimId/

&#x20;     bill.pdf

&#x20;     prescription.pdf

&#x20;     report.pdf



##### Step 3: Automatic Validation



System checks:



Card Active?

ACTIVE → Continue

EXPIRED → Reject

Claim Limit



Example:



Plan Limit = ₹2,00,000



Claim = ₹2,50,000



Result:



Reject

Duplicate Claim



System checks:



Bill Number

Hospital

Date

Amount



If found:



Flag Claim

Claim Status Lifecycle



DRAFT

↓

SUBMITTED

↓

UNDER\_REVIEW

↓

VERIFICATION\_PENDING

↓

APPROVED

↓

SETTLED



Or:



UNDER\_REVIEW

↓

REJECTED

Admin Claim Review



Admin sees:



User Details

Card Details

Documents

Claim Amount

History



Actions:



Approve

Reject

Request Documents

Flag Fraud

Family Card Claims



Example:



Family Plan Limit

₹2,00,000



Members:



Rahul

Priya

Aryan



Claim:



Aryan → ₹50,000



Remaining:



₹1,50,000



The claim must always be linked to a specific member.



Fraud Prevention



System should automatically detect:



Duplicate Bills

Duplicate Claims

Expired Cards

Fake Documents

Multiple Claims Same Day



Fraud Score:



0-30   Safe

31-60  Review

61-100 High Risk

Settlement



Once approved:



Option A



Direct Bank Transfer



User Bank Account

Option B



Wallet Credit



MedCred Wallet

Database Structure

Claim

{

&#x20;  \_id,



&#x20;  claimNumber,



&#x20;  userId,



&#x20;  cardId,



&#x20;  memberId,



&#x20;  claimType,



&#x20;  hospitalName,



&#x20;  amount,



&#x20;  approvedAmount,



&#x20;  status,



&#x20;  submittedAt

}

Claim Documents

{

&#x20;  claimId,



&#x20;  documentType,



&#x20;  documentUrl

}



### LOAN ELIGIBILITY





Card Active

\+

30 Days Completed

\+

KYC Verified

\+

No Existing Active Loan

=

Eligible





### HOSPITAL - complex



## ADMIN PANEL



### 1\. Dashboard



Purpose:

Provide a centralized overview of platform activity and key business metrics.



Features:

• View total registered users

• View total individual cards

• View total family cards

• View active, expired, suspended, and blocked cards

• View total claims and claim status distribution

• View total agents and active agents

• View partner hospitals

• View platform revenue



Analytics:

• Monthly user registrations

• Revenue trends

• Claim trends

• Agent performance trends

• Card activation trends



2\. User Management



Purpose:

Manage and monitor all registered users.



Features:

• Search users by name, mobile number, Aadhaar number, card number

• View user profile details

• View KYC information

• View linked cards

• View family members

• View claims and loan history

• Verify user accounts

• Suspend user accounts

• Block or unblock users



3\. Card Management



Purpose:

Manage individual and family healthcare cards.



Individual Card Features:

• View card details

• Approve card applications

• Reject card applications

• Activate cards

• Suspend cards

• Block cards

• Renew expired cards



Family Card Features:

• View family card details

• View family members

• Verify family member information

• Approve family member additions

• Manage shared benefits



4\. Claim Management



Purpose:

Review and process mediclaim requests.



Features:

• View all claims

• View claim documents

• Verify hospital details

• Approve claims

• Reject claims

• Request additional documents

• Flag suspicious claims

• Track claim status history



Claim Information:

• Claim number

• User details

• Card details

• Hospital details

• Submitted documents

• Claim amount

• Approved amount

• Claim status



5\. Loan Management



Purpose:

Monitor loan eligibility and loan applications.



Features:

• View loan applications

• Approve or reject loan requests

• Track loan eligibility

• Monitor waiting periods

• Detect duplicate applications

• Monitor active loans



6\. Agent Management



Purpose:

Manage agent onboarding and performance.



Features:

• Approve agents

• Reject agents

• Suspend agents

• Block agents

• View performance metrics

• Monitor user registrations

• Monitor card activations

• View commission history



Agent Information:

• Personal details

• Business details

• Documents

• Wallet balance

• Earnings history



7\. Agent Incentive Management



Purpose:

Manage agent commissions and settlements.



Features:

• Configure registration incentives

• Configure card activation incentives

• Configure bonus programs

• Approve settlements

• Track commission payouts

• Manage agent wallet credits



8\. Hospital Management



Purpose:

Manage partner healthcare providers.



Features:

• Add hospitals

• Edit hospital information

• Verify hospitals

• Activate hospitals

• Suspend hospitals

• Mark hospitals as claim-enabled



Hospital Information:

• Hospital name

• Address

• Contact details

• Specialities

• Claim support status

• Verification status



9\. KYC Management



Purpose:

Review and approve user verification requests.



Features:

• Review Aadhaar verification

• Review identity documents

• Approve KYC

• Reject KYC

• Request additional documents

• Track verification history



10\. Notification Management



Purpose:

Manage communication across the platform.



Features:

• Send broadcast notifications

• Send SMS notifications

• Send email notifications

• Send push notifications

• Schedule notifications

• View notification delivery reports



11\. Wallet \& Transaction Management



Purpose:

Monitor all platform financial transactions.



Features:

• View transaction history

• View wallet balances

• Manage refunds

• Manage incentive payments

• View claim settlements

• View payment records



12\. Fraud Detection Center



Purpose:

Detect and manage suspicious activities.



Features:

• Detect duplicate Aadhaar numbers

• Detect duplicate claims

• Detect fake documents

• Detect multiple accounts

• Detect suspicious activities

• Assign fraud scores



Administrative Actions:

• Flag users

• Suspend users

• Block users

• Clear investigations



13\. Reports \& Analytics



Purpose:

Generate operational and financial reports.



Available Reports:

• User reports

• Card reports

• Claim reports

• Agent reports

• Revenue reports

• Loan reports

• Hospital reports

• Fraud reports



Export Formats:

• Excel

• PDF

• CSV



14\. System Settings



Purpose:

Manage platform-wide configuration.



Card Settings:

• Card validity period

• Plan pricing

• Claim limits



Loan Settings:

• Waiting period

• Maximum loan amount

• Eligibility rules



Agent Settings:

• Commission rates

• Approval rules



15\. Role \& Permission Management



Purpose:

Control admin access and responsibilities.



Roles:

• Super Admin

• Claims Manager

• Agent Manager

• KYC Manager

• Finance Manager

• Support Executive



Features:

• Create roles

• Assign permissions

• Manage access levels



16\. Audit Logs



Purpose:

Maintain a complete history of administrative actions.



Logged Information:

• Admin name

• Action performed

• Module affected

• Date and time

• Previous value

• Updated value

• IP address

• Device information

```



### AGENT REGISTRATION 

Agent Registration

↓

KYC Verification

↓

Admin Approval

↓

Agent Activation

↓

User Registration

↓

Card Activation

↓

Commission Generation

↓

Settlement







#### Agent Dashboard



After login:



Total Users Registered

Cards Activated

Pending Applications

Commission Earned

Wallet Balance

Performance Rating



Agent can:



Create User

Upload Documents

Verify Mobile

Submit KYC



Select Plan

Track Application





Commission Workflow

Agent Registers User

↓

User Approved

↓

Card Activated

↓

Commission Generated

↓

Wallet Credited

↓

Settlement

Settlement Module



Admin reviews commissions.



Pending Settlement

↓

Approved

↓

Paid



Status:



Pending

Approved

Paid

Rejected







### NOTIFICATION

Push Notifications-Firebase Cloud Messaging (FCM)

SMS Notifications-MSG91

Email Notifications-Amazon SES

In-App Notifications-MongoDB Collection





### PAYMENT

| Gateway                                                                                                       | Pricing (Domestic)                            | Setup Fee          | Payouts   | Best For                               |

| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------ | --------- | -------------------------------------- |

| \[Razorpay](https://razorpay.com?utm\_source=chatgpt.com)                                                       | \~2% + GST                                     | ₹0                 | RazorpayX | Startups, SaaS, Healthcare             |

| \[Cashfree Payments](https://www.cashfree.com?utm\_source=chatgpt.com)                                          | 1.6%–1.95% + GST (promotional/plan dependent) | ₹0                 | Excellent | High-volume businesses (\[Cashfree]\[1]) |

| \[PayU](https://payu.in?utm\_source=chatgpt.com)                                                                | Starts around 2% + GST                        | ₹0                 | Good      | Established businesses (\[PayU]\[2])     |

| \[PhonePe Payment Gateway](https://www.phonepe.com/business-solutions/payment-gateway/?utm\_source=chatgpt.com) | Custom                                        | ₹0                 | Limited   | UPI-heavy businesses                   |

| \[CCAvenue](https://www.ccavenue.com?utm\_source=chatgpt.com)                                                   | \~2%+                                          | Often annual plans | Average   | Large enterprises                      |

| \[Stripe India](https://stripe.com/in?utm\_source=chatgpt.com)                                                  | Higher                                        | ₹0                 | Good      | International payments                 |



\[1]: https://www.cashfree.com/payment-gateway-charges/?utm\_source=chatgpt.com "Payment Gateway Charges | Lowest Pricing \& UPI ..."

\[2]: https://payu.in/pricing-test/?utm\_source=chatgpt.com "Pricing Test"





### REPORT



According to the FRD, MedCred should generate:



Daily Reports

Monthly Reports

Claim Analytics

Registration Analytics

Agent Performance Reports

Revenue Reports

Excel Export

PDF Export





### Report Architecture



I would divide reports into 7 major categories.



User Reports

Card Reports

Claim Reports

Agent Reports

Revenue Reports

Hospital Reports

System Reports



