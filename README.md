# RD Management System

A full-stack **Recurring Deposit (RD) Management Platform** inspired by real banking workflows.
The system allows users to create RD accounts, deposit money monthly, track transaction history, calculate maturity payout, and check loan eligibility based on RD deposits.

---

# Project Goal

The goal of this project is to simulate how a **banking RD product works** and demonstrate:

* Financial business logic implementation
* Layered backend architecture
* REST API design
* Database constraints and integrity
* Full-stack integration using React and Spring Boot

---

# Tech Stack

## Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* REST APIs
* Swagger (OpenAPI)

## Frontend

* React
* Material UI
* Axios
* React Router

## Database

* PostgreSQL relational database

## Tools

* Git
* GitHub
* Maven
* Postman

---

# System Architecture

React Frontend
↓
Axios API Requests
↓
Spring Boot Controller Layer
↓
Service Layer (Business Logic)
↓
Repository Layer (JPA)
↓
PostgreSQL Database

The backend follows a **layered architecture** separating controller, service, and repository responsibilities.

---

# Features

## RD Account Management

* Create RD account
* Maintain customer information
* Track RD account status

## Deposit System

* Monthly RD deposit
* Transaction history tracking
* Penalty handling for late payments

## Maturity System

* Automatic maturity payout calculation
* RD cycle restart after payout

## Loan Eligibility System

* Loan eligibility based on RD deposits
* Loan range calculation between **60% – 80% of deposited amount**

---

# Business Rules Implemented

* A **user can have only one active RD account**
* Only **one deposit allowed per month**
* Database constraint prevents duplicate monthly deposits
* Premature closure allowed before maturity

---

# Example API

### Check Loan Eligibility

```
GET /api/rd/{rdId}/loan-eligibility
```

Example Response

```
{
  "eligible": true,
  "minLoanAmount": 18000,
  "maxLoanAmount": 24000
}
```

---

# Project Structure

```
rd-management-system
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
├── frontend
│   ├── components
│   ├── pages
│   └── services
│
├── database
│   └── schema.sql
│
└── docs
    └── swagger-api-docs
```

---

# API Documentation

API documentation is available using **Swagger UI** inside the `docs` folder.

---

# Author

**Yash Ramesh Jagtap**
BSc Computer Science – Savitribai Phule Pune University
Java Backend Developer
