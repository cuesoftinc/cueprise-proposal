# Design Document: MSN Energy Integrated Digital Platform

**Version:** 2.0  \
**Status:** Client PRD–Aligned Design  \
**Platform:** Cueprise Custom (Azure-Native)  \
**Client:** MSN Energy Resource Limited

---

## 1. Purpose & Alignment

This design document translates MSN Energy Resource Limited’s **Requirements & Digital Systems Brief (PRD)** into a concrete system architecture and functional design. It builds directly on the previously defined Cueprise-based digital transformation vision, expanding it into a fully integrated **gas trading, portfolio management, ERP, projects, compliance, and analytics platform**.

The design ensures:

- Full coverage of stated client requirements
- Preservation of the previously defined **single-tenant, SCADA-style security model**
- Modular scalability to support future growth in trading volumes, projects, and users

---

## 2. Business Context

MSN Energy operates as a **natural gas trading and portfolio management company**, sourcing gas from multiple producers and selling to multiple off-takers. Operations extend beyond trading into:

- Pipeline and gas infrastructure construction
- Flare Gas Commercialization (FGC) projects

The digital platform must therefore unify **commercial trading intelligence** with **operational, financial, regulatory, and administrative systems** under one secure ecosystem.

---

## 3. Solution Architecture Overview

### 3.1 Deployment Model

- **Sovereign Single-Tenant Azure Deployment**
- Dedicated Azure subscription owned by MSN Energy
- No shared databases, compute, or identity layers

**Core Services**

- Azure App Services (private endpoints)
- Azure SQL Managed Instance
- Azure Storage (encrypted blobs for documents)
- Azure Key Vault (secrets, encryption keys)

### 3.2 Identity, Security & Governance

- Microsoft Entra ID (Azure AD) integration
- Mandatory MFA for all users
- Conditional access policies (location, device, risk-based)
- Full audit logging across application, database, and document layers

---

## 4. Functional System Design

### 4.1 Gas Trading & Portfolio Management Engine

**Scope**: End-to-end trading operations from sourcing to revenue realization.

**Key Capabilities**

- Producer master data management
- Off-taker master data management
- Portfolio aggregation across multiple gas sources
- Volume allocation logic across competing demands
- Contract linkage to GPAs and GSAs
- Pricing models (fixed, indexed, blended)
- Real-time margin tracking per counterparty, contract, and period

This module acts as the **commercial intelligence core** of the platform.

---

### 4.2 Nominations Management

- Centralized submission of off-taker nominations (daily / weekly / monthly)
- Historical nomination archive
- Approval workflows with timestamped sign-off
- Automated comparison:
  - Nominated vs Allocated volumes
- Exception and shortfall visibility

Offline-capable PWA enables nomination capture from field or low-connectivity environments.

---

### 4.3 Network Operator Attribution & Reconciliation

- Secure storage of network operator attribution statements
- Automated reconciliation of:
  - Nominated volumes
  - Allocated volumes
  - Delivered volumes
- Variance detection and classification
- Attribution-linked reconciliation approval workflow
- Immutable audit trail for regulatory and commercial disputes

This directly supports **revenue assurance and leakage elimination**.

---

### 4.4 Invoicing, Finance & ERP

**Automated Invoicing**

- Invoice generation triggered by approved attributed volumes
- Pricing pulled directly from linked contracts
- Support for multiple billing cycles

**Financial Controls**

- Approval workflows tied to rank-based authority limits
- Revenue recognition and margin reporting
- Integration-ready accounting layer

**Localization**

- Naira-based accounting
- VAT and CIT handling
- IFRS-aligned financial structure

---

### 4.5 Flare Gas Commercialization (FGC)

- Tracking of flared vs recovered gas volumes
- Revenue tracking from recovered gas
- Regulatory reporting datasets
- Historical performance analysis across FGC sites
- Linkage to permits and regulatory licenses

---

### 4.6 Pipeline & Infrastructure Project Management

- Project setup and categorization
- Milestone and phase tracking (Gantt-style)
- Budget allocation and spend tracking
- Contractor document submission portal
- Progress reporting with financial integration

This module provides **real-time visibility into capital projects**.

---

### 4.7 Digital Workplace & Document Management

- Centralized document control center
- Version control and change history
- Secure collaboration and internal sharing
- Offline synchronization
- Document-level audit trails

Document sensitivity levels integrate directly with rank-based security controls.

---

### 4.8 Human Resources Management

- Employee records and profiles
- Organizational hierarchy definition
- Rank and role mapping
- Rank-based access inheritance across all modules
- Optional leave and attendance management

HR serves as the **authority backbone** for access control enforcement.

---

### 4.9 Administrative Requisitions & Expense Management

- Digital requisition creation
- Multi-level approval workflows
- Disbursement tracking
- Expense retirement submissions
- Mobile receipt uploads
- Full audit trail for internal and external review

---

### 4.10 License & Contract Lifecycle Management

- License and permit registry
- Automated renewal alerts (60 / 30 / 15 days)
- Contract repository with version control
- Expiry notifications and escalation workflows
- Direct linkage to trading, FGC, and project modules

---

## 5. Data Analytics & Reporting

- Monthly operational reports
- Quarterly financial and performance reports
- Historical trend analysis
- Margin, volume, and revenue dashboards
- Executive-level KPIs

All analytics are driven from **single-source-of-truth transactional data**.

---

## 6. Security Model – SCADA-Style Access Control

### 6.1 Rank & Role Enforcement

- Dual-layer access control (Role + Rank)
- File invisibility for unauthorized ranks
- Approval limits enforced system-wide
- Centralized admin console for immediate access revocation

### 6.2 Data Protection

- Encryption at rest and in transit
- Secure backups
- Disaster recovery and business continuity design

---

## 7. Scalability & Extensibility

- Modular system architecture
- Support for:
  - New trading desks
  - Additional projects
  - Increased transaction volumes
  - Expanded user base

Future modules can be deployed without disrupting core operations.

---

## 8. Expected Business Outcomes

- Elimination of gas volume reconciliation leakage
- End-to-end operational and financial transparency
- Strong regulatory and compliance posture
- Faster decision-making through real-time analytics
- Secure, scalable foundation for MSN Energy’s growth
