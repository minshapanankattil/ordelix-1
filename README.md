<p align="center">
  <img src="./img.png" alt="Ordelix Banner" width="100%">
</p>

# ORDELIX 🎯

## Basic Details

### Team Name:Minsha

### Team Members
- Member 1: Minsha
### Hosted Project Link
(https://ordelix-1.vercel.app/)

### Project Description
Ordelix is a premium commerce platform designed specifically for artisan businesses in India. It simplifies complex business operations like labor-intensive pricing, material tracking, and order management through an elegant, professional interface.

### The Problem Statement
Artisan-led brands often struggle with scaling their operations due to manual tracking of raw materials and the difficulty of accurately pricing handmade products that involve varying levels of labor and complexity.

### The Solution
Ordelix provides an "Artisan Studio" that automates stock tracking, offers AI-driven pricing suggestions based on material costs and labor hours, and provides a streamlined dashboard for managing orders and customer relationships.

---

## Technical Details

### Technologies Used

**For Software:**
- **Languages:** JavaScript (ES6+), CSS3, HTML5
- **Framework:** Next.js 16 (App Router), React 19
- **Backend/SDK:** Appwrite Web SDK
- **Storage:** Local JSON Database (File System based for prototype)
- **Deployment:**Verce
- **Tools:** VS Code, Git, Antigravity (AI-assisted development)

---

## Features

- **Artisan Management Dashboard:** A centralized "Portal" for artisans to view analytics, current orders, and inventory status at a glance.
- **Predictive Stock & Material Intelligence:** Real-time tracking of raw materials with automated pre-order detection if materials are insufficient for a new order.
- **AI-Optimized Pricing Engine:** Calculates recommended retail prices by factored-in labor hours, material costs, and product complexity.
- **Instant Verified Onboarding:** Secure registration flow with automatic role assignment (First User = Admin) and immediate platform access via auto-approval.

---

## Implementation

### Installation
```bash
npm install
```

### Run
```bash
npm run dev
```

---

## Project Documentation

### Screenshots

![Dashboard]([INSERT IMAGE PATH HERE])
*The Artisan Studio Dashboard showing inventory and order summaries.*

![Product Creation]([INSERT IMAGE PATH HERE])
*AI-optimized product setup with material and labor factoring.*

![Order Management]([INSERT IMAGE PATH HERE])
*Streamlined order tracking with status updates and pre-order indicators.*

#### Diagrams

**System Architecture:**
![Architecture Diagram]([INSERT IMAGE PATH HERE])
*Next.js Frontend communicating with a local JSON DB and Appwrite SDK for backend services.*

**Application Workflow:**
![Workflow]([INSERT IMAGE PATH HERE])
*User Signup -> Role Assignment -> Dashboard Access -> Inventory/Order Management.*

---

## API Documentation

**Base URL:** `http://localhost:3000`

##### Endpoints

**POST /api/register**
- **Description:** Registers a new user and automatically approves them.
- **Response:**
```json
{
  "success": true,
  "user": { "id": "...", "role": "admin|user", "status": "approved" }
}
```

**POST /api/login**
- **Description:** Verifies user credentials.
- **Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

**GET /api/products**
- **Description:** Retrieves the list of all artisan products.
- **Response:**
```json
{
  "products": [ ... ]
}
```

**POST /api/orders**
- **Description:** Places a new order and updates material stock levels.

---

## Project Demo

### Video
[INSERT VIDEO LINK HERE - YouTube/Google Drive]

*This video demonstrates the full user journey from landing page to admin dashboard management.*

---

## AI Tools Used

**Tool:** Cursor
**Purpose:** 
- Accelerated the setup of the Next.js project structure.
- Integrated the Appwrite Web SDK for backend verification.
- Implemented core business logic for the local database and user role assignment.
- Generated comprehensive project documentation.

**Key Prompts Used:**
- "Setting up Appwrite SDK in the project depending on if a project already exists or not."
- "needed at first for the admin to sign up, once its signed up dont let anyone sign up as admin."
- "no need admin approval, any one can signup."

---

## Team Contributions
- [INSERT NAME 1]: Full-stack Development, Appwrite Integration, Database Schema.
- [INSERT NAME 2]: UI/UX Design, Frontend Components, Logo Design, Documentation.

---

## License
This project is licensed under the MIT License.

Made with ❤️ at TinkerHub
