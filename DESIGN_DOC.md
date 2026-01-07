# Design Document: MSN Energy Digital Transformation Ecosystem

**Version:** 1.0\
**Status:** Draft / Strategic Alignment\
**Platform:** Cueprise Custom (Azure-Native)\
**Client:** MSN Energy Resource Limited

## 1. Executive Summary

This document outlines the technical design for a customized deployment of the Cueprise ERP platform for **MSN Energy Resource Limited**. The system is engineered to transition MSN Energy from a document-centric operation to a data-driven enterprise. Key focus areas include automated gas trading reconciliation, flare gas commercialization tracking, pipeline project oversight, and a high-security "SCADA-style" access control framework.

## 2. System Architecture & Infrastructure

### 2.1 Sovereign Single-Tenant Deployment

Respecting MSN Energy's requirements for security and scalability, the system will be deployed as a **Sovereign Single-Tenant** solution on Microsoft Azure.

- **Hosting:** Private Azure App Services and Azure SQL Managed Instance.
- **Data Sovereignty:** The database resides exclusively within MSN Energy’s Azure subscription, ensuring physical and legal control over sensitive trading data.
- **Identity:** Integration with **Microsoft Entra ID (Azure AD)** for Single Sign-On (SSO) and Multi-Factor Authentication (MFA).

### 2.2 Connectivity & Resilience

- **Offline-First PWA:** Front-line staff (at depots or construction sites) will use a Progressive Web App capable of offline data entry (nominations, volume logs) with automated synchronization upon reconnection.
- **Audit Trails:** Every transaction, from gas nomination to invoice approval, is logged with an immutable timestamp and user ID.

## 3. Modular Functional Breakdown

### Module 1: Gas Trading & Portfolio Engine

The "Brain" of the system, handling the complexities of multi-producer and multi-off-taker dynamics.

- **Nomination Hub:** Centralized dashboard for off-takers to submit daily/weekly nominations.
- **Reconciliation Logic:** Automated comparison of *Nominated* vs. *Allocated* vs. *Delivered* volumes.
- **Variance Reporting:** Real-time flagging of "Network Operator Attribution" discrepancies.
- **Margin Optimizer:** Dynamic pricing engine that calculates margins based on real-time sourcing costs and off-taker contract terms.

### Module 2: Project & Infrastructure Tracker

Customized for pipeline construction and Flare Gas Commercialization (FGC).

- **Milestone Management:** Gantt-style tracking of pipeline construction progress.
- **FGC Recovery Log:** Specialized tracking of flared vs. recovered gas volumes for regulatory reporting (NMDPRA).
- **Contractor Portal:** Secure area for third-party contractors to upload progress reports and compliance documents.

### Module 3: Financials & Automated ERP

- **Automated Billing:** Invoices generated automatically upon confirmation of attributed volumes from the reconciliation engine.
- **Expense Retirement:** Digital workflow for staff to submit expense claims with receipt uploads via mobile.
- **Naira-Centric Accounting:** Built-in compliance with Nigerian tax laws (VAT, CIT) and IFRS standards.

### Module 4: GRC (Governance, Risk & Compliance)

- **License Vault:** Automated tracker for OGISP, NMDPRA permits, and corporate certifications with 60/30/15-day expiry alerts.
- **Contract Lifecycle:** Repository for Gas Purchase Agreements (GPAs) and Gas Sale Agreements (GSAs) with version control.

## 4. Security Framework (SCADA-Style)

### 4.1 Rank-Based Access Control (RBAC+)

Unlike standard ERP permissions, the MSN Energy deployment implements a "Rank & Role" hierarchy:

- **File Invisibility:** If a user’s rank is lower than a document’s "Sensitivity Level," the file is not just locked—it is invisible in the UI.
- **Approval Authority Limits:** Financial approval limits are tied directly to the user’s rank in the HR module.
- **Admin Lockdown:** Centralized administration portal for instant revocation of access across all modules.

## 5. Implementation Roadmap

| Phase              | Duration | Primary Objective                                              |
| ------------------ | -------- | -------------------------------------------------------------- |
| P1: Discovery      | 4 Weeks  | Workflow mapping for gas nominations and FGC reporting.        |
| P2: Foundation     | 6 Weeks  | Azure provisioning & Entra ID integration.                     |
| P3: Core ERP       | 8 Weeks  | Finance, HR, and Administrative Requisition Go-Live.           |
| P4: Trading Engine | 8 Weeks  | Deployment of Reconciliation and Portfolio Management modules. |
| P5: Optimization   | 4 Weeks  | Stress testing SCADA access controls and final user training.  |

## 6. Expected Outcomes

- **Zero Reconciliation Leakage:** Eliminating revenue loss from uncaptured gas volume variances.
- **Regulatory Peace of Mind:** Automated alerts ensuring no permit or contract expires unnoticed.
- **Operational Transparency:** Real-time visibility into project budgets and employee sales performance.
