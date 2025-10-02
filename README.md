# FinSync  
**Subscription, Membership, and Warranty Tracker**  

FinSync is a full-stack application designed to help users manage digital subscriptions, memberships, and warranties in one place. The platform provides tracking, reminders, analytics, and management tools to reduce unnecessary renewals and improve financial awareness.  

---

## Features  

### Subscription & Warranty Tracking  
- Detect subscriptions through email/transaction parsing (where supported)  
- Add subscriptions, memberships, or warranties manually  
- Centralized dashboard of all active items  
- Warranty tracking with expiry alerts  

### Notifications  
- Renewal reminders before charges  
- Trial expiration alerts  
- Warranty expiration notifications  

### Analytics  
- Monthly and yearly expense breakdown  
- Usage and cost analysis  
- Recommendations for optimization  

### Management Tools  
- Pause, modify, or cancel subscriptions (where supported)  
- Clear cancellation instructions for manual services  

### Categories  
- Organize items by custom categories (e.g., entertainment, productivity, fitness) 

---

## Screenshots  

![Dashboard](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20105237.png)  
![Expense Insights](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20105307.png)  
![Tracking View](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20105329.png)  
![Categories](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20105339.png)  
![Notifications](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20105348.png)  
![Analytics](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20105546.png)  
![Settings](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20110828.png)  
![Overview](https://github.com/Gagancm/Finsync-Frontend/blob/main/Screenshot%202024-11-22%20110840.png)  

---

## Tech Stack  

- **Frontend:** React, TailwindCSS, Recharts/Chart.js  
- **Backend:** Node.js, Express, Supabase (Auth + DB)  
- **Other:** REST APIs, Notification service, AI-driven insights  

---

## Getting Started  

### Prerequisites  
- Node.js and npm  
- Supabase account (or PostgreSQL instance)  

### Installation  

```bash
# Clone repository
git clone https://github.com/Gagancm/FinSync.git
cd FinSync

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev
