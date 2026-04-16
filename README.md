# Crime Record Management System (CRMS) v2.4.1

CRMS is a centralized, tactical dashboard designed for modern law enforcement agencies to digitize First Information Reports (FIRs), manage criminal registries, and track the investigation lifecycle. The system prioritizes data integrity and forensic accountability by offloading critical security logic to the database layer using Oracle PL/SQL triggers.

## Tech Stack

* **Frontend:** React.js, TypeScript, Tailwind CSS, Vite
* **Backend:** Java 17, Spring Boot, Spring Data JPA (Hibernate)
* **Database:** Oracle Database (SQL & PL/SQL)
* **Development Tools:** IntelliJ IDEA, VS Code, Oracle SQL Developer

## Project Structure

The repository is organized into three primary modules:

* **/SpringBoot**: The backend REST API. Handles Object-Relational Mapping (ORM), controller routing, and the Global Exception Handler for database constraint violations.
* **/CRMS-DBS**: The frontend React application. Features a tactical dashboard, real-time data filtering, and a forensic audit terminal.
* **/SQL**: Contains the full schema definition, including DDL for tables, native Views, and PL/SQL scripts for triggers and stored procedures.

## Core Features

### 1. Tactical Command Center
A real-time analytics dashboard that aggregates data from Oracle Views to display active warrants, open cases, and recent criminal activities.

### 2. Forensic Audit Ledger (Oracle Triggers)
The system implements a tamper-proof audit trail. Any modification to a case status or criminal record is automatically captured by Oracle AFTER UPDATE/INSERT triggers. These events are logged into an immutable ledger visible in the Audit section of the UI.

### 3. Integrated FIR & Case Management
A streamlined workflow allowing officers to file FIRs and transition them into active investigations. Relational integrity is strictly enforced; a case cannot exist without a valid FIR, and an FIR requires a valid Crime Type classification.

### 4. Database-Level Constraints
Unlike standard applications, CRMS utilizes the database engine to enforce business rules. Unique constraints on National IDs and Foreign Key checks ensure that invalid data is rejected at the storage layer, with errors propagated back to the UI.

## Database Schema

The system is normalized to 3rd Normal Form (3NF) to ensure zero redundancy. Key entities include:

* CRIMINAL: Detailed suspect profiles and tracking.
* FIR: Incident reporting and classification.
* CASE_RECORD: Investigation lifecycle management.
* SYSTEM_AUDIT_LOG: Forensic tracking of every DML operation.
* FIR_CRIMINAL: Junction table managing Many-to-Many relationships between suspects and reports.

## Setup & Installation

### Database Setup
1.  Open Oracle SQL Developer.
2.  Execute the scripts in /SQL/schema.sql to create tables, sequences, and triggers.
3.  (Optional) Run /SQL/data.sql to seed the database with sample tactical data.

### Backend (Spring Boot)
1.  Open the /SpringBoot folder in IntelliJ IDEA.
2.  Update src/main/resources/application.properties with your Oracle credentials.
3.  Run CrmsApplication.java. The API will start on port 8081.

### Frontend (React)
1.  Navigate to the /CRMS-DBS folder.
2.  Install dependencies: npm install.
3.  Start the development server: npm run dev.
4.  Access the dashboard at http://localhost:5173.

## Security & Integrity
* Database Triggers: Automated forensic logging of status changes.
* Exception Handling: Global Spring Boot handlers for ORA-XXXXX database errors.
* Data Integrity: Strict Foreign Key enforcement for evidence and court proceedings.

---
Developers:  Het Mehta, Yash Chaudhary ,C. Deepak,
Academic Context: Database Systems Lab (Manipal Institute of Technology)
